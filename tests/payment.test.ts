import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { paymentQuote, PAYMENT_PLANS, specificTreatmentCouponDiscount, specificTreatmentQuote } from '../src/lib/paymentCatalog';

test('payment prices are authoritative for every approved plan and coupon', () => {
  for (const [id, plan] of Object.entries(PAYMENT_PLANS)) {
    assert.equal(paymentQuote(id).cents, plan.cents);
    assert.equal(paymentQuote(id, 'promo15').cents, Math.round(plan.cents * .85));
    assert.equal(paymentQuote(id, 'PROMO20').cents, Math.round(plan.cents * .8));
  }
  for (const id of ['__proto__', 'missing']) assert.throws(() => paymentQuote(id));
  assert.throws(() => paymentQuote('mensal', 'VIP7'));
});

test('specific treatment coupons accept only the current approved promotional codes', () => {
  assert.equal(specificTreatmentCouponDiscount('promo15'), 15);
  assert.equal(specificTreatmentCouponDiscount('PROMO20'), 20);
  assert.equal(specificTreatmentCouponDiscount(''), 0);
  for (const code of ['CURA10', 'PAZ10', 'PAZ20', 'CURA20', 'GRATIDAO', 'PROMO30', 'CURA30', 'PICENI50', 'VIP50', 'VIP7']) {
    assert.equal(specificTreatmentCouponDiscount(code), null);
  }
  const modal = fs.readFileSync('src/components/SpecificTreatmentModal.tsx', 'utf8');
  const routes = fs.readFileSync('src/lib/paymentRoutes.ts', 'utf8');
  assert.ok(modal.includes('specificTreatmentCouponDiscount(rawCode)'));
  assert.ok(modal.includes('Ex.: PROMO15, PROMO20'));
  assert.ok(routes.includes('specificTreatmentQuote(durationDays, code)'));
  assert.ok(!modal.includes('CURA10'));
  assert.ok(!routes.includes('CURA10'));
});

test('specific treatments use only the fixed approved 7-day and 21-day prices', () => {
  assert.equal(specificTreatmentQuote(7).cents, 5990);
  assert.equal(specificTreatmentQuote(21).cents, 9990);
  assert.equal(specificTreatmentQuote(7, 'PROMO15').cents, 5092);
  assert.equal(specificTreatmentQuote(21, 'PROMO20').cents, 7992);
  assert.throws(() => specificTreatmentQuote(1));
  assert.throws(() => specificTreatmentQuote(7, 'VIP7'));
  const modal = fs.readFileSync('src/components/SpecificTreatmentModal.tsx', 'utf8');
  assert.ok(modal.includes('useState<7 | 21>(21)'));
  assert.ok(!modal.includes('isCustomPrice'));
  assert.ok(!modal.includes('customPriceInput'));
  assert.ok(!modal.includes('customAmount'));
  assert.ok(!modal.includes('Sessão Única'));
});

