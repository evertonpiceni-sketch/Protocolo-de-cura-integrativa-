import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { paymentQuote, PAYMENT_PLANS } from '../src/lib/paymentCatalog';

test('payment prices are authoritative for every approved plan and coupon', () => {
  for (const [id, plan] of Object.entries(PAYMENT_PLANS)) {
    assert.equal(paymentQuote(id).cents, plan.cents);
    assert.equal(paymentQuote(id, 'promo15').cents, Math.round(plan.cents * .85));
    assert.equal(paymentQuote(id, 'PROMO20').cents, Math.round(plan.cents * .8));
  }
  for (const id of ['__proto__', 'missing']) assert.throws(() => paymentQuote(id));
  assert.throws(() => paymentQuote('mensal', 'VIP7'));
});

test('checkout binds account, validates provider confirmation and grants only once', async () => {
  const cwd = process.cwd(); const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'payment-test-'));
  process.chdir(folder); process.env.NODE_ENV = 'test';
  for (const key of Object.keys(process.env)) if (/UPSTASH|KV_REST/.test(key)) delete process.env[key];
  const { getDb, initializeDb } = await import('../src/db');
  const { paymentRoutes } = await import('../src/lib/paymentRoutes');
  await initializeDb(); const db = getDb();
  db.users.push({ id: 'owner', plan: 'free', profile: {} });
  let amount = 1200; let paid = false; const calls: any[] = [];
  const provider = async (url: any, options: any) => {
    calls.push({ url, body: JSON.parse(options.body) });
    return new Response(JSON.stringify(String(url).endsWith('/links') ? { url: 'https://checkout.infinitepay.io/test' } : { success: true, paid, amount }), { status: 200 });
  };
  const app = express(); app.use(express.json());
  app.use('/api', paymentRoutes((req: any, res: any, next: any) => {
    if (!req.headers['x-account']) return res.sendStatus(401);
    req.userId = req.headers['x-account']; next();
  }, (_req: any, _res: any, next: any) => next(), provider as typeof fetch));
  const server = app.listen(0, '127.0.0.1'); await new Promise<void>(r => server.once('listening', r));
  const address = server.address(); assert.ok(address && typeof address !== 'string');
  const call = (route: string, body: any, account = 'owner') => fetch(`http://127.0.0.1:${address.port}/api/${route}`, { method: 'POST', headers: { 'content-type': 'application/json', ...(account ? { 'x-account': account } : {}) }, body: JSON.stringify(body) });
  try {
    assert.equal((await call('payment/create-checkout', {}, '')).status, 401);
    assert.equal((await call('payment/create-checkout', { productType: 'subscription', planId: '__proto__', paymentMethod: 'pix' })).status, 400);
    const checkout = await call('payment/create-checkout', { productType: 'subscription', planId: 'jornada_7d', paymentMethod: 'pix', price: .01, couponCode: 'PROMO20' });
    assert.equal(checkout.status, 200); const { orderId } = await checkout.json();
    assert.equal(calls[0].body.handle, 'evertonterapeutareiki');
    assert.equal(calls[0].body.items[0].price, 1200);
    assert.equal(db.users[0].plan, 'free');
    const body = { order_nsu: orderId, transaction_nsu: 'transaction', slug: 'slug' };
    assert.equal((await call('payment/confirm', body, 'other')).status, 404);
    assert.equal((await call('payment/confirm', body)).status, 202);
    paid = true; amount = 1;
    assert.equal((await call('webhooks/payment', body)).status, 202);
    assert.equal(db.users[0].plan, 'free'); amount = 1200;
    assert.equal((await call('webhooks/payment', body)).status, 200);
    assert.equal(db.users[0].plan, 'pro');
    const individual = await call('payment/create-checkout', { productType: 'specific_treatment', paymentMethod: 'credit', durationDays: 21, category: 'outro', patientDescription: 'Texto sintético privado.', urgentPains: [], couponCode: 'CURA20', price: .01 });
    assert.equal(individual.status, 200);
    const individualOrder = await individual.json();
    assert.equal(calls.at(-1).body.items[0].price, 7992);
    assert.equal(JSON.stringify(calls.at(-1).body).includes('Texto sintético privado'), false);
    amount = 7992;
    assert.equal((await call('webhooks/payment', { order_nsu: individualOrder.orderId, transaction_nsu: 'individual-transaction', invoice_slug: 'individual' })).status, 200);
    assert.equal(db.users[0].profile.specificTreatments.length, 1);
    assert.equal(db.users[0].profile.specificTreatments[0].status, 'pendente');
    assert.equal((await call('payment/create-checkout', { productType: 'specific_treatment', paymentMethod: 'pix', durationDays: 1, category: 'outro', patientDescription: 'Teste', urgentPains: [], customAmount: 1 })).status, 400);
    db.users.push({ id: 'trial-account', plan: 'free', profile: {} });
    const trial = { planId: 'teste_vip_7d', paymentMethod: 'trial', couponCode: 'VIP7' };
    assert.equal((await call('user/upgrade', trial, 'trial-account')).status, 200);
    assert.equal((await call('user/upgrade', trial, 'trial-account')).status, 409);
    const expires = db.users[0].profile.subscriptionExpiresAt;
    assert.equal((await call('payment/confirm', body)).status, 200);
    assert.equal(db.users[0].profile.subscriptionExpiresAt, expires);
  } finally { await new Promise<void>(r => server.close(() => r())); process.chdir(cwd); fs.rmSync(folder, { recursive: true, force: true }); }
});
