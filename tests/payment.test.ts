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

test('Numerology checkout lock renews its distributed Redis lease until release', async () => {
  const { acquireNumerologyCheckoutLock } = await import('../src/lib/paymentRoutes');
  let activeToken: string | undefined;
  let expiresAt = 0;
  const fakeRedisCommand = async (command: string, args: string[]) => {
    if (command === 'set') {
      const [, token, nx, px, ttl] = args;
      assert.equal(nx, 'nx');
      assert.equal(px, 'px');
      if (activeToken && expiresAt > Date.now()) return null;
      activeToken = token;
      expiresAt = Date.now() + Number(ttl);
      return 'OK';
    }
    if (command === 'eval') {
      const [script, , , token, ttl] = args;
      if (activeToken !== token) return 0;
      if (script.includes('pexpire')) {
        if (expiresAt <= Date.now()) return 0;
        expiresAt = Date.now() + Number(ttl);
        return 1;
      }
      if (script.includes('del')) {
        activeToken = undefined;
        expiresAt = 0;
        return 1;
      }
    }
    throw new Error(`Unexpected Redis command: ${command}`);
  };

  const lock = await acquireNumerologyCheckoutLock('renewal-test', {
    hasPersistentDatabase: () => true,
    redisCommand: fakeRedisCommand as any,
    ttlMs: 300,
    renewIntervalMs: 40
  });
  assert.ok(lock);
  await new Promise(resolve => setTimeout(resolve, 650));
  assert.ok(expiresAt > Date.now(), 'o heartbeat renova o TTL antes de o lock expirar');
  await lock.assertHeld();
  await lock.release();
  assert.equal(activeToken, undefined, 'a liberação remove somente o lock adquirido');
});

test('Numerology checkout lock fails closed after losing its Redis lease', async () => {
  const { acquireNumerologyCheckoutLock } = await import('../src/lib/paymentRoutes');
  let activeToken: string | undefined;
  let allowRenewal = true;
  const fakeRedisCommand = async (command: string, args: string[]) => {
    if (command === 'set') {
      const [, token] = args;
      activeToken = token;
      return 'OK';
    }
    if (command === 'eval') {
      const [script, , , token] = args;
      if (activeToken !== token) return 0;
      if (script.includes('pexpire')) return allowRenewal ? 1 : 0;
      if (script.includes('del')) { activeToken = undefined; return 1; }
    }
    throw new Error(`Unexpected Redis command: ${command}`);
  };

  const lock = await acquireNumerologyCheckoutLock('lost-lease-test', {
    hasPersistentDatabase: () => true,
    redisCommand: fakeRedisCommand as any,
    ttlMs: 300,
    renewIntervalMs: 1000
  });
  assert.ok(lock);
  allowRenewal = false;
  await assert.rejects(lock.assertHeld(), /proteção do checkout expirou/i);
  await lock.release();
  assert.equal(activeToken, undefined);
});

test('standard checkout recovery lock serializes requests across independent instances', async () => {
  const { acquireCheckoutCreationLock } = await import('../src/lib/paymentRoutes');
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
      if (!current || current.token !== token || current.expiresAt <= Date.now()) return 0;
      if (script.includes('pexpire')) {
        current.expiresAt = Date.now() + Number(ttl);
        return 1;
      }
      if (script.includes('del')) {
        records.delete(key);
        return 1;
      }
    }
    throw new Error(`Unexpected Redis command: ${command}`);
  };

  const dependencies = {
    hasPersistentDatabase: () => true,
    redisCommand: fakeRedisCommand as any,
    ttlMs: 300,
    renewIntervalMs: 40
  };
  // Each call represents a separate serverless instance sharing the same Redis.
  const firstInstance = await acquireCheckoutCreationLock('standard:parallel-owner:subscription', dependencies);
  assert.ok(firstInstance);
  const secondInstance = await acquireCheckoutCreationLock('standard:parallel-owner:subscription', dependencies);
  assert.equal(secondInstance, null, 'Redis NX prevents a second instance from claiming the same order recovery');
  await firstInstance.assertHeld();
  await firstInstance.release();
  const nextInstance = await acquireCheckoutCreationLock('standard:parallel-owner:subscription', dependencies);
  assert.ok(nextInstance, 'the next instance can acquire the lock after release');
  await nextInstance.release();
});

