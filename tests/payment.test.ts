import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { paymentQuote, PAYMENT_PLANS, specificTreatmentCouponDiscount, specificTreatmentQuote } from '../src/lib/paymentCatalog';

test('payment prices are authoritative for every approved plan and coupon', () => {
  assert.equal(PAYMENT_PLANS.jornada_7d.cents, 2500);
  assert.equal(PAYMENT_PLANS.jornada_21d.cents, 5000);
  assert.equal(paymentQuote('jornada_7d').cents, 2500);
  assert.equal(paymentQuote('jornada_21d').cents, 5000);
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
  const originalApiKey = process.env.INFINITEPAY_API_KEY;
  process.chdir(folder); process.env.NODE_ENV = 'test';
  process.env.INFINITEPAY_API_KEY = 'test-only-infinitepay-key';
  for (const key of Object.keys(process.env)) if (/UPSTASH|KV_REST/.test(key)) delete process.env[key];
  const { getDb, initializeDb } = await import('../src/db');
  const { paymentRoutes } = await import('../src/lib/paymentRoutes');
  await initializeDb(); const db = getDb();
  db.users.push({ id: 'owner', plan: 'free', profile: {} });
  let amount = paymentQuote('jornada_7d', 'PROMO20').cents; let paid = false; const calls: any[] = [];
  const provider = async (url: any, options: any) => {
    calls.push({ url, body: JSON.parse(options.body), headers: options.headers });
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
    db.users.push({ id: 'missing-key-owner', plan: 'free', profile: {} });
    const callsBeforeMissingKey = calls.length;
    delete process.env.INFINITEPAY_API_KEY;
    assert.equal((await call('payment/create-checkout', { productType: 'subscription', planId: 'jornada_7d', paymentMethod: 'pix' }, 'missing-key-owner')).status, 503);
    assert.equal(calls.length, callsBeforeMissingKey, 'sem API Key não chama a InfinitePay');
    assert.equal(db.paymentOrders?.some(order => order.userId === 'missing-key-owner') ?? false, false, 'sem API Key não cria pedido pendente');
    process.env.INFINITEPAY_API_KEY = 'test-only-infinitepay-key';
    const checkout = await call('payment/create-checkout', { productType: 'subscription', planId: 'jornada_7d', paymentMethod: 'pix', price: .01, couponCode: 'PROMO20' });
    assert.equal(checkout.status, 200); const { orderId } = await checkout.json();
    assert.equal(calls[0].body.handle, 'evertonterapeutareiki');
    assert.equal(calls[0].body.options.single_payment, true);
    assert.equal(calls[0].headers['X-Api-Key'], 'test-only-infinitepay-key');
    assert.equal(calls[0].body.items[0].price, paymentQuote('jornada_7d', 'PROMO20').cents);
    assert.equal(db.users[0].plan, 'free');

    // Um checkout de assinatura pendente não pode coexistir com um link de outro plano.
    db.users.push({ id: 'pending-owner', plan: 'free', profile: {} });
    const pendingSubscription = await call('payment/create-checkout', {
      productType: 'subscription', planId: 'jornada_7d', paymentMethod: 'pix'
    }, 'pending-owner');
    assert.equal(pendingSubscription.status, 200);
    const pendingSubscriptionBody = await pendingSubscription.json();
    const callsAfterPendingSubscription = calls.length;
    const differentPendingPlan = await call('payment/create-checkout', {
      productType: 'subscription', planId: 'jornada_21d', paymentMethod: 'pix'
    }, 'pending-owner');
    assert.equal(differentPendingPlan.status, 409);
    assert.equal(calls.length, callsAfterPendingSubscription, 'um plano diferente não pode criar outro link ativo');
    assert.equal(db.paymentOrders?.filter(order => order.userId === 'pending-owner').length, 1);
    const samePendingPlanRetry = await call('payment/create-checkout', {
      productType: 'subscription', planId: 'jornada_7d', paymentMethod: 'pix'
    }, 'pending-owner');
    assert.equal(samePendingPlanRetry.status, 200);
    const samePendingPlanBody = await samePendingPlanRetry.json();
    assert.equal(samePendingPlanBody.orderId, pendingSubscriptionBody.orderId, 'a repetição do mesmo plano reutiliza o link existente');
    assert.equal(calls.length, callsAfterPendingSubscription, 'a repetição do mesmo plano não cria um segundo link');

    // Pedidos legados sem productType também são reconhecidos como assinaturas pendentes.
    db.users.push({ id: 'legacy-pending-owner', plan: 'free', profile: {} });
    (db.paymentOrders ||= []).push({
      id: 'legacy-pending-subscription',
      userId: 'legacy-pending-owner',
      planId: 'jornada_7d',
      cents: 2500,
      method: 'pix',
      createdAt: new Date().toISOString(),
      checkoutUrl: 'https://checkout.infinitepay.io/legacy',
      checkoutPayload: {
        handle: 'evertonterapeutareiki',
        order_nsu: 'legacy-pending-subscription',
        redirect_url: 'https://example.com/?payment_order=legacy-pending-subscription',
        webhook_url: 'https://example.com/api/webhooks/payment',
        items: [{ quantity: 1, price: 2500, description: 'Plano legado' }],
        options: { single_payment: true }
      }
    });
    const legacyDifferentPlan = await call('payment/create-checkout', {
      productType: 'subscription', planId: 'jornada_21d', paymentMethod: 'pix'
    }, 'legacy-pending-owner');
    assert.equal(legacyDifferentPlan.status, 409, 'assinaturas legadas pendentes também bloqueiam outro plano');

    // Checkout legado de prática individual sem productType deve ser reconciliado
    // e reutilizado, em vez de criar um segundo link ainda pagável.
    db.users.push({ id: 'legacy-treatment-owner', plan: 'free', profile: {} });
    const legacyTreatmentOrderId = 'legacy-treatment-order';
    (db.paymentOrders ||= []).push({
      id: legacyTreatmentOrderId,
      userId: 'legacy-treatment-owner',
      treatment: {
        id: 'legacy-treatment-id',
        requestedAt: new Date().toISOString(),
        durationDays: 7,
        category: 'outro',
        title: 'Prática individual — 7 dias',
        patientDescription: 'Texto sintético privado.',
        urgentPains: [],
        status: 'pendente',
        price: 59.9,
        paymentMethod: 'pix'
      },
      cents: 5990,
      method: 'pix',
      createdAt: new Date().toISOString(),
      checkoutUrl: 'https://checkout.infinitepay.io/legacy-treatment',
      checkoutPayload: {
        handle: 'evertonterapeutareiki',
        order_nsu: legacyTreatmentOrderId,
        redirect_url: 'https://example.com/?payment_order=legacy-treatment-order',
        webhook_url: 'https://example.com/api/webhooks/payment',
        items: [{ quantity: 1, price: 5990, description: 'Prática individual — 7 dias' }],
        options: { single_payment: true }
      }
    });
    const callsBeforeLegacyTreatmentRetry = calls.length;
    const legacyTreatmentRetry = await call('payment/create-checkout', {
      productType: 'specific_treatment',
      paymentMethod: 'pix',
      durationDays: 7,
      category: 'outro',
      patientDescription: 'Texto sintético privado.',
      urgentPains: []
    }, 'legacy-treatment-owner');
    assert.equal(legacyTreatmentRetry.status, 200);
    const legacyTreatmentRetryBody = await legacyTreatmentRetry.json();
    assert.equal(legacyTreatmentRetryBody.orderId, legacyTreatmentOrderId);
    assert.equal(legacyTreatmentRetryBody.reused, true);
    assert.equal(calls.length, callsBeforeLegacyTreatmentRetry, 'retry legado não pode criar outro link InfinitePay');
    assert.equal(db.paymentOrders?.filter(order => order.userId === 'legacy-treatment-owner').length, 1);

    // Link legado sem garantia de pagamento único deve bloquear nova tentativa.
    db.users.push({ id: 'unsafe-legacy-treatment-owner', plan: 'free', profile: {} });
    (db.paymentOrders ||= []).push({
      id: 'unsafe-legacy-treatment-order',
      userId: 'unsafe-legacy-treatment-owner',
      treatment: {
        id: 'unsafe-legacy-treatment-id',
        requestedAt: new Date().toISOString(),
        durationDays: 7,
        category: 'outro',
        title: 'Prática individual — 7 dias',
        patientDescription: 'Texto sintético privado.',
        urgentPains: [],
        status: 'pendente',
        price: 59.9,
        paymentMethod: 'pix'
      },
      cents: 5990,
      method: 'pix',
      createdAt: new Date().toISOString(),
      checkoutUrl: 'https://checkout.infinitepay.io/unsafe-legacy-treatment',
      checkoutPayload: {
        handle: 'evertonterapeutareiki',
        order_nsu: 'unsafe-legacy-treatment-order',
        redirect_url: 'https://example.com/?payment_order=unsafe-legacy-treatment-order',
        webhook_url: 'https://example.com/api/webhooks/payment',
        items: [{ quantity: 1, price: 5990, description: 'Prática individual — 7 dias' }],
        options: {} as any
      }
    });
    const callsBeforeUnsafeLegacyRetry = calls.length;
    const unsafeLegacyRetry = await call('payment/create-checkout', {
      productType: 'specific_treatment',
      paymentMethod: 'pix',
      durationDays: 7,
      category: 'outro',
      patientDescription: 'Texto sintético privado.',
      urgentPains: []
    }, 'unsafe-legacy-treatment-owner');
    assert.equal(unsafeLegacyRetry.status, 503);
    assert.equal(calls.length, callsBeforeUnsafeLegacyRetry, 'link legado sem pagamento único não deve ser duplicado');

    // Uma prática legada pagável com conteúdo diferente também bloqueia novo link,
    // evitando que um retry alterado deixe dois pedidos antigos e novos em aberto.
    db.users.push({ id: 'different-legacy-treatment-owner', plan: 'free', profile: {} });
    (db.paymentOrders ||= []).push({
      id: 'different-legacy-treatment-order',
      userId: 'different-legacy-treatment-owner',
      treatment: {
        id: 'different-legacy-treatment-id',
        requestedAt: new Date().toISOString(),
        durationDays: 7,
        category: 'outro',
        title: 'Prática individual — 7 dias',
        patientDescription: 'Descrição anterior.',
        urgentPains: [],
        status: 'pendente',
        price: 59.9,
        paymentMethod: 'pix'
      },
      cents: 5990,
      method: 'pix',
      createdAt: new Date().toISOString(),
      checkoutUrl: 'https://checkout.infinitepay.io/different-legacy-treatment',
      checkoutPayload: {
        handle: 'evertonterapeutareiki',
        order_nsu: 'different-legacy-treatment-order',
        redirect_url: 'https://example.com/?payment_order=different-legacy-treatment-order',
        webhook_url: 'https://example.com/api/webhooks/payment',
        items: [{ quantity: 1, price: 5990, description: 'Prática individual — 7 dias' }],
        options: { single_payment: true }
      }
    });
    const callsBeforeDifferentLegacyRetry = calls.length;
    const differentLegacyRetry = await call('payment/create-checkout', {
      productType: 'specific_treatment',
      paymentMethod: 'pix',
      durationDays: 7,
      category: 'outro',
      patientDescription: 'Descrição nova.',
      urgentPains: []
    }, 'different-legacy-treatment-owner');
    assert.equal(differentLegacyRetry.status, 409);
    assert.equal(calls.length, callsBeforeDifferentLegacyRetry, 'não abrir novo link enquanto houver prática legada diferente pendente');

    // Pedido tipado pendente para a mesma prática não pode ganhar um segundo link
    // quando o usuário troca/remove o cupom e o preço calculado muda.
    db.users.push({ id: 'typed-treatment-coupon-owner', plan: 'free', profile: {} });
    (db.paymentOrders ||= []).push({
      id: 'typed-treatment-pending-order',
      userId: 'typed-treatment-coupon-owner',
      productType: 'specific_treatment',
      treatment: {
        id: 'typed-treatment-pending-id',
        requestedAt: new Date().toISOString(),
        durationDays: 7,
        category: 'outro',
        title: 'Prática individual — 7 dias',
        patientDescription: 'Texto sintético privado.',
        urgentPains: [],
        status: 'pendente',
        price: 59.9,
        paymentMethod: 'pix'
      },
      cents: 5990,
      method: 'pix',
      createdAt: new Date().toISOString(),
      checkoutUrl: 'https://checkout.infinitepay.io/typed-treatment-pending',
      checkoutPayload: {
        handle: 'evertonterapeutareiki',
        order_nsu: 'typed-treatment-pending-order',
        redirect_url: 'https://example.com/?payment_order=typed-treatment-pending-order',
        webhook_url: 'https://example.com/api/webhooks/payment',
        items: [{ quantity: 1, price: 5990, description: 'Prática individual — 7 dias' }],
        options: { single_payment: true }
      }
    });
    const callsBeforeTypedCouponRetry = calls.length;
    const typedTreatmentCouponRetry = await call('payment/create-checkout', {
      productType: 'specific_treatment',
      paymentMethod: 'pix',
      durationDays: 7,
      category: 'outro',
      patientDescription: 'Texto sintético privado.',
      urgentPains: [],
      couponCode: 'PROMO15'
    }, 'typed-treatment-coupon-owner');
    assert.equal(typedTreatmentCouponRetry.status, 409);
    assert.equal(calls.length, callsBeforeTypedCouponRetry, 'trocar o cupom não pode criar um segundo link para a mesma prática');
    assert.equal(db.paymentOrders?.filter(order => order.userId === 'typed-treatment-coupon-owner').length, 1);

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
    db.users.push({ id: 'trial-account', plan: 'free', profile: {} });
    const trial = { planId: 'teste_vip_7d', paymentMethod: 'trial', couponCode: 'VIP7' };
    assert.equal((await call('user/upgrade', trial, 'trial-account')).status, 200);
    assert.equal((await call('user/upgrade', trial, 'trial-account')).status, 409);
    const expires = db.users[0].profile.subscriptionExpiresAt;
    assert.equal((await call('payment/confirm', body)).status, 200);
    assert.equal(db.users[0].profile.subscriptionExpiresAt, expires);
  } finally {
    if (originalApiKey === undefined) delete process.env.INFINITEPAY_API_KEY;
    else process.env.INFINITEPAY_API_KEY = originalApiKey;
    await new Promise<void>(r => server.close(() => r())); process.chdir(cwd); fs.rmSync(folder, { recursive: true, force: true });
  }
});


