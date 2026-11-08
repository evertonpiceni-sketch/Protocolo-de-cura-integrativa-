import { Router } from 'express';
import crypto from 'node:crypto';
import { getDb, saveDb, hasPersistentDatabase, redisCommand, refreshDbFromPersistentStorage } from '../db.js';

import { PAYMENT_PLANS, paymentQuote, specificTreatmentQuote, type Plan } from './paymentCatalog.js';
export type InfinitePayCheckoutPayload = {
  handle: string;
  order_nsu: string;
  redirect_url: string;
  webhook_url: string;
  items: Array<{ quantity: number; price: number; description: string }>;
  options: { single_payment: true };
};
export type PaymentOrder = { id: string; userId: string; productType?: 'subscription' | 'specific_treatment'; planId?: Plan; treatment?: import('../types.js').SpecificTreatment; cents: number; method: string; createdAt: string; paidAt?: string; transaction?: string; checkoutUrl?: string; checkoutPayload?: InfinitePayCheckoutPayload; checkoutRecoveryAttempts?: number; failedAt?: string };
const API = 'https://api.checkout.infinitepay.io';
export const PAYMENT_DATABASE_WRITE_LOCK_SCOPE = 'payment:shared-database-write';
const localPaymentCheckoutLocks = new Set<string>();
const CHECKOUT_LOCK_TTL_MS = 30_000;
const CHECKOUT_LOCK_RENEW_INTERVAL_MS = 10_000;
const RENEW_CHECKOUT_LOCK_SCRIPT = 'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("pexpire", KEYS[1], ARGV[2]) else return 0 end';
const RELEASE_CHECKOUT_LOCK_SCRIPT = 'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end';

export type CheckoutCreationLock = {
  assertHeld: () => Promise<void>;
  release: () => Promise<void>;
};

type CheckoutCreationLockDependencies = {
  hasPersistentDatabase?: () => boolean;
  redisCommand?: typeof redisCommand;
  ttlMs?: number;
  renewIntervalMs?: number;
};

export async function acquireCheckoutCreationLock(
  scope: string,
  dependencies: CheckoutCreationLockDependencies = {},
  keyPrefix = 'cura_integrada:checkout-lock:'
): Promise<CheckoutCreationLock | null> {
  const persistent = dependencies.hasPersistentDatabase ?? hasPersistentDatabase;
  const lockIdentity = `${keyPrefix}${scope}`;
  const runRedisCommand = dependencies.redisCommand ?? redisCommand;
  const ttlMs = dependencies.ttlMs ?? CHECKOUT_LOCK_TTL_MS;
  const renewIntervalMs = dependencies.renewIntervalMs ?? CHECKOUT_LOCK_RENEW_INTERVAL_MS;

  if (persistent()) {
    const key = lockIdentity;
    const token = crypto.randomUUID();
    const acquired = await runRedisCommand('set', [key, token, 'nx', 'px', String(ttlMs)]);
    if (acquired !== 'OK') return null;

    let lost = false;
    let released = false;
    let renewalInFlight: Promise<boolean> | null = null;

    const renew = async () => {
      if (released || lost) return false;
      try {
        const result = await runRedisCommand('eval', [
          RENEW_CHECKOUT_LOCK_SCRIPT, '1', key, token, String(ttlMs)
        ]);
        const renewed = result === 1 || result === '1';
        if (!renewed) lost = true;
        return renewed;
      } catch {
        lost = true;
        return false;
      }
    };

    const renewOnce = () => {
      if (!renewalInFlight) {
        renewalInFlight = renew().finally(() => { renewalInFlight = null; });
      }
      return renewalInFlight;
    };

    const timer = setInterval(() => { void renewOnce(); }, Math.max(1, renewIntervalMs));
    timer.unref?.();

    return {
      assertHeld: async () => {
        if (released || lost || !(await renewOnce())) {
          throw new Error('A proteção do checkout expirou. Tente novamente.');
        }
      },
      release: async () => {
        if (released) return;
        released = true;
        clearInterval(timer);
        if (renewalInFlight) await renewalInFlight;
        try {
          await runRedisCommand('eval', [RELEASE_CHECKOUT_LOCK_SCRIPT, '1', key, token]);
        } catch { /* O TTL libera o lock caso a exclusão explícita falhe. */ }
      }
    };
  }

  if (localPaymentCheckoutLocks.has(lockIdentity)) return null;
  localPaymentCheckoutLocks.add(lockIdentity);
  let released = false;
  return {
    assertHeld: async () => {
      if (released || !localPaymentCheckoutLocks.has(lockIdentity)) {
        throw new Error('A proteção do checkout expirou. Tente novamente.');
      }
    },
    release: async () => {
      if (released) return;
      released = true;
      localPaymentCheckoutLocks.delete(lockIdentity);
    }
  };
}

