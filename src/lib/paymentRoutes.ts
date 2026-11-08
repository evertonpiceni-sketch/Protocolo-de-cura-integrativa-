import { Router } from 'express';
import crypto from 'node:crypto';
import { getDb, saveDb, hasPersistentDatabase, redisCommand } from '../db.js';

import { PAYMENT_PLANS, paymentQuote, specificTreatmentQuote, type Plan } from './paymentCatalog.js';
export type InfinitePayCheckoutPayload = {
  handle: string;
  order_nsu: string;
  redirect_url: string;
  webhook_url: string;
  items: Array<{ quantity: number; price: number; description: string }>;
  options: { single_payment: true };
};
export type PaymentOrder = { id: string; userId: string; productType?: 'subscription' | 'specific_treatment' | 'numerology_full'; planId?: Plan; treatment?: import('../types.js').SpecificTreatment; cents: number; method: string; createdAt: string; paidAt?: string; transaction?: string; checkoutUrl?: string; checkoutPayload?: InfinitePayCheckoutPayload; failedAt?: string };
const API = 'https://api.checkout.infinitepay.io';
const localNumerologyCheckoutLocks = new Set<string>();
export function paymentRoutes(authenticate: any, limiter: any, providerFetch: typeof fetch = fetch) {
  const router = Router();
  const handle = () => process.env.INFINITEPAY_HANDLE || 'evertonterapeutareiki';
  const apiKey = () => process.env.INFINITEPAY_API_KEY?.trim() || '';
  const appUrl = () => {
    const url = new URL(process.env.PUBLIC_APP_URL || 'https://protocolo-de-cura-integrativa.vercel.app');
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('URL pública inválida.');
    return url.origin;
  };
  async function provider(path: string, body: unknown) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const key = apiKey();
    if (key) headers['X-Api-Key'] = key;
    const response = await providerFetch(API + path, { method: 'POST', headers, body: JSON.stringify(body), signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('O provedor não conseguiu processar o pagamento agora.');
    return response.json();
  }
  function buildCheckoutPayload(order: PaymentOrder, title: string, origin: string): InfinitePayCheckoutPayload {
    return {
      handle: handle(),
      order_nsu: order.id,
      redirect_url: `${origin}/?payment_order=${order.id}`,
      webhook_url: `${origin}/api/webhooks/payment`,
      items: [{ quantity: 1, price: order.cents, description: title }],
      options: { single_payment: true }
    };
  }
  async function createCheckoutUrl(payload: InfinitePayCheckoutPayload) {
    if (!apiKey()) throw new Error('A API Key da InfinitePay é necessária para criar links de pagamento único.');
    const result = await provider('/links', payload);
    if (!result || typeof result.url !== 'string') throw new Error('O provedor não retornou um link válido.');
    const checkout = new URL(result.url);
    if (checkout.protocol !== 'https:' || !['checkout.infinitepay.io', 'invoice.infinitepay.io', 'pay.infinitepay.io'].includes(checkout.hostname) || checkout.username || checkout.password) {
      throw new Error('Endereço de pagamento inválido.');
    }
    return checkout.href;
  }
  const numerologyCheckoutKey = (userId: string) => `cura_integrada:numerology-checkout:${userId}`;
  async function acquireNumerologyCheckoutLock(userId: string): Promise<(() => Promise<void>) | null> {
    const key = `cura_integrada:numerology-checkout-lock:${userId}`;
    const token = crypto.randomUUID();
    if (hasPersistentDatabase()) {
      const acquired = await redisCommand('set', [key, token, 'nx', 'px', '30000']);
      if (acquired !== 'OK') return null;
      return async () => {
        try {
          await redisCommand('eval', [
            'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end',
            '1', key, token
          ]);
        } catch { /* O TTL do lock é a proteção final caso a liberação falhe. */ }
      };
    }
    if (localNumerologyCheckoutLocks.has(userId)) return null;
    localNumerologyCheckoutLocks.add(userId);
    return async () => { localNumerologyCheckoutLocks.delete(userId); };
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
    let quote: { cents: number; title: string };
    let treatment: import('../types.js').SpecificTreatment | undefined;
    let releaseNumerologyLock: (() => Promise<void>) | undefined;
    let order: PaymentOrder | undefined;

    try {
      if (!['subscription', 'specific_treatment', 'numerology_full'].includes(productType) || !['pix', 'card', 'credit', 'debit'].includes(paymentMethod) || (productType === 'subscription' && typeof planId !== 'string') || (productType !== 'subscription' && planId != null) || (couponCode != null && typeof couponCode !== 'string')) throw new Error('Compra inválida.');
      if (productType === 'subscription') quote = paymentQuote(planId, couponCode || '');
      else if (productType === 'numerology_full') {
        if ((couponCode || '').trim() || req.body.customAmount != null) throw new Error('Cupom ou valor personalizado não permitido para este produto.');
        quote = { cents: 9000, title: 'Mapa Numerológico Cabalístico Completo' };
      } else {
        const { durationDays, category, patientDescription, urgentPains, title } = req.body;
        if (![7,21].includes(durationDays) || !['saude_fisica','prosperidade','liberacao_emocional','relacionamentos','limpeza_espiritual','outro'].includes(category) || typeof patientDescription !== 'string' || !patientDescription.trim() || patientDescription.length > 10000 || (title != null && (typeof title !== 'string' || title.length > 200)) || !Array.isArray(urgentPains) || urgentPains.length > 30 || urgentPains.some((v: unknown) => typeof v !== 'string' || v.length > 200)) throw new Error('Dados da prática inválidos.');
        const code = (couponCode || '').trim().toUpperCase();
        if (req.body.customAmount != null) throw new Error('Valores personalizados não são permitidos para prática individual.');
        const treatmentQuote = specificTreatmentQuote(durationDays, code);
        quote = { cents: treatmentQuote.cents, title: `Prática individual — ${durationDays} dias` };
        treatment = { id: crypto.randomUUID(), requestedAt: new Date().toISOString(), durationDays, category, title: title?.trim() || quote.title, patientDescription: patientDescription.trim(), urgentPains, status: 'pendente', price: treatmentQuote.cents / 100, paymentMethod: paymentMethod === 'pix' ? 'pix' : 'cartao' };
      }
    } catch (error) { return res.status(400).json({ error: (error as Error).message }); }

    if (!apiKey()) return res.status(503).json({ error: 'Pagamento temporariamente indisponível. A configuração segura do checkout precisa ser concluída.' });

    try {
      if (productType === 'numerology_full') {
        releaseNumerologyLock = await acquireNumerologyCheckoutLock(req.userId);
        if (!releaseNumerologyLock) return res.status(409).json({ error: 'Já existe uma tentativa de checkout em andamento. Aguarde alguns segundos e tente novamente.' });

        const db = getDb();
        const buyer = db.users.find(u => u.id === req.userId);
        if (!buyer) return res.sendStatus(401);
        if (buyer.plan === 'pro' || buyer.profile?.plan === 'pro' || buyer.profile?.numerologyPurchased) {
          return res.status(409).json({ error: 'O mapa numerológico completo já está liberado nesta conta.' });
        }

        const key = numerologyCheckoutKey(req.userId);
        if (hasPersistentDatabase()) {
          const stored = await redisCommand('get', [key]);
          if (typeof stored === 'string') {
            let saved: any;
            try { saved = JSON.parse(stored); } catch { saved = null; }
            const cachedOrder = saved && typeof saved.orderId === 'string' && typeof saved.checkoutUrl === 'string'
              ? db.paymentOrders?.find(candidate =>
                  candidate.id === saved.orderId &&
                  candidate.userId === req.userId &&
                  candidate.productType === 'numerology_full' &&
                  !candidate.paidAt &&
                  !candidate.failedAt &&
                  candidate.checkoutUrl === saved.checkoutUrl &&
                  candidate.checkoutPayload?.options?.single_payment === true
                )
              : undefined;
            if (cachedOrder?.checkoutUrl) {
              return res.json({ checkoutUrl: cachedOrder.checkoutUrl, orderId: cachedOrder.id, reused: true });
            }
            await redisCommand('del', [key]);
          }
        }

        const pendingOrders = (db.paymentOrders || [])
          .filter(candidate =>
            candidate.userId === req.userId &&
            candidate.productType === 'numerology_full' &&
            !candidate.paidAt &&
            !candidate.failedAt
          )
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

        const legacyReusableOrder = pendingOrders.find(candidate =>
          Boolean(candidate.checkoutUrl) && candidate.checkoutPayload?.options?.single_payment !== true
        );
        if (legacyReusableOrder) {
          return res.status(503).json({ error: 'Existe uma tentativa anterior sem proteção de pagamento único que precisa ser conferida antes de abrir outro link.' });
        }

        const reusableOrder = pendingOrders.find(candidate =>
          Boolean(candidate.checkoutUrl) && candidate.checkoutPayload?.options?.single_payment === true
        );
        if (reusableOrder?.checkoutUrl) {
          if (hasPersistentDatabase()) {
            await redisCommand('set', [key, JSON.stringify({ orderId: reusableOrder.id, checkoutUrl: reusableOrder.checkoutUrl }), 'ex', '86400']);
          }
          return res.json({ checkoutUrl: reusableOrder.checkoutUrl, orderId: reusableOrder.id, reused: true });
        }

        const preparingOrder = pendingOrders.find(candidate => !candidate.checkoutUrl);
        if (preparingOrder) {
          // Recupera somente com o payload original persistido antes da primeira chamada.
          // Reconstruir com handle/URLs atuais pode criar um segundo link para o mesmo NSU.
          if (!preparingOrder.checkoutPayload || preparingOrder.checkoutPayload.order_nsu !== preparingOrder.id) {
            return res.status(503).json({ error: 'A tentativa anterior precisa de conferência antes de ser retomada.' });
          }
          const checkoutUrl = await createCheckoutUrl(preparingOrder.checkoutPayload);
          preparingOrder.checkoutUrl = checkoutUrl;
          await saveDb();
          if (hasPersistentDatabase()) {
            await redisCommand('set', [key, JSON.stringify({ orderId: preparingOrder.id, checkoutUrl }), 'ex', '86400']);
          }
          return res.json({ checkoutUrl, orderId: preparingOrder.id, reused: true, recovered: true });
        }
      }

      const createdOrder: PaymentOrder = {
        id: crypto.randomUUID(), userId: req.userId, productType,
        ...(productType === 'subscription' ? { planId: planId as Plan } : {}),
        ...(treatment ? { treatment } : {}),
        cents: quote.cents, method: paymentMethod, createdAt: new Date().toISOString()
      };
      order = createdOrder;
      const origin = appUrl();
      createdOrder.checkoutPayload = buildCheckoutPayload(createdOrder, quote.title, origin);
      const db = getDb();
      (db.paymentOrders ||= []).push(createdOrder);
      await saveDb();

      createdOrder.checkoutUrl = await createCheckoutUrl(createdOrder.checkoutPayload);
      await saveDb();
      if (productType === 'numerology_full' && hasPersistentDatabase()) {
        await redisCommand('set', [numerologyCheckoutKey(req.userId), JSON.stringify({ orderId: createdOrder.id, checkoutUrl: createdOrder.checkoutUrl }), 'ex', '86400']);
      }
      return res.json({ checkoutUrl: createdOrder.checkoutUrl, orderId: createdOrder.id });
    } catch {
      if (order && !order.checkoutUrl && productType !== 'numerology_full') {
        order.failedAt = new Date().toISOString();
        try { await saveDb(); } catch { /* Mantém a tentativa bloqueada se a persistência falhar. */ }
      }
      return res.status(503).json({ error: 'Não foi possível abrir o pagamento seguro. Tente novamente em instantes.' });
    } finally {
      if (releaseNumerologyLock) await releaseNumerologyLock();
    }
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
    const subscriptionPlan = order.planId ? PAYMENT_PLANS[order.planId] : undefined;
    if (!order.treatment && order.productType !== 'numerology_full' && !subscriptionPlan) return { status: 409, data: { error: 'Compra sem produto ou plano válido.' } };
    if (!order.paidAt) {
      const verified = await provider('/payment_check', { handle: order.checkoutPayload?.handle || handle(), order_nsu, transaction_nsu, slug });
      if (verified.success !== true || verified.paid !== true || verified.amount !== order.cents) return { status: 202, data: { status: 'pending' } };
      if (order.paidAt) return { status: 200, data: userId ? { status: 'paid', user: { profile: user.profile } } : { success: true } };
      if (db.paymentOrders?.some(o => o.id !== order.id && o.transaction === transaction_nsu)) return { status: 409, data: { error: 'Transação já utilizada.' } };
      const previous = { plan: user.plan, profile: user.profile };
      const now = new Date();
      order.paidAt = now.toISOString(); order.transaction = transaction_nsu;
      if (order.treatment) {
        user.profile = { ...user.profile, specificTreatments: [...(user.profile?.specificTreatments || []), order.treatment] };
      } else if (order.productType === 'numerology_full') {
        user.profile = { ...user.profile, numerologyPurchased: true };
      } else {
        user.plan = 'pro';
        user.profile = { ...user.profile, plan: 'pro', subscriptionPlan: order.planId,
          subscriptionPrice: order.cents / 100, subscriptionPaymentMethod: order.method,
          proActiveSince: now.toISOString(), subscriptionExpiresAt: new Date(now.getTime() + subscriptionPlan!.days * 86400000).toISOString() };
      }
      try { await saveDb(); } catch (error) { user.plan = previous.plan; user.profile = previous.profile; delete order.paidAt; delete order.transaction; throw error; }
      if (order.productType === 'numerology_full' && hasPersistentDatabase()) {
        try { await redisCommand('del', [numerologyCheckoutKey(order.userId)]); } catch { /* A liberação do entitlement já foi persistida. */ }
      }
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