test('checkout binds account, validates provider confirmation and grants only once', async () => {
  const cwd = process.cwd(); const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'payment-test-'));
  const originalEnv = {
    apiKey: process.env.INFINITEPAY_API_KEY,
    handle: process.env.INFINITEPAY_HANDLE,
    appUrl: process.env.PUBLIC_APP_URL
  };
  process.chdir(folder); process.env.NODE_ENV = 'test';
  process.env.INFINITEPAY_API_KEY = 'test-only-infinitepay-key';
  for (const key of Object.keys(process.env)) if (/UPSTASH|KV_REST/.test(key)) delete process.env[key];
  const { getDb, initializeDb, saveDb } = await import('../src/db');
  const { paymentRoutes } = await import('../src/lib/paymentRoutes');
  await initializeDb(); const db = getDb();
  db.users.push({ id: 'owner', plan: 'free', profile: {} });
  let amount = paymentQuote('jornada_7d', 'PROMO20').cents; let paid = false; const calls: any[] = [];
  let providerLinkCreated = false;
  let failNextPostProviderSave = false;
  let failNextPreProviderSave = false;
  let failNextStandardLink = false;
  let holdNumerologyLink = false;
  let failNextNumerologyLink = false;
  let signalNumerologyLink: (() => void) | undefined;
  let releaseNumerologyLink: (() => void) | undefined;
  const numerologyLinkStarted = new Promise<void>(resolve => { signalNumerologyLink = resolve; });
  const numerologyLinkGate = new Promise<void>(resolve => { releaseNumerologyLink = resolve; });
  const provider = async (url: any, options: any) => {
    const body = JSON.parse(options.body);
    calls.push({ url, body, headers: options.headers });
    if (String(url).endsWith('/links')) {
      const persistedOrder = db.paymentOrders?.find(order => order.id === body.order_nsu);
      assert.deepEqual(persistedOrder?.checkoutPayload, body, 'o payload é persistido antes da primeira chamada ao provedor');
    }
    if (String(url).endsWith('/links') && body.items?.[0]?.description !== 'Mapa Numerológico Cabalístico Completo' && failNextStandardLink) {
      failNextStandardLink = false;
      throw new Error('simulated standard provider interruption before URL response');
    }
    if (String(url).endsWith('/links') && body.items?.[0]?.description === 'Mapa Numerológico Cabalístico Completo') {
      if (failNextNumerologyLink) {
        failNextNumerologyLink = false;
        throw new Error('simulated response interruption after request dispatch');
      }
      if (holdNumerologyLink) {
        signalNumerologyLink?.();
        await numerologyLinkGate;
      }
    }
    if (String(url).endsWith('/links')) providerLinkCreated = true;
    return new Response(JSON.stringify(String(url).endsWith('/links') ? { url: 'https://checkout.infinitepay.io/test' } : { success: true, paid, amount }), { status: 200 });
  };
  const saveCheckoutOrder = async () => {
    if (failNextPreProviderSave) {
      failNextPreProviderSave = false;
      throw new Error('simulated persistence outage before provider recovery replay');
    }
    if (providerLinkCreated && failNextPostProviderSave) {
      failNextPostProviderSave = false;
      throw new Error('simulated persistence outage after provider returned checkout URL');
    }
    await saveDb();
  };
  const app = express(); app.use(express.json());
  app.use('/api', paymentRoutes((req: any, res: any, next: any) => {
    if (!req.headers['x-account']) return res.sendStatus(401);
    req.userId = req.headers['x-account']; next();
  }, (_req: any, _res: any, next: any) => next(), provider as typeof fetch, saveCheckoutOrder));
  const server = app.listen(0, '127.0.0.1'); await new Promise<void>(r => server.once('listening', r));
  const address = server.address(); assert.ok(address && typeof address !== 'string');
  const call = (route: string, body: any, account = 'owner') => fetch(`http://127.0.0.1:${address.port}/api/${route}`, { method: 'POST', headers: { 'content-type': 'application/json', ...(account ? { 'x-account': account } : {}) }, body: JSON.stringify(body) });
  try {
    assert.equal((await call('payment/create-checkout', {}, '')).status, 401);
    assert.equal((await call('payment/create-checkout', { productType: 'subscription', planId: '__proto__', paymentMethod: 'pix' })).status, 400);

    db.users.push({ id: 'no-api-key-owner', plan: 'free', profile: {} });
    const providerCallsBeforeMissingKey = calls.length;
    delete process.env.INFINITEPAY_API_KEY;
    const missingApiKeyCheckout = await call('payment/create-checkout', { productType: 'subscription', planId: 'jornada_7d', paymentMethod: 'pix' }, 'no-api-key-owner');
    assert.equal(missingApiKeyCheckout.status, 503);
    assert.equal(calls.length, providerCallsBeforeMissingKey, 'sem API Key não cria link reutilizável');
    assert.equal(db.paymentOrders?.some(order => order.userId === 'no-api-key-owner') ?? false, false);
    process.env.INFINITEPAY_API_KEY = 'test-only-infinitepay-key';

    const checkout = await call('payment/create-checkout', { productType: 'subscription', planId: 'jornada_7d', paymentMethod: 'pix', price: .01, couponCode: 'PROMO20' });
    assert.equal(checkout.status, 200); const { orderId } = await checkout.json();
    assert.equal(calls[0].body.handle, 'evertonterapeutareiki');
    assert.equal(calls[0].body.items[0].price, paymentQuote('jornada_7d', 'PROMO20').cents);
    assert.equal(calls[0].body.options.single_payment, true);
    assert.equal(calls[0].headers['X-Api-Key'], 'test-only-infinitepay-key');
    assert.ok(db.paymentOrders?.find(order => order.id === orderId)?.checkoutPayload?.options.single_payment);
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

    // A falha da persistência prévia não consome o único replay nem encerra o pedido pendente.
    db.users.push({ id: 'precall-save-owner', plan: 'free', profile: {} });
    const precallSaveBody = { productType: 'subscription', planId: 'jornada_7d', paymentMethod: 'pix' };
    providerLinkCreated = false;
    failNextStandardLink = true;
    const interruptedStandardLink = await call('payment/create-checkout', precallSaveBody, 'precall-save-owner');
    assert.equal(interruptedStandardLink.status, 503);
    const precallOrder = db.paymentOrders?.find(order => order.userId === 'precall-save-owner' && order.productType === 'subscription');
    assert.ok(precallOrder);
    assert.equal(precallOrder.failedAt, undefined);
    assert.equal(precallOrder.checkoutUrl, undefined);
    assert.equal(precallOrder.checkoutRecoveryAttempts, undefined);
    const callsBeforePrecallPersistenceFailure = calls.filter(entry => entry.body.order_nsu === precallOrder.id).length;

    failNextPreProviderSave = true;
    const failedPrecallPersistence = await call('payment/create-checkout', precallSaveBody, 'precall-save-owner');
    assert.equal(failedPrecallPersistence.status, 503);
    assert.equal(precallOrder.checkoutRecoveryAttempts, undefined, 'a tentativa é revertida se a gravação prévia falhar');
    assert.equal(precallOrder.failedAt, undefined, 'o pedido existente permanece recuperável');
    assert.equal(calls.filter(entry => entry.body.order_nsu === precallOrder.id).length, callsBeforePrecallPersistenceFailure, 'o provedor não é chamado quando a gravação prévia falha');

    const recoveredAfterPrecallFailure = await call('payment/create-checkout', precallSaveBody, 'precall-save-owner');
    assert.equal(recoveredAfterPrecallFailure.status, 200);
    const recoveredAfterPrecallData = await recoveredAfterPrecallFailure.json();
    assert.equal(recoveredAfterPrecallData.orderId, precallOrder.id);
    assert.equal(precallOrder.checkoutRecoveryAttempts, 1);
    assert.equal(calls.filter(entry => entry.body.order_nsu === precallOrder.id).length, callsBeforePrecallPersistenceFailure + 1);
    assert.equal(db.paymentOrders?.filter(order => order.userId === 'precall-save-owner' && order.productType === 'subscription').length, 1);

    // Uma URL criada pelo provedor não pode virar um pedido órfão se a gravação final falhar.
    db.users.push({ id: 'retry-subscription-owner', plan: 'free', profile: {} });
    const retrySubscriptionBody = { productType: 'subscription', planId: 'jornada_7d', paymentMethod: 'pix', couponCode: 'PROMO15' };
    providerLinkCreated = false;
    failNextPostProviderSave = true;
    const failedSubscriptionSave = await call('payment/create-checkout', retrySubscriptionBody, 'retry-subscription-owner');
    assert.equal(failedSubscriptionSave.status, 503);
    const retrySubscriptionOrder = db.paymentOrders?.find(order => order.userId === 'retry-subscription-owner' && order.productType === 'subscription');
    assert.ok(retrySubscriptionOrder);
    assert.equal(retrySubscriptionOrder.failedAt, undefined, 'não marca como falha após o provedor já ter criado a URL');
    assert.ok(retrySubscriptionOrder.checkoutPayload);
    delete retrySubscriptionOrder.checkoutUrl; // simula a instância seguinte lendo o snapshot persistido antes da URL.
    const subscriptionCallsBeforeRecovery = calls.filter(entry => entry.body.order_nsu === retrySubscriptionOrder.id).length;
    const recoveredSubscription = await call('payment/create-checkout', retrySubscriptionBody, 'retry-subscription-owner');
    assert.equal(recoveredSubscription.status, 200);
    const recoveredSubscriptionData = await recoveredSubscription.json();
    assert.equal(recoveredSubscriptionData.orderId, retrySubscriptionOrder.id);
    assert.equal(recoveredSubscriptionData.recovered, true);
    assert.equal(retrySubscriptionOrder.checkoutRecoveryAttempts, 1);
    assert.equal(calls.filter(entry => entry.body.order_nsu === retrySubscriptionOrder.id).length, subscriptionCallsBeforeRecovery + 1);
    assert.equal(db.paymentOrders?.filter(order => order.userId === 'retry-subscription-owner' && order.productType === 'subscription').length, 1);
    const subscriptionCallsAfterRecovery = calls.length;
    const repeatedSubscription = await call('payment/create-checkout', retrySubscriptionBody, 'retry-subscription-owner');
    assert.equal(repeatedSubscription.status, 200);
    assert.equal((await repeatedSubscription.json()).orderId, retrySubscriptionOrder.id);
    assert.equal(calls.length, subscriptionCallsAfterRecovery, 'a URL já persistida é reutilizada sem criar outro link');

    db.users.push({ id: 'retry-limit-owner', plan: 'free', profile: {} });
    const retryLimitBody = { productType: 'subscription', planId: 'jornada_7d', paymentMethod: 'pix', couponCode: 'PROMO15' };
    providerLinkCreated = false;
    failNextPostProviderSave = true;
    const firstLimitFailure = await call('payment/create-checkout', retryLimitBody, 'retry-limit-owner');
    assert.equal(firstLimitFailure.status, 503);
    const retryLimitOrder = db.paymentOrders?.find(order => order.userId === 'retry-limit-owner' && order.productType === 'subscription');
    assert.ok(retryLimitOrder);
    delete retryLimitOrder.checkoutUrl;
    providerLinkCreated = false;
    failNextPostProviderSave = true;
    const failedRecoverySave = await call('payment/create-checkout', retryLimitBody, 'retry-limit-owner');
    assert.equal(failedRecoverySave.status, 503);
    assert.equal(retryLimitOrder.checkoutRecoveryAttempts, 1);
    delete retryLimitOrder.checkoutUrl;
    const retryLimitCalls = calls.filter(entry => entry.body.order_nsu === retryLimitOrder.id).length;
    const blockedRepeatedRecovery = await call('payment/create-checkout', retryLimitBody, 'retry-limit-owner');
    assert.equal(blockedRepeatedRecovery.status, 503);
    assert.equal(calls.filter(entry => entry.body.order_nsu === retryLimitOrder.id).length, retryLimitCalls, 'não cria novas URLs depois do único replay automático permitido');

    db.users.push({ id: 'retry-treatment-owner', plan: 'free', profile: {} });
    const retryTreatmentBody = {
      productType: 'specific_treatment', paymentMethod: 'pix', durationDays: 7,
      category: 'outro', patientDescription: 'Mesmo pedido de teste de recuperação.',
      urgentPains: ['dor de cabeça'], title: 'Recuperação de teste', couponCode: 'PROMO15'
    };
    providerLinkCreated = false;
    failNextPostProviderSave = true;
    const failedTreatmentSave = await call('payment/create-checkout', retryTreatmentBody, 'retry-treatment-owner');
    assert.equal(failedTreatmentSave.status, 503);
    const retryTreatmentOrder = db.paymentOrders?.find(order => order.userId === 'retry-treatment-owner' && order.productType === 'specific_treatment');
    assert.ok(retryTreatmentOrder);
    assert.equal(retryTreatmentOrder.failedAt, undefined);
    assert.ok(retryTreatmentOrder.checkoutPayload);
    delete retryTreatmentOrder.checkoutUrl;
    const treatmentCallsBeforeRecovery = calls.filter(entry => entry.body.order_nsu === retryTreatmentOrder.id).length;
    const recoveredTreatment = await call('payment/create-checkout', retryTreatmentBody, 'retry-treatment-owner');
    assert.equal(recoveredTreatment.status, 200);
    const recoveredTreatmentData = await recoveredTreatment.json();
    assert.equal(recoveredTreatmentData.orderId, retryTreatmentOrder.id);
    assert.equal(recoveredTreatmentData.recovered, true);
    assert.equal(retryTreatmentOrder.checkoutRecoveryAttempts, 1);
    assert.equal(calls.filter(entry => entry.body.order_nsu === retryTreatmentOrder.id).length, treatmentCallsBeforeRecovery + 1);
    assert.equal(db.paymentOrders?.filter(order => order.userId === 'retry-treatment-owner' && order.productType === 'specific_treatment').length, 1);

    db.users.push({ id: 'legacy-standard-owner', plan: 'free', profile: {} });
    db.paymentOrders?.push({
      id: 'legacy-standard-link', userId: 'legacy-standard-owner', productType: 'subscription',
      planId: 'jornada_7d', cents: paymentQuote('jornada_7d').cents, method: 'pix',
      createdAt: new Date().toISOString(), checkoutUrl: 'https://checkout.infinitepay.io/legacy-standard'
    });
    const beforeLegacyStandard = calls.length;
    const legacyStandardAttempt = await call('payment/create-checkout', { productType: 'subscription', planId: 'jornada_7d', paymentMethod: 'pix' }, 'legacy-standard-owner');
    assert.equal(legacyStandardAttempt.status, 503);
    assert.equal(calls.length, beforeLegacyStandard, 'link legado sem single_payment exige conciliação e não é substituído automaticamente');

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
    db.users.push({ id: 'preparing-owner', plan: 'free', profile: {} });
    process.env.INFINITEPAY_HANDLE = 'original-handle';
    process.env.PUBLIC_APP_URL = 'https://original.example';
    const linksBeforeRecovery = calls.filter(c => String(c.url).endsWith('/links')).length;
    failNextNumerologyLink = true;
    const interruptedInitial = await call('payment/create-checkout', { productType: 'numerology_full', paymentMethod: 'pix' }, 'preparing-owner');
    assert.equal(interruptedInitial.status, 503);
    const pendingNumerologyOrder = db.paymentOrders?.find(order => order.userId === 'preparing-owner' && order.productType === 'numerology_full') as import('../src/lib/paymentRoutes').PaymentOrder | undefined;
    assert.ok(pendingNumerologyOrder);
    assert.equal(pendingNumerologyOrder.failedAt, undefined, 'uma falha de resposta não encerra o pedido nem cria outro NSU');
    assert.equal(pendingNumerologyOrder.checkoutUrl, undefined);
    assert.ok(pendingNumerologyOrder.checkoutPayload);
    const originalPayload = structuredClone(pendingNumerologyOrder.checkoutPayload!);
    process.env.INFINITEPAY_HANDLE = 'changed-handle';
    process.env.PUBLIC_APP_URL = 'https://changed.example';

    const recoveredRetry = await call('payment/create-checkout', { productType: 'numerology_full', paymentMethod: 'pix' }, 'preparing-owner');
    assert.equal(recoveredRetry.status, 200);
    const recoveredData = await recoveredRetry.json();
    assert.equal(recoveredData.orderId, pendingNumerologyOrder.id);
    assert.equal(recoveredData.reused, true);
    assert.equal(recoveredData.recovered, true);
    assert.equal(pendingNumerologyOrder.checkoutUrl, 'https://checkout.infinitepay.io/test');
    assert.equal(pendingNumerologyOrder.checkoutRecoveryAttempts, 1);
    const recoveryRequests = calls.filter(c => c.body.order_nsu === pendingNumerologyOrder.id);
    assert.equal(recoveryRequests.length, 2);
    assert.deepEqual(recoveryRequests[0].body, originalPayload, 'a chamada inicial persiste o payload original');
    assert.deepEqual(recoveryRequests[1].body, originalPayload, 'a recuperação repete exatamente o payload original');
    assert.equal(recoveryRequests[0].url, 'https://api.checkout.infinitepay.io/links');
    assert.equal(calls.filter(c => String(c.url).endsWith('/links')).length, linksBeforeRecovery + 2);
    assert.equal(db.paymentOrders?.filter(o => o.userId === 'preparing-owner' && o.productType === 'numerology_full').length, 1);

    db.users.push({ id: 'numerology-recovery-limit-owner', plan: 'free', profile: {} });
    const recoveryLimitBody = { productType: 'numerology_full', paymentMethod: 'pix' };
    failNextNumerologyLink = true;
    const initialLimitFailure = await call('payment/create-checkout', recoveryLimitBody, 'numerology-recovery-limit-owner');
    assert.equal(initialLimitFailure.status, 503);
    const recoveryLimitOrder = db.paymentOrders?.find(order => order.userId === 'numerology-recovery-limit-owner' && order.productType === 'numerology_full') as import('../src/lib/paymentRoutes').PaymentOrder | undefined;
    assert.ok(recoveryLimitOrder);
    failNextNumerologyLink = true;
    const firstRecoveryFailure = await call('payment/create-checkout', recoveryLimitBody, 'numerology-recovery-limit-owner');
    assert.equal(firstRecoveryFailure.status, 503);
    assert.equal(recoveryLimitOrder.checkoutRecoveryAttempts, 1);
    const recoveryLimitCalls = calls.filter(c => c.body.order_nsu === recoveryLimitOrder.id).length;
    const blockedSecondRecovery = await call('payment/create-checkout', recoveryLimitBody, 'numerology-recovery-limit-owner');
    assert.equal(blockedSecondRecovery.status, 503);
    assert.equal(calls.filter(c => c.body.order_nsu === recoveryLimitOrder.id).length, recoveryLimitCalls, 'a Numerologia não cria novos links após o único replay automático permitido');

    const recoveredConfirmationStart = calls.length;
    const recoveredConfirmation = await call('payment/confirm', {
      order_nsu: pendingNumerologyOrder.id,
      transaction_nsu: 'recovered-transaction',
      slug: 'recovered-numerology'
    }, 'preparing-owner');
    assert.equal(recoveredConfirmation.status, 200);
    const recoveredPaymentCheck = calls.slice(recoveredConfirmationStart).find(c => String(c.url).endsWith('/payment_check'));
    assert.equal(recoveredPaymentCheck?.body.handle, 'original-handle', 'a confirmação usa a handle persistida do checkout original');

    db.users.push({ id: 'legacy-link-owner', plan: 'free', profile: {} });
    db.paymentOrders.push({
      id: 'legacy-multi-use-link',
      userId: 'legacy-link-owner',
      productType: 'numerology_full',
      cents: 9000,
      method: 'pix',
      createdAt: new Date().toISOString(),
      checkoutUrl: 'https://checkout.infinitepay.io/legacy'
    });
    const callsBeforeLegacyLink = calls.length;
    const legacyLinkAttempt = await call('payment/create-checkout', { productType: 'numerology_full', paymentMethod: 'pix' }, 'legacy-link-owner');
    assert.equal(legacyLinkAttempt.status, 503);
    assert.equal(calls.length, callsBeforeLegacyLink, 'link legado sem single_payment não é reutilizado nem substituído automaticamente');

    db.users.push({ id: 'legacy-preparing-owner', plan: 'free', profile: {} });
    db.paymentOrders.push({
      id: 'legacy-preparing-order',
      userId: 'legacy-preparing-owner',
      productType: 'numerology_full',
      cents: 9000,
      method: 'pix',
      createdAt: new Date().toISOString()
    });
    const callsBeforeLegacyPreparing = calls.length;
    const legacyPreparingAttempt = await call('payment/create-checkout', { productType: 'numerology_full', paymentMethod: 'pix' }, 'legacy-preparing-owner');
    assert.equal(legacyPreparingAttempt.status, 503);
    assert.equal(calls.length, callsBeforeLegacyPreparing, 'pedido antigo sem payload original não é reconstruído com variáveis atuais');

    db.users.push({ id: 'multiple-pending-owner', plan: 'free', profile: {} });
    const multiplePendingPayload: import('../src/lib/paymentRoutes').InfinitePayCheckoutPayload = {
      handle: 'original-handle',
      order_nsu: 'multiple-pending-link',
      redirect_url: 'https://original.example/?payment_order=multiple-pending-link',
      webhook_url: 'https://original.example/api/webhooks/payment',
      items: [{ quantity: 1, price: 9000, description: 'Mapa Numerológico Cabalístico Completo' }],
      options: { single_payment: true }
    };
    db.paymentOrders.push({
      id: 'multiple-pending-link',
      userId: 'multiple-pending-owner',
      productType: 'numerology_full',
      cents: 9000,
      method: 'pix',
      createdAt: new Date().toISOString(),
      checkoutUrl: 'https://checkout.infinitepay.io/one',
      checkoutPayload: multiplePendingPayload
    });
    db.paymentOrders.push({
      id: 'multiple-pending-preparing',
      userId: 'multiple-pending-owner',
      productType: 'numerology_full',
      cents: 9000,
      method: 'pix',
      createdAt: new Date().toISOString(),
      checkoutPayload: { ...multiplePendingPayload, order_nsu: 'multiple-pending-preparing' }
    });
    const callsBeforeMultiplePending = calls.length;
    const ambiguousNumerology = await call('payment/create-checkout', { productType: 'numerology_full', paymentMethod: 'pix' }, 'multiple-pending-owner');
    assert.equal(ambiguousNumerology.status, 503);
    assert.equal(calls.length, callsBeforeMultiplePending, 'tentativas pendentes múltiplas não escolhem nem criam links automaticamente');

    db.users.push({ id: 'trial-account', plan: 'free', profile: {} });
    const trial = { planId: 'teste_vip_7d', paymentMethod: 'trial', couponCode: 'VIP7' };
    assert.equal((await call('user/upgrade', trial, 'trial-account')).status, 200);
    assert.equal((await call('user/upgrade', trial, 'trial-account')).status, 409);
    const expires = db.users[0].profile.subscriptionExpiresAt;
    assert.equal((await call('payment/confirm', body)).status, 200);
    assert.equal(db.users[0].profile.subscriptionExpiresAt, expires);
  } finally {
    await new Promise<void>(r => server.close(() => r()));
    if (originalEnv.apiKey === undefined) delete process.env.INFINITEPAY_API_KEY; else process.env.INFINITEPAY_API_KEY = originalEnv.apiKey;
    if (originalEnv.handle === undefined) delete process.env.INFINITEPAY_HANDLE; else process.env.INFINITEPAY_HANDLE = originalEnv.handle;
    if (originalEnv.appUrl === undefined) delete process.env.PUBLIC_APP_URL; else process.env.PUBLIC_APP_URL = originalEnv.appUrl;
    process.chdir(cwd);
    fs.rmSync(folder, { recursive: true, force: true });
  }
});
