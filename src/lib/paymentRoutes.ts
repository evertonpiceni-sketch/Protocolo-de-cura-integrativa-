import { Router } from 'express';
import crypto from 'node:crypto';
import { getDb, saveDb } from '../db.js';

import { PAYMENT_PLANS, paymentQuote, type Plan } from './paymentCatalog.js';
export type PaymentOrder = { id: string; userId: string; planId: Plan; treatment?: import('../types.js').SpecificTreatment; cents: number; method: string; createdAt: string; paidAt?: string; transaction?: string };
const API = 'https://api.checkout.infinitepay.io';
export function paymentRoutes(authenticate: any, limiter: any, providerFetch: typeof fetch = fetch) {
  const router = Router();
  const handle = () => process.env.INFINITEPAY_HANDLE || 'evertonterapeutareiki';
  const appUrl = () => {
    const url = new URL(process.env.PUBLIC_APP_URL || 'https://protocolo-de-cura-integrativa.vercel.app');
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('URL pública inválida.');
    return url.origin;
  };
  async function provider(path: string, body: unknown) {
    const response = await providerFetch(API + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(process.env.INFINITEPAY_API_KEY ? { 'X-Api-Key': process.env.INFINITEPAY_API_KEY } : {}) }, body: JSON.stringify(body), signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('O provedor não conseguiu processar o pagamento agora.');
    return response.json();
  }
  router.post('/user/upgrade', authenticate, limiter, async (req: any, res) => {
    if (req.body?.planId !== 'teste_vip_7d' || req.body?.couponCode !== 'VIP7' || req.body?.paymentMethod !== 'trial') return res.status(400).json({ error: 'Ativação inválida.' });
    const user = getDb().users.find(u => u.id === req.userId);
    if (!user) return res.sendStatus(401);
    if (user.profile?.trial7dRedeemedAt || user.plan === 'pro') return res.status(409).json({ error: 'A degustação já foi utilizada ou há um acesso ativo.' });
    const previous = { plan: user.plan, profile: user.profile };
    const now = new Date();
    user.plan = 'pro';
    user.profile = { ...user.profile, plan: 'pro', subscriptionPlan: 'teste_vip_7d',
      trial7dRedeemedAt: now.toISOString(), proActiveSince: now.toISOString(),
      subscriptionExpiresAt: new Date(now.getTime() + 7 * 86400000).toISOString() };
    try { await saveDb(); return res.json({ user: { profile: user.profile } }); }
    catch { user.plan = previous.plan; user.profile = previous.profile; return res.status(503).json({ error: 'Não foi possível ativar a degustação agora.' }); }
  });
  router.post('/payment/create-checkout', authenticate, limiter, async (req: any, res) => {
    const { planId, paymentMethod, couponCode, productType } = req.body || {};
    let quote;
    let treatment: import('../types.js').SpecificTreatment | undefined;
    try {
      if (!['subscription', 'specific_treatment'].includes(productType) || !['pix', 'card', 'credit', 'debit'].includes(paymentMethod) || (productType === 'subscription' && typeof planId !== 'string') || (couponCode != null && typeof couponCode !== 'string')) throw new Error('Compra inválida.');
      if (productType === 'subscription') quote = paymentQuote(planId, couponCode || '');
      else {
        const { durationDays, category, patientDescription, urgentPains, title } = req.body;
        if (![1,7,21].includes(durationDays) || !['saude_fisica','prosperidade','liberacao_emocional','relacionamentos','limpeza_espiritual','outro'].includes(category) || typeof patientDescription !== 'string' || !patientDescription.trim() || patientDescription.length > 10000 || (title != null && (typeof title !== 'string' || title.length > 200)) || !Array.isArray(urgentPains) || urgentPains.length > 30 || urgentPains.some((v: unknown) => typeof v !== 'string' || v.length > 200)) throw new Error('Dados da prática inválidos.');
        const coupons: Record<string,number> = { CURA10:10, PAZ10:10, PAZ20:20, CURA20:20, GRATIDAO:20, PROMO30:30, CURA30:30, PICENI50:50, VIP50:50 };
        const code = (couponCode || '').trim().toUpperCase();
        if (code && !Object.hasOwn(coupons, code)) throw new Error('Cupom inválido.');
        let cents = durationDays === 1 ? 2000 : durationDays === 7 ? 5990 : 9990;
        if (req.body.customAmount != null) {
          if (!Number.isSafeInteger(req.body.customAmount) || req.body.customAmount < 100 || req.body.customAmount > 1000000) throw new Error('Valor inválido.');
          cents = req.body.customAmount;
        }
        cents = Math.round(cents * (1 - (coupons[code] || 0) / 100));
        quote = { cents, title: `Prática individual — ${durationDays} dia(s)` };
        treatment = { id: crypto.randomUUID(), requestedAt: new Date().toISOString(), durationDays, category, title: title?.trim() || quote.title, patientDescription: patientDescription.trim(), urgentPains, status: 'pendente', price: cents / 100, paymentMethod: paymentMethod === 'pix' ? 'pix' : 'cartao' };
      }
    } catch (error) { return res.status(400).json({ error: (error as Error).message }); }
    const order: PaymentOrder = { id: crypto.randomUUID(), userId: req.userId, planId: planId as Plan, ...(treatment ? { treatment } : {}), cents: quote.cents, method: paymentMethod, createdAt: new Date().toISOString() };
    try {
      const origin = appUrl();
      const db = getDb();
      (db.paymentOrders ||= []).push(order);
      await saveDb();
      const result = await provider('/links', { handle: handle(), order_nsu: order.id,
        redirect_url: `${origin}/?payment_order=${order.id}`, webhook_url: `${origin}/api/webhooks/payment`,
        items: [{ quantity: 1, price: order.cents, description: quote.title }] });
      const checkout = new URL(result.url);
      if (checkout.protocol !== 'https:' || !['checkout.infinitepay.io', 'invoice.infinitepay.io', 'pay.infinitepay.io'].includes(checkout.hostname) || checkout.username || checkout.password) throw new Error('Endereço de pagamento inválido.');
      return res.json({ checkoutUrl: checkout.href, orderId: order.id });
    } catch { return res.status(503).json({ error: 'Não foi possível abrir o pagamento seguro. Tente novamente em instantes.' }); }
  });
  async function confirm(body: any, userId?: string) {
    const { order_nsu, transaction_nsu } = body || {};
    const slug = body?.slug || body?.invoice_slug;
    if (![order_nsu, transaction_nsu, slug].every(v => typeof v === 'string' && v.length > 0 && v.length < 250)) return { status: 400, data: { error: 'Confirmação inválida.' } };
    const db = getDb();
    const order = db.paymentOrders?.find(o => o.id === order_nsu && (!userId || o.userId === userId));
    if (!order) return { status: 404, data: { error: 'Compra não encontrada.' } };
    const user = db.users.find(u => u.id === order.userId);
    if (!user) return { status: 404, data: { error: 'Conta não encontrada.' } };
    if (!order.paidAt) {
      const verified = await provider('/payment_check', { handle: handle(), order_nsu, transaction_nsu, slug });
      if (verified.success !== true || verified.paid !== true || verified.amount !== order.cents) return { status: 202, data: { status: 'pending' } };
      if (order.paidAt) return { status: 200, data: userId ? { status: 'paid', user: { profile: user.profile } } : { success: true } };
      if (db.paymentOrders?.some(o => o.id !== order.id && o.transaction === transaction_nsu)) return { status: 409, data: { error: 'Transação já utilizada.' } };
      const previous = { plan: user.plan, profile: user.profile };
      const now = new Date();
      order.paidAt = now.toISOString(); order.transaction = transaction_nsu;
      if (order.treatment) {
        user.profile = { ...user.profile, specificTreatments: [...(user.profile?.specificTreatments || []), order.treatment] };
      } else {
      user.plan = 'pro';
      user.profile = { ...user.profile, plan: 'pro', subscriptionPlan: order.planId,
        subscriptionPrice: order.cents / 100, subscriptionPaymentMethod: order.method,
        proActiveSince: now.toISOString(), subscriptionExpiresAt: new Date(now.getTime() + PAYMENT_PLANS[order.planId].days * 86400000).toISOString() };
      }
      try { await saveDb(); } catch (error) { user.plan = previous.plan; user.profile = previous.profile; delete order.paidAt; delete order.transaction; throw error; }
    }
    return { status: 200, data: userId ? { status: 'paid', user: { profile: user.profile } } : { success: true } };
  }
  router.post('/payment/confirm', authenticate, limiter, async (req: any, res) => {
    try { const result = await confirm(req.body, req.userId); return res.status(result.status).json(result.data); }
    catch { return res.status(503).json({ error: 'Não foi possível confirmar o pagamento agora.' }); }
  });
  router.post('/webhooks/payment', limiter, async (req, res) => {
    try { const result = await confirm(req.body); return res.status(result.status).json(result.data); }
    catch { return res.status(503).json({ error: 'Confirmação temporariamente indisponível.' }); }
  });
  return router;
}