export function paymentRoutes(authenticate: any, limiter: any, providerFetch: typeof fetch = fetch, saveCheckoutOrder: typeof saveDb = saveDb) {
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
    if (payload.options?.single_payment !== true) throw new Error('O checkout precisa estar configurado para um único pagamento.');
    if (!apiKey()) throw new Error('A API Key da InfinitePay é necessária para criar links de pagamento único.');
    const result = await provider('/links', payload);
    if (!result || typeof result.url !== 'string') throw new Error('O provedor não retornou um link válido.');
    const checkout = new URL(result.url);
    if (checkout.protocol !== 'https:' || !['checkout.infinitepay.io', 'invoice.infinitepay.io', 'pay.infinitepay.io'].includes(checkout.hostname) || checkout.username || checkout.password) {
      throw new Error('Endereço de pagamento inválido.');
    }
    return checkout.href;
  }
  router.post('/user/upgrade', authenticate, limiter, async (req: any, res) => {
    if (req.body?.planId !== 'teste_vip_7d' || req.body?.couponCode !== 'VIP7' || req.body?.paymentMethod !== 'trial') return res.status(400).json({ error: 'Ativação inválida.' });
    let releasePaymentDatabaseLock: CheckoutCreationLock | undefined;
    let user: any;
    let previous: { plan: any; profile: any } | undefined;
    try {
      releasePaymentDatabaseLock = await acquireCheckoutCreationLock(PAYMENT_DATABASE_WRITE_LOCK_SCOPE);
      if (!releasePaymentDatabaseLock) return res.status(409).json({ error: 'Há outra atualização de pagamento em andamento. Tente novamente em instantes.' });
      await releasePaymentDatabaseLock.assertHeld();
      await refreshDbFromPersistentStorage();
      await releasePaymentDatabaseLock.assertHeld();
      user = getDb().users.find(u => u.id === req.userId);
      if (!user) return res.sendStatus(401);
      if (user.profile?.trial7dRedeemedAt || user.plan === 'pro') return res.status(409).json({ error: 'A degustação já foi utilizada ou há um acesso ativo.' });
      previous = { plan: user.plan, profile: user.profile };
      const now = new Date();
      user.plan = 'pro';
      user.profile = { ...user.profile, plan: 'pro', subscriptionPlan: 'teste_vip_7d',
        trial7dRedeemedAt: now.toISOString(), proActiveSince: now.toISOString(),
        subscriptionExpiresAt: new Date(now.getTime() + 7 * 86400000).toISOString() };
      await releasePaymentDatabaseLock.assertHeld();
      await saveDb();
      return res.json({ user: { profile: user.profile } });
    } catch {
      if (user && previous) { user.plan = previous.plan; user.profile = previous.profile; }
      return res.status(503).json({ error: 'Não foi possível ativar a degustação agora.' });
    } finally {
      if (releasePaymentDatabaseLock) await releasePaymentDatabaseLock.release();
    }
  });
  router.post('/payment/create-checkout', authenticate, limiter, async (req: any, res) => {
    const { planId, paymentMethod, couponCode, productType } = req.body || {};
    let quote: { cents: number; title: string };
    let treatment: import('../types.js').SpecificTreatment | undefined;
    let releaseStandardCheckoutLock: CheckoutCreationLock | undefined;
    let order: PaymentOrder | undefined;
    let providerRequestStarted = false;
    let recoveringExistingOrder = false;

    try {
      if (!['subscription', 'specific_treatment'].includes(productType) || !['pix', 'card', 'credit', 'debit'].includes(paymentMethod) || (productType === 'subscription' && typeof planId !== 'string') || (productType !== 'subscription' && planId != null) || (couponCode != null && typeof couponCode !== 'string')) throw new Error('Compra inválida.');
      if (productType === 'subscription') quote = paymentQuote(planId, couponCode || '');
      else {
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
      {
        releaseStandardCheckoutLock = await acquireCheckoutCreationLock(PAYMENT_DATABASE_WRITE_LOCK_SCOPE);
        if (!releaseStandardCheckoutLock) return res.status(409).json({ error: 'Já existe uma tentativa de checkout em andamento. Aguarde alguns segundos e tente novamente.' });
        await releaseStandardCheckoutLock.assertHeld();
        // Cada instância Vercel pode ter um snapshot local antigo. Recarrega o estado compartilhado
        // enquanto o lock está ativo antes de deduplicar ou gravar qualquer pedido.
        await refreshDbFromPersistentStorage();
        await releaseStandardCheckoutLock.assertHeld();

        const db = getDb();
        const pendingStandardOrders = (db.paymentOrders || []).filter(candidate =>
          candidate.userId === req.userId &&
          (candidate.productType === productType ||
            (candidate.productType == null && productType === 'subscription' && Boolean(candidate.planId)) ||
            (candidate.productType == null && productType === 'specific_treatment' && Boolean(candidate.treatment))) &&
          !candidate.paidAt &&
          !candidate.failedAt
        );
        const matchesRequestedStandardOrder = (candidate: PaymentOrder) => {
          if (candidate.cents !== quote.cents || candidate.method !== paymentMethod) return false;
          if (productType === 'subscription') return candidate.planId === planId;
          if (productType !== 'specific_treatment' || !candidate.treatment || !treatment) return false;
          const saved = candidate.treatment;
          return saved.durationDays === treatment.durationDays &&
            saved.category === treatment.category &&
            saved.title === treatment.title &&
            saved.patientDescription === treatment.patientDescription &&
            JSON.stringify(saved.urgentPains || []) === JSON.stringify(treatment.urgentPains || []) &&
            saved.paymentMethod === treatment.paymentMethod;
        };
        const preparingOrders = pendingStandardOrders.filter(candidate => !candidate.checkoutUrl);
        if (preparingOrders.length > 0) {
          if (preparingOrders.length !== 1 || pendingStandardOrders.length !== 1) {
            return res.status(503).json({ error: 'Há tentativas de pagamento em preparação que precisam de conferência antes de continuar.' });
          }
          const preparing = preparingOrders[0];
          const payload = preparing.checkoutPayload;
          if (!matchesRequestedStandardOrder(preparing)) {
            return res.status(409).json({ error: 'Existe uma tentativa de pagamento diferente ainda em preparação. Conclua ou solicite conferência antes de iniciar outra.' });
          }
          if (!payload || payload.order_nsu !== preparing.id || payload.options?.single_payment !== true || payload.items?.[0]?.price !== preparing.cents) {
            return res.status(503).json({ error: 'A tentativa anterior não contém o payload original protegido e precisa de conferência.' });
          }
          const recoveryAttempts = Number.isInteger(preparing.checkoutRecoveryAttempts)
            ? Math.max(0, preparing.checkoutRecoveryAttempts || 0)
            : 0;
          if (recoveryAttempts >= 1) {
            return res.status(503).json({ error: 'A recuperação automática já foi utilizada. É necessária conferência manual para evitar links duplicados.' });
          }
          order = preparing;
          recoveringExistingOrder = true;
          await releaseStandardCheckoutLock.assertHeld();
          const previousRecoveryAttempts = preparing.checkoutRecoveryAttempts;
          preparing.checkoutRecoveryAttempts = recoveryAttempts + 1;
          try {
            await saveCheckoutOrder();
          } catch (error) {
            if (previousRecoveryAttempts === undefined) delete preparing.checkoutRecoveryAttempts;
            else preparing.checkoutRecoveryAttempts = previousRecoveryAttempts;
            throw error;
          }
          await releaseStandardCheckoutLock.assertHeld();
          providerRequestStarted = true;
          // A InfinitePay não oferece consulta por order_nsu; uma única repetição idêntica pode devolver o mesmo link.
          const checkoutUrl = await createCheckoutUrl(payload);
          await releaseStandardCheckoutLock.assertHeld();
          preparing.checkoutUrl = checkoutUrl;
          await saveCheckoutOrder();
          return res.json({ checkoutUrl, orderId: preparing.id, reused: true, recovered: true });
        }

        const legacyLinkedOrder = pendingStandardOrders.find(candidate =>
          Boolean(candidate.checkoutUrl) && candidate.checkoutPayload?.options?.single_payment !== true
        );
        if (legacyLinkedOrder) {
          return res.status(503).json({ error: 'Existe um link anterior sem proteção de pagamento único que precisa de conferência antes de abrir outro.' });
        }

        if (productType === 'specific_treatment' && pendingStandardOrders.some(candidate =>
          candidate.productType == null && Boolean(candidate.treatment) && !matchesRequestedStandardOrder(candidate)
        )) {
          return res.status(409).json({ error: 'Existe uma prática individual legada pendente com dados diferentes. Conclua ou solicite conferência antes de iniciar outra.' });
        }

        if (productType === 'subscription' && pendingStandardOrders.some(candidate => !matchesRequestedStandardOrder(candidate))) {
          return res.status(409).json({ error: 'Já existe um checkout de assinatura pendente para outro plano. Conclua ou solicite conferência antes de iniciar outro.' });
        }

        const matchingLinkedOrders = pendingStandardOrders.filter(candidate =>
          Boolean(candidate.checkoutUrl) && matchesRequestedStandardOrder(candidate)
        );
        if (matchingLinkedOrders.length > 1) {
          return res.status(503).json({ error: 'Há mais de um link pendente para esta compra. É necessária uma conferência antes de continuar.' });
        }
        if (matchingLinkedOrders.length === 1) {
          const matching = matchingLinkedOrders[0];
          const payload = matching.checkoutPayload;
          if (!payload || payload.order_nsu !== matching.id || payload.options?.single_payment !== true || payload.items?.[0]?.price !== matching.cents) {
            return res.status(503).json({ error: 'O link anterior não comprova pagamento único e precisa de conferência antes de ser reutilizado.' });
          }
          return res.json({ checkoutUrl: matching.checkoutUrl, orderId: matching.id, reused: true });
        }
      }

      if (releaseStandardCheckoutLock) await releaseStandardCheckoutLock.assertHeld();
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
      await saveCheckoutOrder();
      if (releaseStandardCheckoutLock) await releaseStandardCheckoutLock.assertHeld();
      providerRequestStarted = true;
      createdOrder.checkoutUrl = await createCheckoutUrl(createdOrder.checkoutPayload);
      if (releaseStandardCheckoutLock) await releaseStandardCheckoutLock.assertHeld();
      await saveCheckoutOrder();
      return res.json({ checkoutUrl: createdOrder.checkoutUrl, orderId: createdOrder.id });
    } catch {
      if (order && !order.checkoutUrl && !providerRequestStarted && !recoveringExistingOrder && releaseStandardCheckoutLock) {
        try {
          // A limpeza também grava o snapshot inteiro: só pode ocorrer enquanto este request
          // ainda possui o lock global e depois de recarregar o estado compartilhado.
          await releaseStandardCheckoutLock.assertHeld();
          await refreshDbFromPersistentStorage();
          await releaseStandardCheckoutLock.assertHeld();
          const persistedOrder = getDb().paymentOrders?.find(candidate => candidate.id === order?.id);
          if (persistedOrder && !persistedOrder.checkoutUrl && !persistedOrder.paidAt && !persistedOrder.failedAt) {
            persistedOrder.failedAt = new Date().toISOString();
            await releaseStandardCheckoutLock.assertHeld();
            await saveCheckoutOrder();
          }
        } catch {
          // Sem posse comprovada do lock, não gravar um snapshot possivelmente obsoleto.
          // A tentativa permanece pendente para recuperação segura ou conferência manual.
        }
      }
      return res.status(503).json({ error: 'Não foi possível abrir o pagamento seguro. Tente novamente em instantes.' });
    } finally {
      if (releaseStandardCheckoutLock) await releaseStandardCheckoutLock.release();
    }
  });
  async function confirm(body: any, userId?: string) {
    const { order_nsu, transaction_nsu } = body || {};
    const slug = body?.slug || body?.invoice_slug;
    if (![order_nsu, transaction_nsu, slug].every(v => typeof v === 'string' && v.length > 0 && v.length < 250)) return { status: 400, data: { error: 'Confirmação inválida.' } };

    const releasePaymentDatabaseLock = await acquireCheckoutCreationLock(PAYMENT_DATABASE_WRITE_LOCK_SCOPE);
    if (!releasePaymentDatabaseLock) return { status: 409, data: { error: 'Há outra atualização de pagamento em andamento. Tente novamente em instantes.' } };

    try {
      await releasePaymentDatabaseLock.assertHeld();
      await refreshDbFromPersistentStorage();
      await releasePaymentDatabaseLock.assertHeld();

      const db = getDb();
      const order = db.paymentOrders?.find(o => o.id === order_nsu && (!userId || o.userId === userId));
      if (!order) return { status: 404, data: { error: 'Compra não encontrada.' } };
      const user = db.users.find(u => u.id === order.userId);
      if (!user) return { status: 404, data: { error: 'Conta não encontrada.' } };
      const subscriptionPlan = order.planId ? PAYMENT_PLANS[order.planId] : undefined;
      if (!order.treatment && !subscriptionPlan) return { status: 409, data: { error: 'Compra sem produto ou plano válido.' } };
      if (!order.paidAt) {
        const verified = await provider('/payment_check', { handle: order.checkoutPayload?.handle || handle(), order_nsu, transaction_nsu, slug });
        await releasePaymentDatabaseLock.assertHeld();
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
            proActiveSince: now.toISOString(), subscriptionExpiresAt: new Date(now.getTime() + subscriptionPlan!.days * 86400000).toISOString() };
        }
        try {
          await releasePaymentDatabaseLock.assertHeld();
          await saveDb();
        } catch (error) {
          user.plan = previous.plan; user.profile = previous.profile; delete order.paidAt; delete order.transaction; throw error;
        }
      }
      return { status: 200, data: userId ? { status: 'paid', user: { profile: user.profile } } : { success: true } };
    } finally {
      await releasePaymentDatabaseLock.release();
    }
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
