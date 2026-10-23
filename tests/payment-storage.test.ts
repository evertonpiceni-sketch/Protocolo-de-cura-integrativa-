import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeStoredChanges } from '../src/lib/dbMerge';

test('stale profile sync preserves a concurrent confirmed payment and unrelated content', () => {
  const base = { users: [{ id: 'u', plan: 'free', profile: { name: 'Antes', miniResult: { approved: true } } }], paymentOrders: [] };
  const local = structuredClone(base); local.users[0].profile.name = 'Depois';
  const remote: any = structuredClone(base); remote.users[0].plan = 'pro'; remote.users[0].profile.subscriptionPlan = 'jornada_7d'; remote.paymentOrders.push({ id: 'paid', paidAt: '2026-10-23' });
  const merged = mergeStoredChanges(base, local, remote);
  assert.equal(merged.users[0].plan, 'pro'); assert.equal(merged.users[0].profile.name, 'Depois');
  assert.equal(merged.paymentOrders[0].id, 'paid'); assert.deepEqual(merged.users[0].profile.miniResult, { approved: true });
});
test('simultaneous orders survive and conflicting payment edits fail closed', () => {
  const base = { users: [], paymentOrders: [] };
  const merged = mergeStoredChanges(base, { ...base, paymentOrders: [{ id: 'a' }] }, { ...base, paymentOrders: [{ id: 'b' }] });
  assert.deepEqual(merged.paymentOrders.map((o: any) => o.id).sort(), ['a','b']);
  assert.throws(() => mergeStoredChanges({ transaction: null }, { transaction: 'a' }, { transaction: 'b' }), /PERSISTENCE_CONFLICT/);
});
test('persistent CAS retries preserve payments and refreshed workers see new accounts', async () => {
  const originalFetch = globalThis.fetch;
  process.env.NODE_ENV = 'test'; process.env.UPSTASH_REDIS_REST_URL = 'https://payment-db.example.test'; process.env.UPSTASH_REDIS_REST_TOKEN = 'fixture-only';
  let raw = JSON.stringify({ users: [{ id: 'u', plan: 'free', profile: { name: 'Antes' } }], paymentOrders: [] }); let conflicts = 0;
  globalThis.fetch = (async (input: any, options: any) => {
    const parts = options?.method === 'POST' ? JSON.parse(options.body) : new URL(String(input)).pathname.slice(1).split('/').map(decodeURIComponent);
    if (parts[0] === 'get') return Response.json({ result: raw });
    assert.equal(parts[0], 'eval');
    assert.equal(options.method, 'POST');
    assert.equal(new URL(String(input)).pathname, '/');
    const expected = parts.at(-2), next = parts.at(-1)!;
    if (raw !== expected) { conflicts++; return Response.json({ result: 0 }); }
    raw = next; return Response.json({ result: 1 });
  }) as typeof fetch;
  try {
    const { initializeDb, getDb, saveDb } = await import('../src/db'); await initializeDb();
    getDb().users[0].profile.name = 'Depois';
    const remote = JSON.parse(raw); remote.users[0].plan = 'pro'; remote.paymentOrders.push({ id: 'confirmed' }); raw = JSON.stringify(remote);
    await saveDb(); const stored = JSON.parse(raw);
    assert.equal(conflicts, 1); assert.equal(stored.users[0].plan, 'pro'); assert.equal(stored.users[0].profile.name, 'Depois'); assert.equal(stored.paymentOrders.length, 1);
    stored.users.push({ id: 'new-account', plan: 'free', profile: {} }); raw = JSON.stringify(stored);
    assert.equal(getDb().users.length, 1); await initializeDb(true); assert.equal(getDb().users.length, 2);
  } finally { globalThis.fetch = originalFetch; }
});
