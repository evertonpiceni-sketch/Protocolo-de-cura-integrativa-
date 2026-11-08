import test from 'node:test';
import assert from 'node:assert/strict';
import { acquireCheckoutCreationLock } from '../src/lib/paymentRoutes';

test('checkout lock serializa duas instâncias independentes via Redis e libera por token', async () => {
  const records = new Map<string, { token: string; expiresAt: number }>();
  const fakeRedisCommand = async (command: string, args: string[]) => {
    if (command === 'set') {
      const [key, token, nx, px, ttl] = args;
      assert.equal(nx, 'nx');
      assert.equal(px, 'px');
      const current = records.get(key);
      if (current && current.expiresAt > Date.now()) return null;
      records.set(key, { token, expiresAt: Date.now() + Number(ttl) });
      return 'OK';
    }
    if (command === 'eval') {
      const [script, , key, token, ttl] = args;
      const current = records.get(key);
      if (!current || current.token !== token) return 0;
      if (script.includes('pexpire')) {
        current.expiresAt = Date.now() + Number(ttl);
        return 1;
      }
      if (script.includes('del')) {
        records.delete(key);
        return 1;
      }
    }
    throw new Error(`Comando Redis inesperado: ${command}`);
  };
  const dependencies = {
    hasPersistentDatabase: () => true,
    redisCommand: fakeRedisCommand as any,
    ttlMs: 1000,
    renewIntervalMs: 10_000
  };
  const first = await acquireCheckoutCreationLock('standard:parallel-owner:subscription', dependencies);
  assert.ok(first);
  const second = await acquireCheckoutCreationLock('standard:parallel-owner:subscription', dependencies);
  assert.equal(second, null);
  await first.assertHeld();
  await first.release();
  const next = await acquireCheckoutCreationLock('standard:parallel-owner:subscription', dependencies);
  assert.ok(next);
  await next.release();
});