test('checkout binds account, validates provider confirmation and grants only once', async () => {
  const cwd = process.cwd(); const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'payment-test-'));
  process.chdir(folder); process.env.NODE_ENV = 'test';
  for (const key of Object.keys(process.env)) if (/UPSTASH|KV_REST/.test(key)) delete process.env[key];
  const { getDb, initializeDb } = await import('../src/db');
  const { paymentRoutes } = await import('../src/lib/paymentRoutes');
  await initializeDb(); const db = getDb();
  db.users.push({ id: 'owner', plan: 'free', profile: {} });
  let amount = paymentQuote('jornada_7d', 'PROMO20').cents; let paid = false; const calls: any[] = [];
  let holdNumerologyLink = false;
  let signalNumerologyLink: (() => void) | undefined;
  let releaseNumerologyLink: (() => void) | undefined;
  const numerologyLinkStarted = new Promise<void>(resolve => { signalNumerologyLink = resolve; });
  const numerologyLinkGate = new Promise<void>(resolve => { releaseNumerologyLink = resolve; });
  const provider = async (url: any, options: any) => {
    const body = JSON.parse(options.body);
    calls.push({ url, body });
    if (holdNumerologyLink && String(url).endsWith('/links') && body.items?.[0]?.description === 'Mapa Numerológico Cabalístico Completo') {
      signalNumerologyLink?.();
      await numerologyLinkGate;
    }
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
    assert.equal(calls[0].body.items[0].price, paymentQuote('jornada_7d', 'PROMO20').cents);
    assert.equal(db.users[0].plan, 'free');
    const body = { order_nsu: orderId, transaction_nsu: 'transaction', slug: 'slug' };
    assert.equal((await call('payment/confirm', body, 'other')).status, 404);
    assert.equal((await call('payment/confirm', body)).status, 202);
    paid = true; amount = 1;
    assert.equal((await call('webhooks/payment', body)).status, 202);
    assert.equal(db.users[0].plan, 'free'); amount = paymentQuote('jornada_7d', 'PROMO20').cents;
    assert.equal((await call('webhooks/payment', body)).status, 200);
    assert.equal(db.users[0].plan, 'pro');
    const legacyCoupon = await call('payment/create-checkout', { productType: 'specific_treatment', paymentMethod: 'credit', durationDays: 21, category: 'outro', patientDescription: 'Texto sintético privado.', urgentPains: [], couponCode: 'CURA20' });
    assert.equal(legacyCoupon.status, 400);
    const individual = await call('payment/create-checkout', { productType: 'specific_treatment', paymentMethod: 'credit', durationDays: 21, category: 'outro', patientDescription: 'Texto sintético privado.', urgentPains: [], couponCode: 'PROMO20', price: .01 });
    assert.equal(individual.status, 200);
    const individualOrder = await individual.json();
    assert.equal(calls.at(-1).body.items[0].price, 7992);
    assert.equal(JSON.stringify(calls.at(-1).body).includes('Texto sintético privado'), false);
    amount = 7992;
    assert.equal((await call('webhooks/payment', { order_nsu: individualOrder.orderId, transaction_nsu: 'individual-transaction', invoice_slug: 'individual' })).status, 200);
    assert.equal(db.users[0].profile.specificTreatments.length, 1);
    assert.equal(db.users[0].profile.specificTreatments[0].status, 'pendente');
    assert.equal((await call('payment/create-checkout', { productType: 'specific_treatment', paymentMethod: 'pix', durationDays: 1, category: 'outro', patientDescription: 'Teste', urgentPains: [] })).status, 400);
    assert.equal((await call('payment/create-checkout', { productType: 'specific_treatment', paymentMethod: 'pix', durationDays: 7, category: 'outro', patientDescription: 'Teste', urgentPains: [], customAmount: 100 })).status, 400);
    const fixedSevenDay = await call('payment/create-checkout', { productType: 'specific_treatment', paymentMethod: 'pix', durationDays: 7, category: 'outro', patientDescription: 'Texto sintético privado.', urgentPains: [], couponCode: 'PROMO15', price: .01 });
    assert.equal(fixedSevenDay.status, 200);
    assert.equal(calls.at(-1).body.items[0].price, 5092);

    db.users.push({ id: 'numerology-owner', plan: 'free', profile: {} });
    paid = false; amount = 9000; holdNumerologyLink = true;
    const firstNumerologyCheckout = call('payment/create-checkout', { productType: 'numerology_full', paymentMethod: 'pix', price: 0.01 }, 'numerology-owner');
    await numerologyLinkStarted;
    const concurrentNumerologyCheckout = await call('payment/create-checkout', { productType: 'numerology_full', paymentMethod: 'pix' }, 'numerology-owner');
    assert.equal(concurrentNumerologyCheckout.status, 409);
    releaseNumerologyLink?.();
    const numerologyCheckout = await firstNumerologyCheckout;
    holdNumerologyLink = false;
    assert.equal(numerologyCheckout.status, 200);
    const numerologyOrder = await numerologyCheckout.json();
    assert.equal(numerologyOrder.checkoutUrl, 'https://checkout.infinitepay.io/test');
    assert.equal(calls.at(-1).body.items[0].price, 9000);
    const linkCallsAfterFirstNumerology = calls.filter(c => String(c.url).endsWith('/links')).length;
    const repeatedNumerologyCheckout = await call('payment/create-checkout', { productType: 'numerology_full', paymentMethod: 'pix' }, 'numerology-owner');
    assert.equal(repeatedNumerologyCheckout.status, 200);
    const repeatedNumerologyOrder = await repeatedNumerologyCheckout.json();
    assert.equal(repeatedNumerologyOrder.orderId, numerologyOrder.orderId);
    assert.equal(repeatedNumerologyOrder.checkoutUrl, numerologyOrder.checkoutUrl);
    assert.equal(calls.filter(c => String(c.url).endsWith('/links')).length, linkCallsAfterFirstNumerology);
    assert.equal(db.paymentOrders?.filter(o => o.userId === 'numerology-owner' && o.productType === 'numerology_full').length, 1);
    assert.equal(db.users.find(u => u.id === 'numerology-owner')?.profile.numerologyPurchased, undefined);
    const numerologyBody = { order_nsu: numerologyOrder.orderId, transaction_nsu: 'numerology-transaction', slug: 'numerology' };
    assert.equal((await call('payment/confirm', numerologyBody, 'numerology-owner')).status, 202);
    paid = true; amount = 8999;
    assert.equal((await call('webhooks/payment', numerologyBody)).status, 202);
    assert.equal(db.users.find(u => u.id === 'numerology-owner')?.profile.numerologyPurchased, undefined);
    amount = 9000;
    assert.equal((await call('webhooks/payment', numerologyBody)).status, 200);
    assert.equal(db.users.find(u => u.id === 'numerology-owner')?.profile.numerologyPurchased, true);
    assert.equal(db.users.find(u => u.id === 'numerology-owner')?.plan, 'free');
    assert.equal((await call('payment/create-checkout', { productType: 'numerology_full', paymentMethod: 'pix' }, 'numerology-owner')).status, 409);
    db.users.push({ id: 'coupon-owner', plan: 'free', profile: {} });
    assert.equal((await call('payment/create-checkout', { productType: 'numerology_full', paymentMethod: 'pix', couponCode: 'PROMO20' }, 'coupon-owner')).status, 400);

    db.users.push({ id: 'trial-account', plan: 'free', profile: {} });
    const trial = { planId: 'teste_vip_7d', paymentMethod: 'trial', couponCode: 'VIP7' };
    assert.equal((await call('user/upgrade', trial, 'trial-account')).status, 200);
    assert.equal((await call('user/upgrade', trial, 'trial-account')).status, 409);
    const expires = db.users[0].profile.subscriptionExpiresAt;
    assert.equal((await call('payment/confirm', body)).status, 200);
    assert.equal(db.users[0].profile.subscriptionExpiresAt, expires);
  } finally { await new Promise<void>(r => server.close(() => r())); process.chdir(cwd); fs.rmSync(folder, { recursive: true, force: true }); }
});
