import { Router } from 'express';
import crypto from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { getDb, saveDb } from '../db.js';

import { PAYMENT_PLANS, paymentQuote, type Plan } from './paymentCatalog.js';
export type PaymentOrder = { id: string; userId: string; planId: Plan; treatment?: import('../types.js').SpecificTreatment; cents: number; method: string; createdAt: string; status?: 'creating' | 'pending' | 'checkout_failed' | 'expired' | 'paid'; expiresAt?: string; checkoutUrl?: string; fingerprint?: string; paidAt?: string; transaction?: string };
import { INFINITEPAY_API, infinitePayHandle, paymentOrigin } from './infinitePayConfig.js';
export function paymentRoutes(authenticate: any, limiter: any, providerFetch: typeof fetch = fetch) {
  const router = Router();
  const createLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, keyGenerator: (req: any) => req.userId, standardHeaders: true, legacyHeaders: false, message: { error: 'Muitas tentativas de checkout. Aguarde alguns minutos.', code: 'CHECKOUT_RATE_LIMIT' } });
  const confirmLimit = rateLimit({ windowMs: 60 * 1000, limit: 60, keyGenerator: (req: any) => req.userId, standardHeaders: true, legacyHeaders: false, message: { error: 'Aguarde antes de consultar novamente.', code: 'CONFIRM_RATE_LIMIT' } });
  const webhookLimit = rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: true, legacyHeaders: false });
  const handle = infinitePayHandle;
  const appUrl = paymentOrigin;
  async function provider(path: string, body: unknown) {
    const response = await providerFetch(INFINITEPAY_API + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(15000) });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('InfinitePay request rejected', { path, status: response.status });
      if (/handle|merchant|conta|cadastrad/i.test(String(error.message || error.error || ''))) throw new Error('INFINITEPAY_ACCOUNT_NOT_FOUND');
      throw new Error('INFINITEPAY_UNAVAILABLE');
    }
    return response.json();
  }
  router.post('/user/upgrade', authenticate, limiter, async (req: any, res) => {
    if (req.body?.planId !== 'teste_vip_7d' || req.body?.couponCode !== 'VIP7' || req.body?.paymentMethod !== 'trial') return res.status(400).json({ error: 'Ativação inválida.' });
    const user = getDb().users.find(u => u.id === req.userId);
    if (!user) return res.sendStatus(401);
    if (user.profile?.trial7dRedeemedAt || (user.plan === 'pro' && (!user.profile?.subscriptionExpiresAt || Date.parse(user.profile.subscriptionExpiresAt) > Date.now()))) return res.status(409).json({ error: 'A degustação já foi utilizada ou há um acesso ativo.' });
    if (getDb().users.filter(u => u.profile?.trial7dRedeemedAt).length >= 20) return res.status(410).json({ error: 'A campanha VIP7 atingiu o limite de 20 resgates.' });
    const previous = { plan: user.plan, profile: user.profile };
    const now = new Date();
    user.plan = 'pro';
    user.profile = { ...user.profile, plan: 'pro', subscriptionPlan: 'teste_vip_7d',
      trial7dRedeemedAt: now.toISOString(), proActiveSince: now.toISOString(),
      subscriptionExpiresAt: new Date(now.getTime() + 7 * 86400000).toISOString() };
    try { await saveDb(candidate => { if (candidate.users.filter(u => u.profile?.trial7dRedeemedAt).length > 20) throw new Error('TRIAL_LIMIT'); }); return res.json({ user: { profile: user.profile } }); }
    catch (error) { user.plan = previous.plan; user.profile = previous.profile; if ((error as Error).message === 'TRIAL_LIMIT') return res.status(410).json({ error: 'A campanha VIP7 atingiu o limite de 20 resgates.' }); return res.status(503).json({ error: 'Não foi possível ativar a degustação agora.' }); }
  });
  router.post('/payment/create-checkout', authenticate, createLimit, async (req: any, res) => {
    const { planId, paymentMethod, couponCode, productType } = req.body || {};
    let quote;
    let treatment: import('../types.js').SpecificTreatment | undefined;
    try {
      if (!['subscription', 'specific_treatment'].includes(productType) || (paymentMethod != null && !['pix', 'card', 'credit', 'debit'].includes(paymentMethod)) || (productType === 'subscription' && typeof planId !== 'string') || (couponCode != null && typeof couponCode !== 'string')) throw new Error('Compra inválida.');
      if (productType === 'subscription') quote = paymentQuote(planId, couponCode || '');
      else {
        const { durationDays, category, patientDescription, urgentPains, title } = req.body;
        if (![1,7,21].includes(durationDays) || !['saude_fisica','prosperidade','liberacao_emocional','relacionamentos','limpeza_espiritual','outro'].includes(category) || typeof patientDescription !== 'string' || !patientDescription.trim() || patientDescription.length > 10000 || (title != null && (typeof title !== 'string' || title.length > 200)) || !Array.isArray(urgentPains) || urgentPains.length > 30 || urgentPains.some((v: unknown) => typeof v !== 'string' || v.length > 200)) throw new Error('Dados da prática inválidos.');
        const coupons: Record<string,number> = { PROMO15:15, PROMO20:20, CURA10:10, PAZ10:10, PAZ20:20, CURA20:20, GRATIDAO:20, PROMO30:30, CURA30:30, PICENI50:50, VIP50:50 };
        const code = (couponCode || '').trim().toUpperCase();
        if (code && !Object.hasOwn(coupons, code)) throw new Error('Cupom inválido.');
        let cents = durationDays === 1 ? 2000 : durationDays === 7 ? 5990 : 9990;
        if (req.body.customAmount != null) {
          if (req.user?.role !== 'admin') throw new Error('Valor personalizado requer autorização do terapeuta.');
          if (!Number.isSafeInteger(req.body.customAmount) || req.body.customAmount < 100 || req.body.customAmount > 1000000) throw new Error('Valor inválido.');
          cents = req.body.customAmount;
        }
        cents = Math.round(cents * (1 - (coupons[code] || 0) / 100));
        quote = { cents, title: `Prática individual — ${durationDays} dia(s)` };
        treatment = { id: crypto.randomUUID(), requestedAt: new Date().toISOString(), durationDays, category, title: title?.trim() || quote.title, patientDescription: patientDescription.trim(), urgentPains, status: 'pendente', price: cents / 100, paymentMethod: paymentMethod === 'pix' ? 'pix' : 'cartao' };
      }
    } catch (error) { return res.status(400).json({ error: (error as Error).message }); }
    const fingerprint = crypto.createHash('sha256').update(JSON.stringify({ userId: req.userId, productType, planId, cents: quote.cents, durationDays: treatment?.durationDays, category: treatment?.category, description: treatment?.patientDescription, title: treatment?.title, pains: treatment?.urgentPains })).digest('hex');
    const now = Date.now();
    const previous = getDb().paymentOrders?.find(o => o.userId === req.userId && o.fingerprint === fingerprint && !o.paidAt && o.status !== 'checkout_failed' && o.status !== 'expired' && Date.parse(o.expiresAt || '') > now);
    if (previous?.checkoutUrl) return res.json({ checkoutUrl: previous.checkoutUrl, orderId: previous.id, status: 'pending' });
    if (previous) return res.status(409).json({ error: 'O checkout está sendo preparado. Tente novamente em instantes.', code: 'CHECKOUT_CREATING' });
    const order: PaymentOrder = { id: crypto.randomUUID(), userId: req.userId, planId: planId as Plan, ...(treatment ? { treatment } : {}), cents: quote.cents, method: paymentMethod || 'checkout', createdAt: new Date(now).toISOString(), expiresAt: new Date(now + 30 * 60000).toISOString(), status: 'creating', fingerprint };
    try {
      const origin = appUrl();
      const db = getDb();
      for (const pending of db.paymentOrders || []) if (!pending.paidAt && pending.expiresAt && Date.parse(pending.expiresAt) <= now) pending.status = 'expired';
      (db.paymentOrders ||= []).push(order);
      await saveDb(candidate => {
        if ((candidate.paymentOrders || []).filter(o => o.fingerprint === fingerprint && o.status === 'creating' && Date.parse(o.expiresAt || '') > now).length > 1) throw new Error('CHECKOUT_CREATING');
      });
      const result = await provider('/links', { handle: handle(), order_nsu: order.id,
        redirect_url: `${origin}/api/payment/return?payment_order=${order.id}`, webhook_url: `${origin}/api/webhooks/payment`,
        items: [{ quantity: 1, price: order.cents, description: quote.title }] });
      const checkout = new URL(result.url);
      if (checkout.protocol !== 'https:' || !['checkout.infinitepay.io', 'checkout.infinitepay.com.br', 'invoice.infinitepay.io', 'pay.infinitepay.io'].includes(checkout.hostname) || checkout.username || checkout.password) throw new Error('Endereço de pagamento inválido.');
      const stored = getDb().paymentOrders?.find(o => o.id === order.id);
      if (!stored) throw new Error('PERSISTENCE_UNAVAILABLE');
      stored.checkoutUrl = checkout.href; stored.status = 'pending';
      await saveDb();
      return res.json({ checkoutUrl: checkout.href, orderId: order.id, status: 'pending' });
    } catch (error) {
      const failed = getDb().paymentOrders?.find(o => o.id === order.id);
      if (failed) { failed.status = 'checkout_failed'; try { await saveDb(); } catch { /* keep access locked when persistence fails */ } }
      const accountMissing = ['INFINITEPAY_ACCOUNT_NOT_FOUND','INFINITEPAY_HANDLE_INVALID'].includes((error as Error).message);
      return res.status(503).json({ code: accountMissing ? 'INFINITEPAY_ACCOUNT_NOT_FOUND' : 'CHECKOUT_UNAVAILABLE', error: accountMissing ? 'A InfinitePay não reconheceu a conta de recebimento. Confira a InfiniteTag configurada.' : 'Não foi possível abrir o pagamento seguro. Tente novamente em instantes.' });
    }
  });
  async function confirm(body: any, userId?: string) {
    const { order_nsu, transaction_nsu } = body || {};
    const slug = body?.slug || body?.invoice_slug;
    if (![order_nsu, transaction_nsu, slug].every(v => typeof v === 'string' && v.length > 0 && v.length < 250)) return { status: 400, data: { error: 'Confirmação inválida.' } };
    let db = getDb();
    let order = db.paymentOrders?.find(o => o.id === order_nsu && (!userId || o.userId === userId));
    if (!order) {
      // Read legacy server records without trusting their client-writable paid flag.
      for (const account of db.users) {
        if (userId && account.id !== userId) continue;
        if (!order_nsu.startsWith(`protocolo-${account.id}-`)) continue;
        const legacy = account.profile?.paymentOrders?.find((o: any) => o.orderNsu === order_nsu);
        if (!legacy || !Object.hasOwn(PAYMENT_PLANS, legacy.planId)) continue;
        let expected;
        try { expected = paymentQuote(legacy.planId, legacy.couponCode || '').cents; } catch { continue; }
        if (legacy.amountCents !== expected) continue;
        order = { id: order_nsu, userId: account.id, planId: legacy.planId, cents: expected, method: 'checkout', createdAt: legacy.createdAt };
        (db.paymentOrders ||= []).push(order);
        break;
      }
    }
    if (!order) return { status: 404, data: { error: 'Compra não encontrada.' } };
    let user = db.users.find(u => u.id === order.userId);
    if (!user) return { status: 404, data: { error: 'Conta não encontrada.' } };
    if (!order.paidAt) {
      const verified = await provider('/payment_check', { handle: handle(), order_nsu, transaction_nsu, slug });
      if (verified.success !== true || verified.paid !== true || verified.amount !== order.cents) return { status: 202, data: { status: 'pending' } };
      db = getDb();
      order = db.paymentOrders?.find(o => o.id === order_nsu && (!userId || o.userId === userId));
      if (!order) return { status: 404, data: { error: 'Compra não encontrada.' } };
      user = db.users.find(u => u.id === order!.userId);
      if (!user) return { status: 404, data: { error: 'Conta não encontrada.' } };
      if (order.paidAt) return { status: 200, data: userId ? { status: 'paid', user: { profile: user.profile } } : { success: true } };
      if (db.paymentOrders?.some(o => o.id !== order.id && o.transaction === transaction_nsu)) return { status: 409, data: { error: 'Transação já utilizada.' } };
      const previous = { plan: user.plan, profile: user.profile };
      const now = new Date();
      order.paidAt = now.toISOString(); order.transaction = transaction_nsu; order.status = 'paid';
      if (order.treatment) {
        user.profile = { ...user.profile, specificTreatments: [...(user.profile?.specificTreatments || []), { ...order.treatment, paymentMethod: verified.capture_method === 'pix' ? 'pix' : 'cartao', paidAt: now.toISOString(), expiresAt: new Date(now.getTime() + (order.treatment.durationDays || 1) * 86400000).toISOString(), paymentOrderId: order.id }] };
      } else {
      user.plan = 'pro';
      user.profile = { ...user.profile, plan: 'pro', subscriptionPlan: order.planId,
        subscriptionPrice: order.cents / 100, subscriptionPaymentMethod: verified.capture_method === 'pix' ? 'pix' : 'card',
        proActiveSince: now.toISOString(), subscriptionExpiresAt: new Date(now.getTime() + PAYMENT_PLANS[order.planId].days * 86400000).toISOString() };
      }
      try { await saveDb(candidate => { const transactions = (candidate.paymentOrders || []).filter(o => o.paidAt && o.transaction).map(o => o.transaction); if (new Set(transactions).size !== transactions.length) throw new Error('TRANSACTION_ALREADY_USED'); }); } catch (error) { user.plan = previous.plan; user.profile = previous.profile; delete order.paidAt; delete order.transaction; order.status = 'pending'; throw error; }
    }
    return { status: 200, data: userId ? { status: 'paid', user: { profile: getDb().users.find(u => u.id === order!.userId)?.profile } } : { success: true } };
  }
  router.get('/payment/orders/:orderId', authenticate, confirmLimit, async (req: any, res) => {
    const order = getDb().paymentOrders?.find(o => o.id === req.params.orderId && o.userId === req.userId);
    if (!order) return res.status(404).json({ error: 'Compra não encontrada.' });
    if (!order.paidAt && order.expiresAt && Date.parse(order.expiresAt) <= Date.now() && order.status !== 'checkout_failed') {
      order.status = 'expired';
      try { await saveDb(); } catch { return res.status(503).json({ error: 'Não foi possível consultar a compra agora.' }); }
    }
    return res.json({ orderId: order.id, status: order.paidAt ? 'paid' : order.status || 'pending', productType: order.treatment ? 'specific_treatment' : 'subscription', planId: order.planId, cents: order.cents, expiresAt: order.expiresAt });
  });
  router.get('/payment/return', limiter, async (req, res) => {
    let origin: string;
    try { origin = appUrl(); } catch { return res.status(503).json({ error: 'URL pública do aplicativo não configurada corretamente.' }); }
    try {
      const orderId = req.query.order_nsu || req.query.payment_order;
      const result = await confirm({ ...req.query, order_nsu: orderId });
      return res.redirect(`${origin}/?payment=${result.status === 200 ? 'approved' : 'pending'}&payment_order=${encodeURIComponent(String(orderId || ''))}`);
    } catch { return res.redirect(`${origin}/?payment=error`); }
  });
  router.post('/payment/confirm', authenticate, confirmLimit, async (req: any, res) => {
    try { const result = await confirm(req.body, req.userId); return res.status(result.status).json(result.data); }
    catch { return res.status(503).json({ error: 'Não foi possível confirmar o pagamento agora.' }); }
  });
  router.post(['/webhooks/payment', '/webhooks/infinitepay'], webhookLimit, async (req, res) => {
    try { const result = await confirm(req.body); return res.status(result.status === 202 ? 400 : result.status).json(result.data); }
    catch { return res.status(503).json({ error: 'Confirmação temporariamente indisponível.' }); }
  });
  return router;
}
