import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

test('InfinitePay exige API Key para links single_payment e falha fechado sem criar pedido', async () => {
  const cwd = process.cwd();
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'payment-api-key-test-'));
  const previous = {
    nodeEnv: process.env.NODE_ENV,
    apiKey: process.env.INFINITEPAY_API_KEY,
    handle: process.env.INFINITEPAY_HANDLE,
    appUrl: process.env.PUBLIC_APP_URL,
    upstashUrl: process.env.UPSTASH_REDIS_REST_URL,
    upstashToken: process.env.UPSTASH_REDIS_REST_TOKEN,
    kvUrl: process.env.KV_REST_API_URL,
    kvToken: process.env.KV_REST_API_TOKEN,
    upstashKvUrl: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL,
    upstashKvToken: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN,
    upstashRestUrl: process.env.UPSTASH_REDIS_REST_REST_API_URL,
    upstashRestToken: process.env.UPSTASH_REDIS_REST_REST_API_TOKEN
  };
  let server: any;
  process.chdir(folder);
  process.env.NODE_ENV = 'test';
  delete process.env.INFINITEPAY_API_KEY;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
  delete process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
  delete process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;
  delete process.env.UPSTASH_REDIS_REST_REST_API_URL;
  delete process.env.UPSTASH_REDIS_REST_REST_API_TOKEN;
  process.env.INFINITEPAY_HANDLE = 'evertonterapeutareiki';
  let providerCalls = 0;
  try {
    const { initializeDb, getDb } = await import('../src/db.js');
    const { paymentRoutes } = await import('../src/lib/paymentRoutes.js');
    await initializeDb();
    getDb().users.push({ id: 'owner', plan: 'free', profile: {} });
    const provider = async () => {
      providerCalls += 1;
      return new Response(JSON.stringify({ url: 'https://checkout.infinitepay.io/test' }), { status: 200 });
    };
    const app = express();
    app.use(express.json());
    app.use('/api', paymentRoutes(
      (req: any, _res: any, next: any) => { req.userId = 'owner'; next(); },
      (_req: any, _res: any, next: any) => next(),
      provider as typeof fetch
    ));
    server = app.listen(0, '127.0.0.1');
    await new Promise<void>(resolve => server.once('listening', resolve));
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    const response = await fetch(`http://127.0.0.1:${address.port}/api/payment/create-checkout`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ productType: 'subscription', planId: 'jornada_7d', paymentMethod: 'pix' })
    });
    assert.equal(response.status, 503);
    assert.equal(providerCalls, 0);
    assert.equal(getDb().paymentOrders?.length || 0, 0);
  } finally {
    if (server) await new Promise<void>(resolve => server.close(resolve));
    process.chdir(cwd);
    fs.rmSync(folder, { recursive: true, force: true });
    if (previous.nodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previous.nodeEnv;
    if (previous.apiKey === undefined) delete process.env.INFINITEPAY_API_KEY; else process.env.INFINITEPAY_API_KEY = previous.apiKey;
    if (previous.handle === undefined) delete process.env.INFINITEPAY_HANDLE; else process.env.INFINITEPAY_HANDLE = previous.handle;
    if (previous.appUrl === undefined) delete process.env.PUBLIC_APP_URL; else process.env.PUBLIC_APP_URL = previous.appUrl;
    if (previous.upstashUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL; else process.env.UPSTASH_REDIS_REST_URL = previous.upstashUrl;
    if (previous.upstashToken === undefined) delete process.env.UPSTASH_REDIS_REST_TOKEN; else process.env.UPSTASH_REDIS_REST_TOKEN = previous.upstashToken;
    if (previous.kvUrl === undefined) delete process.env.KV_REST_API_URL; else process.env.KV_REST_API_URL = previous.kvUrl;
    if (previous.kvToken === undefined) delete process.env.KV_REST_API_TOKEN; else process.env.KV_REST_API_TOKEN = previous.kvToken;
    if (previous.upstashKvUrl === undefined) delete process.env.UPSTASH_REDIS_REST_KV_REST_API_URL; else process.env.UPSTASH_REDIS_REST_KV_REST_API_URL = previous.upstashKvUrl;
    if (previous.upstashKvToken === undefined) delete process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN; else process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN = previous.upstashKvToken;
    if (previous.upstashRestUrl === undefined) delete process.env.UPSTASH_REDIS_REST_REST_API_URL; else process.env.UPSTASH_REDIS_REST_REST_API_URL = previous.upstashRestUrl;
    if (previous.upstashRestToken === undefined) delete process.env.UPSTASH_REDIS_REST_REST_API_TOKEN; else process.env.UPSTASH_REDIS_REST_REST_API_TOKEN = previous.upstashRestToken;
  }
});