test('checkout atualiza o snapshot Redis depois do lock e antes de deduplicar pedidos', () => {
  const routes = fs.readFileSync('src/lib/paymentRoutes.ts', 'utf8');
  const checkoutRoute = routes.slice(routes.indexOf("router.post('/payment/create-checkout'"));
  const lock = checkoutRoute.indexOf('await acquireCheckoutCreationLock');
  const refresh = checkoutRoute.indexOf('await refreshDbFromPersistentStorage()');
  const pending = checkoutRoute.indexOf('const pendingStandardOrders');
  assert.ok(lock >= 0 && refresh > lock && pending > refresh, 'a deduplicação deve usar o snapshot lido sob o lock');
});


test('checkout failure cleanup never writes a stale snapshot after losing the shared lock', () => {
  const routes = fs.readFileSync('src/lib/paymentRoutes.ts', 'utf8');
  const cleanupMarker = routes.indexOf('if (order && !order.checkoutUrl && !providerRequestStarted && !recoveringExistingOrder && releaseStandardCheckoutLock)');
  assert.ok(cleanupMarker >= 0, 'cleanup do checkout deve permanecer identificável');
  const catchStart = routes.lastIndexOf('} catch {', cleanupMarker);
  const finallyStart = routes.indexOf('    } finally {', cleanupMarker);
  const cleanup = routes.slice(catchStart, finallyStart);
  const heldBeforeRefresh = cleanup.indexOf('await releaseStandardCheckoutLock.assertHeld();');
  const refresh = cleanup.indexOf('await refreshDbFromPersistentStorage();');
  const persistedLookup = cleanup.indexOf('getDb().paymentOrders?.find');
  const save = cleanup.indexOf('await saveCheckoutOrder();');
  assert.ok(heldBeforeRefresh >= 0 && refresh > heldBeforeRefresh && persistedLookup > refresh && save > persistedLookup);
  assert.ok(cleanup.includes('if (order && !order.checkoutUrl && !providerRequestStarted && !recoveringExistingOrder && releaseStandardCheckoutLock)'));
  assert.ok(cleanup.includes('Sem posse comprovada do lock'));
});
