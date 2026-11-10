import test from 'node:test';
import assert from 'node:assert/strict';

test('refreshDbFromPersistentStorage substitui snapshot aquecido pela versão atual do Redis', async () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = {
    nodeEnv: process.env.NODE_ENV,
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    key: process.env.UPSTASH_DB_KEY,
    kvUrl: process.env.KV_REST_API_URL,
    kvToken: process.env.KV_REST_API_TOKEN,
    upstashKvUrl: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL,
    upstashKvToken: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN,
    upstashRestUrl: process.env.UPSTASH_REDIS_REST_REST_API_URL,
    upstashRestToken: process.env.UPSTASH_REDIS_REST_REST_API_TOKEN
  };
  let remoteValue = JSON.stringify({ users: [{ id: 'initial-user' }], paymentOrders: [] });
  process.env.NODE_ENV = 'test';
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
  delete process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
  delete process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;
  delete process.env.UPSTASH_REDIS_REST_REST_API_URL;
  delete process.env.UPSTASH_REDIS_REST_REST_API_TOKEN;
  process.env.UPSTASH_REDIS_REST_URL = 'https://redis.test';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
  process.env.UPSTASH_DB_KEY = 'refresh-test-db';
  globalThis.fetch = (async () => new Response(JSON.stringify({ result: remoteValue }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })) as typeof fetch;

  try {
    const database = await import('../src/db.js');
    await database.initializeDb();
    database.getDb().users.push({ id: 'stale-local-user' });
    database.getDb().paymentOrders = [];

    remoteValue = JSON.stringify({
      users: [{ id: 'latest-remote-user' }],
      paymentOrders: [{ id: 'latest-remote-order', userId: 'latest-remote-user', cents: 2500, method: 'pix', createdAt: new Date().toISOString() }]
    });
    await database.refreshDbFromPersistentStorage();

    assert.deepEqual(database.getDb().users, [{ id: 'latest-remote-user' }]);
    assert.equal(database.getDb().paymentOrders?.[0]?.id, 'latest-remote-order');
  } finally {
    globalThis.fetch = originalFetch;
    if (originalEnv.nodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = originalEnv.nodeEnv;
    if (originalEnv.url === undefined) delete process.env.UPSTASH_REDIS_REST_URL; else process.env.UPSTASH_REDIS_REST_URL = originalEnv.url;
    if (originalEnv.token === undefined) delete process.env.UPSTASH_REDIS_REST_TOKEN; else process.env.UPSTASH_REDIS_REST_TOKEN = originalEnv.token;
    if (originalEnv.key === undefined) delete process.env.UPSTASH_DB_KEY; else process.env.UPSTASH_DB_KEY = originalEnv.key;
    if (originalEnv.kvUrl === undefined) delete process.env.KV_REST_API_URL; else process.env.KV_REST_API_URL = originalEnv.kvUrl;
    if (originalEnv.kvToken === undefined) delete process.env.KV_REST_API_TOKEN; else process.env.KV_REST_API_TOKEN = originalEnv.kvToken;
    if (originalEnv.upstashKvUrl === undefined) delete process.env.UPSTASH_REDIS_REST_KV_REST_API_URL; else process.env.UPSTASH_REDIS_REST_KV_REST_API_URL = originalEnv.upstashKvUrl;
    if (originalEnv.upstashKvToken === undefined) delete process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN; else process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN = originalEnv.upstashKvToken;
    if (originalEnv.upstashRestUrl === undefined) delete process.env.UPSTASH_REDIS_REST_REST_API_URL; else process.env.UPSTASH_REDIS_REST_REST_API_URL = originalEnv.upstashRestUrl;
    if (originalEnv.upstashRestToken === undefined) delete process.env.UPSTASH_REDIS_REST_REST_API_TOKEN; else process.env.UPSTASH_REDIS_REST_REST_API_TOKEN = originalEnv.upstashRestToken;
  }
});
