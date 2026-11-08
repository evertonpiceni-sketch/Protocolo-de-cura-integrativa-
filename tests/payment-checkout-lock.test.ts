import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { acquireCheckoutCreationLock, PAYMENT_DATABASE_WRITE_LOCK_SCOPE } from '../src/lib/paymentRoutes';

test('lock global serializa snapshots de checkout de usuários e produtos diferentes via Redis', async () => {
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
  const routes = fs.readFileSync('src/lib/paymentRoutes.ts', 'utf8');
  assert.equal(routes.split('await acquireSharedDatabaseWriteLock()').length - 1, 3, 'checkout, confirmação e degustação devem usar o lock global com refresh');
  assert.ok(!routes.includes('`standard:${req.userId}:${productType}`'), 'não pode haver lock separado por usuário/produto');

  // Simula usuário A em assinatura e usuário B em prática individual: ambos usam a mesma chave.
  const first = await acquireCheckoutCreationLock(PAYMENT_DATABASE_WRITE_LOCK_SCOPE, dependencies);
  assert.ok(first);
  const second = await acquireCheckoutCreationLock(PAYMENT_DATABASE_WRITE_LOCK_SCOPE, dependencies);
  assert.equal(second, null);
  await first.assertHeld();
  await first.release();
  const next = await acquireCheckoutCreationLock(PAYMENT_DATABASE_WRITE_LOCK_SCOPE, dependencies);
  assert.ok(next);
  await next.release();
});
