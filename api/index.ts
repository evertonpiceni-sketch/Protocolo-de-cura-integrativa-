import app from "../server.js";
import { initializeDb, getDb, saveDb } from "../src/db.js";
import { REINTEGRATION_DAYS } from "../src/data/reintegrationJourneyPublic.js";
import { ElevenLabsClient } from "elevenlabs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { protocolAudioCacheKey } from '../src/lib/ttsText.js';

const bootstrapAttempts = new Map<string, { count: number; resetAt: number }>();
const reintegrationAudioCache = new Map<string, Buffer>();
const reintegrationVoiceAttempts = new Map<string, { count: number; resetAt: number }>();
const reintegrationCues = new Set(REINTEGRATION_DAYS.flatMap(day => day.audioCues.map(cue => cue.text.trim())));

const INFINITEPAY_HANDLE = "evertonterapeutareiki";
const PAYMENT_TIMEOUT_MS = 8000;
const PAID_PLANS: Record<string, { amount: number; days: number; description: string }> = {
  jornada_7d: { amount: 2500, days: 7, description: "Acesso avulso — 7 dias" },
  jornada_21d: { amount: 5000, days: 21, description: "Acesso avulso — 21 dias" },
  mensal: { amount: 3990, days: 30, description: "Plano Mensal" },
  trimestral: { amount: 6990, days: 90, description: "Plano Trimestral" },
  semestral: { amount: 9990, days: 180, description: "Plano Semestral" },
  anual: { amount: 15990, days: 365, description: "Plano Anual" },
};
const SPECIFIC_TREATMENT_PRICES: Record<number, number> = { 1: 2000, 7: 5990, 21: 9990 };
const SPECIFIC_TREATMENT_COUPONS: Record<string, number> = {
  CURA10: 10, PAZ10: 10, PAZ20: 20, CURA20: 20, GRATIDAO: 20,
  PROMO30: 30, CURA30: 30, PICENI50: 50, VIP50: 50,
};

type PaymentOrder = {
  orderNsu: string;
  productType: 'subscription' | 'numerology_full' | 'specific_treatment';
  planId?: string;
  expectedAmount: number;
  preferredPaymentMethod?: string;
  status: 'pending' | 'paid' | 'failed';
  createdAt: string;
  paidAt?: string;
  transactionNsu?: string;
  invoiceSlug?: string;
  metadata?: Record<string, any>;
};

function getCookie(req: any, name: string) {
  const raw = typeof req.headers?.cookie === "string" ? req.headers.cookie : "";
  for (const part of raw.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return undefined;
}

function getAuthenticatedUser(req: any) {
  const secret = process.env.JWT_SECRET;
  const token = getCookie(req, "token");
  if (!secret || secret.length < 32 || !token) return null;
  try {
    const decoded = jwt.verify(token, secret) as { userId?: string };
    if (!decoded.userId) return null;
    return getDb().users.find((user: any) => user.id === decoded.userId) || null;
  } catch {
    return null;
  }
}

function getPaymentOrders(user: any): PaymentOrder[] {
  if (!Array.isArray(user.paymentOrders)) user.paymentOrders = [];
  return user.paymentOrders;
}

function getOrigin(req: any) {
  const configured = String(process.env.PUBLIC_APP_URL || '').trim().replace(/\/$/, '');
  if (/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(configured)) return configured;
  const vercelHost = String(process.env.VERCEL_PROJECT_PRODUCTION_URL || '').trim();
  if (/^[a-z0-9.-]+$/i.test(vercelHost)) return `https://${vercelHost}`;
  const host = String(req.headers?.['x-forwarded-host'] || req.headers?.host || '').split(',')[0].trim();
  if (!/^[a-z0-9.-]+(?::\d+)?$/i.test(host)) throw new Error('Host inválido para o retorno do pagamento.');
  const proto = String(req.headers?.['x-forwarded-proto'] || '').split(',')[0].trim() === 'http' ? 'http' : 'https';
  return `${proto}://${host}`;
}

async function infinitePayRequest(url: string, body: Record<string, unknown>) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PAYMENT_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.message || payload?.error || `InfinitePay respondeu ${response.status}.`);
    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

function resolveCheckout(req: any) {
  const body = req.body || {};
  const productType = body.productType;
  if (productType === 'subscription') {
    const planId = String(body.planId || '');
    const plan = PAID_PLANS[planId];
    if (!plan) throw new Error('Plano de pagamento inválido ou não habilitado.');
    return {
      productType,
      planId,
      amount: plan.amount,
      description: plan.description,
      metadata: {},
    };
  }

  if (productType === 'numerology_full') {
    return {
      productType,
      amount: 9000,
      description: 'Mapa Numerológico Completo',
      metadata: {},
    };
  }

  if (productType === 'specific_treatment') {
    const durationDays = Number(body.durationDays);
    const baseAmount = SPECIFIC_TREATMENT_PRICES[durationDays];
    if (!baseAmount) throw new Error('Duração da prática individual inválida.');
    const couponCode = String(body.couponCode || '').trim().toUpperCase();
    const discount = couponCode ? SPECIFIC_TREATMENT_COUPONS[couponCode] : 0;
    if (couponCode && !discount) throw new Error('Cupom não reconhecido pelo servidor.');
    const amount = Math.round(baseAmount * (1 - discount / 100));
    const clientAmount = Math.round(Number(body.price) * 100);
    if (!Number.isFinite(clientAmount) || clientAmount !== amount) {
      throw new Error('O valor desta prática precisa ser recalculado pelo servidor antes do pagamento.');
    }
    return {
      productType,
      amount,
      description: `Prática individual — ${durationDays} dia${durationDays === 1 ? '' : 's'}`,
      metadata: {
        durationDays,
        category: String(body.category || 'outro'),
        title: typeof body.title === 'string' ? body.title.slice(0, 120) : '',
        patientDescription: typeof body.patientDescription === 'string' ? body.patientDescription.slice(0, 4000) : '',
        urgentPains: Array.isArray(body.urgentPains) ? body.urgentPains.map(String).slice(0, 20) : [],
        couponCode: couponCode || undefined,
      },
    };
  }

  throw new Error('Produto de pagamento inválido.');
}

async function activatePaidOrder(user: any, order: PaymentOrder, payment: any) {
  if (order.status === 'paid') return;
  if (!payment?.paid || Number(payment.amount) !== order.expectedAmount) {
    throw new Error('Pagamento não confirmado com o valor esperado.');
  }

  const now = new Date();
  if (order.productType === 'subscription') {
    const plan = order.planId ? PAID_PLANS[order.planId] : undefined;
    if (!plan) throw new Error('Plano do pedido não encontrado.');
    const expiresAt = new Date(now.getTime() + plan.days * 24 * 60 * 60 * 1000);
    user.plan = 'pro';
    user.profile = {
      ...(user.profile || {}),
      plan: 'pro',
      subscriptionPlan: order.planId,
      subscriptionPrice: order.expectedAmount / 100,
      subscriptionPaymentMethod: payment.capture_method === 'pix' ? 'pix' : 'card',
      proActiveSince: now.toISOString(),
      subscriptionExpiresAt: expiresAt.toISOString(),
    };
  } else if (order.productType === 'numerology_full') {
    user.profile = { ...(user.profile || {}), numerologyPurchased: true };
  } else if (order.productType === 'specific_treatment') {
    const metadata = order.metadata || {};
    const treatment = {
      id: `treatment-${order.orderNsu}`,
      requestedAt: now.toISOString(),
      durationDays: metadata.durationDays,
      category: metadata.category || 'outro',
      title: metadata.title || `Prática individual de ${metadata.durationDays || 1} dia(s)`,
      patientDescription: metadata.patientDescription || '',
      urgentPains: metadata.urgentPains || [],
      status: 'aprovado',
      price: order.expectedAmount / 100,
      paymentMethod: payment.capture_method === 'pix' ? 'pix' : 'cartao',
    };
    const currentTreatments = Array.isArray(user.profile?.specificTreatments) ? user.profile.specificTreatments : [];
    if (!currentTreatments.some((item: any) => item?.id === treatment.id)) {
      user.profile = { ...(user.profile || {}), specificTreatments: [...currentTreatments, treatment] };
    }
    order.metadata = { ...metadata, treatment };
  }

  order.status = 'paid';
  order.paidAt = now.toISOString();
  order.transactionNsu = String(payment.transaction_nsu || order.transactionNsu || '');
  order.invoiceSlug = String(payment.slug || payment.invoice_slug || order.invoiceSlug || '');
  await saveDb();
}

async function verifyInfinitePay(order: PaymentOrder, transactionNsu: string, slug: string) {
  if (!transactionNsu || !slug) throw new Error('Identificadores do pagamento ausentes.');
  const payment = await infinitePayRequest('https://api.checkout.infinitepay.io/payment_check', {
    handle: INFINITEPAY_HANDLE,
    order_nsu: order.orderNsu,
    transaction_nsu: transactionNsu,
    slug,
  });
  return { ...payment, transaction_nsu: transactionNsu, slug };
}

async function createCheckout(req: any, res: any) {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: 'Entre na sua conta para iniciar o pagamento.' });

  try {
    const resolved = resolveCheckout(req);
    const orderNsu = crypto.randomUUID();
    const origin = getOrigin(req);
    const order: PaymentOrder = {
      orderNsu,
      productType: resolved.productType as PaymentOrder['productType'],
      planId: resolved.planId,
      expectedAmount: resolved.amount,
      preferredPaymentMethod: String(req.body?.paymentMethod || ''),
      status: 'pending',
      createdAt: new Date().toISOString(),
      metadata: resolved.metadata,
    };
    getPaymentOrders(user).push(order);
    await saveDb();

    const customer: Record<string, string> = {};
    const customerName = String(user.fullName || user.profile?.name || '').trim();
    const customerEmail = String(user.email || user.profile?.email || '').trim();
    if (customerName) customer.name = customerName;
    if (customerEmail) customer.email = customerEmail;

    const payload = await infinitePayRequest('https://api.checkout.infinitepay.io/links', {
      handle: INFINITEPAY_HANDLE,
      redirect_url: `${origin}/payment-return.html`,
      webhook_url: `${origin}/api/webhooks/payment`,
      order_nsu: orderNsu,
      items: [{ quantity: 1, price: resolved.amount, description: resolved.description }],
      ...(Object.keys(customer).length ? { customer } : {}),
    });

    if (!payload?.url || !/^https:\/\/(?:checkout\.)?infinitepay\.(?:com\.br|io)\//i.test(String(payload.url))) {
      throw new Error('A InfinitePay não retornou um checkout válido.');
    }
    return res.json({ checkoutUrl: payload.url, orderNsu, status: 'pending' });
  } catch (error: any) {
    console.error('InfinitePay checkout:', error?.message || error);
    return res.status(502).json({ error: error?.message || 'Não foi possível iniciar o pagamento seguro.' });
  }
}

async function confirmPayment(req: any, res: any) {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: 'Sessão não encontrada. Entre novamente para confirmar o pagamento.' });
  const orderNsu = String(req.body?.order_nsu || req.body?.orderNsu || '');
  const transactionNsu = String(req.body?.transaction_nsu || req.body?.transactionNsu || '');
  const slug = String(req.body?.slug || req.body?.invoice_slug || '');
  const order = getPaymentOrders(user).find(item => item.orderNsu === orderNsu);
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado nesta conta.' });

  try {
    if (order.status !== 'paid') {
      const payment = await verifyInfinitePay(order, transactionNsu, slug);
      await activatePaidOrder(user, order, payment);
    }
    const { password: _password, ...safeUser } = user;
    return res.json({ success: true, status: 'paid', user: safeUser, productType: order.productType, metadata: order.metadata });
  } catch (error: any) {
    return res.status(409).json({ success: false, status: 'pending', error: error?.message || 'Pagamento ainda não confirmado.' });
  }
}

async function paymentWebhook(req: any, res: any) {
  const orderNsu = String(req.body?.order_nsu || '');
  const transactionNsu = String(req.body?.transaction_nsu || '');
  const slug = String(req.body?.invoice_slug || req.body?.slug || '');
  const user = getDb().users.find((candidate: any) => getPaymentOrders(candidate).some(item => item.orderNsu === orderNsu));
  if (!user) return res.status(400).json({ success: false, message: 'Pedido não encontrado' });
  const order = getPaymentOrders(user).find(item => item.orderNsu === orderNsu)!;

  try {
    if (order.status !== 'paid') {
      const payment = await verifyInfinitePay(order, transactionNsu, slug);
      await activatePaidOrder(user, order, payment);
    }
    return res.status(200).json({ success: true, message: null });
  } catch (error: any) {
    console.warn('InfinitePay webhook não confirmado:', error?.message || error);
    return res.status(400).json({ success: false, message: 'Pagamento não confirmado' });
  }
}

async function expirePaidAccessIfNeeded(req: any) {
  const user = getAuthenticatedUser(req);
  if (!user || user.plan !== 'pro') return;
  const expiresAt = user.profile?.subscriptionExpiresAt;
  if (!expiresAt || Date.now() < new Date(expiresAt).getTime()) return;
  user.plan = 'free';
  user.profile = {
    ...(user.profile || {}),
    plan: 'free',
    subscriptionPlan: undefined,
    subscriptionExpiresAt: undefined,
    proActiveSince: undefined,
  };
  await saveDb();
}

function allowBootstrapAttempt(req: any) {
  const key = String(req.headers?.["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  const now = Date.now();
  const current = bootstrapAttempts.get(key);
  if (!current || current.resetAt <= now) {
    bootstrapAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (current.count >= 8) return false;
  current.count += 1;
  return true;
}

function allowReintegrationVoiceAttempt(req: any) {
  const key = String(req.headers?.["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  const now = Date.now();
  const current = reintegrationVoiceAttempts.get(key);
  if (!current || current.resetAt <= now) {
    reintegrationVoiceAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (current.count >= 90) return false;
  current.count += 1;
  return true;
}

const prepareReintegrationText = (text: string) => text
  .replace(/\r\n/g, "\n")
  .replace(/\n{2,}/g, ' <break time="1.25s" /> ')
  .replace(/([.!?])\s+/g, '$1 <break time="0.72s" /> ')
  .replace(/([;:])\s+/g, '$1 <break time="0.42s" /> ')
  .replace(/,\s+/g, ', <break time="0.22s" /> ')
  .replace(/\s{2,}/g, ' ')
  .trim();

async function serveReintegrationVoice(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });
  if (!allowReintegrationVoiceAttempt(req)) {
    return res.status(429).json({ error: "Limite temporário de voz atingido.", fallbackToSpeechSynthesis: true });
  }
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  const day = Math.max(1, Math.min(21, Number(req.body?.day) || 1));
  if (!text || !reintegrationCues.has(text)) return res.status(403).json({ error: "Trecho não autorizado para esta jornada." });
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "Voz neural indisponível." });

  const spokenText = text;
  const cacheKey = protocolAudioCacheKey(`reintegration_v4_${day}_Rachel`, 1, spokenText);
  const cached = reintegrationAudioCache.get(cacheKey);
  if (cached) {
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800");
    return res.send(cached);
  }

  try {
    const client = new ElevenLabsClient({ apiKey });
    const audioStream = await client.generate({
      voice: "21m00Tcm4TlvDq8ikWAM",
      model_id: "eleven_multilingual_v2",
      text: prepareReintegrationText(spokenText),
      voice_settings: { stability: 0.46, similarity_boost: 0.8, style: 0.08, use_speaker_boost: true }
    });
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream as any) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    const buffer = Buffer.concat(chunks);
    if (!buffer.length) throw new Error("ElevenLabs retornou áudio vazio.");
    if (reintegrationAudioCache.size > 100) reintegrationAudioCache.delete(reintegrationAudioCache.keys().next().value as string);
    reintegrationAudioCache.set(cacheKey, buffer);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800");
    return res.send(buffer);
  } catch (error: any) {
    const statusCode = Number(error?.statusCode || error?.status || error?.response?.status || 0);
    if (statusCode === 402 || statusCode === 429) {
      console.warn("Reintegração TTS temporariamente indisponível; o cliente usará a voz do dispositivo.", statusCode);
      return res.status(503).json({
        error: "Voz neural temporariamente indisponível.",
        fallbackToSpeechSynthesis: true
      });
    }
    console.error("Reintegração TTS:", error?.message || error);
    return res.status(500).json({
      error: "Não foi possível preparar a condução de voz.",
      fallbackToSpeechSynthesis: true
    });
  }
}

export default async function handler(req: any, res: any) {
  const rawPath = req.query?.path;
  if (typeof rawPath === "string" && rawPath.length > 0) {
    const query = { ...req.query };
    delete query.path;
    const search = new URLSearchParams(
      Object.entries(query).flatMap(([key, value]) =>
        Array.isArray(value)
          ? value.map(item => [key, String(item)] as [string, string])
          : value == null ? [] : [[key, String(value)] as [string, string]]
      )
    ).toString();
    req.url = `/api/${rawPath}${search ? `?${search}` : ""}`;
  }

  const pathname = (req.url || "").split("?")[0];
  if (pathname === "/api/health") return app(req, res);
  if (pathname === "/api/reintegration-tts") return serveReintegrationVoice(req, res);

  try {
    await initializeDb();
    await expirePaidAccessIfNeeded(req);

    if (pathname === '/api/payment/create-checkout' && req.method === 'POST') return createCheckout(req, res);
    if (pathname === '/api/payment/confirm' && req.method === 'POST') return confirmPayment(req, res);
    if (pathname === '/api/webhooks/payment' && req.method === 'POST') return paymentWebhook(req, res);

    if (pathname === "/api/admin/bootstrap" && req.method === "POST") {
      if (!allowBootstrapAttempt(req)) return res.status(429).json({ error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." });
      const configuredSecret = process.env.ADMIN_BOOTSTRAP_SECRET;
      if (!configuredSecret || configuredSecret.length < 16) return res.status(503).json({ error: "Ativação administrativa não configurada." });
      const { secret, password } = req.body || {};
      if (typeof secret !== "string" || secret !== configuredSecret) return res.status(403).json({ error: "Código de ativação inválido." });
      if (typeof password !== "string" || password.length < 10 || password.length > 100) return res.status(400).json({ error: "A senha deve ter entre 10 e 100 caracteres." });

      const db = getDb();
      const existingAdmin = db.users.find((user: any) => user.role === "admin");
      if (existingAdmin) return res.status(409).json({ error: "O administrador já foi ativado. Entre normalmente com seu login." });
      const login = "everton.admin";
      const passwordHash = await bcrypt.hash(password, 12);
      const existing = db.users.find((user: any) => user.login === login);
      if (existing) {
        existing.password = passwordHash; existing.role = "admin"; existing.plan = "pro"; existing.fullName = existing.fullName || "Everton Piceni";
        existing.profile = { ...(existing.profile || {}), name: existing.profile?.name || "Everton Piceni", plan: "pro" };
      } else {
        db.users.push({
          id: `admin-${Date.now()}`, login, password: passwordHash, fullName: "Everton Piceni", email: "", plan: "pro", role: "admin",
          profile: { name: "Everton Piceni", email: "", audioEnabled: true, bgMusicVolume: 0.5, bgMusicType: "528hz", plan: "pro" },
          progress: Array.from({ length: 21 }, (_, index) => ({ dayNumber: index + 1, completed: false }))
        });
      }
      await saveDb();
      return res.status(201).json({ success: true, login, message: "Administrador ativado com segurança." });
    }
    return app(req, res);
  } catch (error) {
    console.error("API initialization failed:", error);
    if (!res.headersSent) return res.status(503).json({ error: "Serviço temporariamente indisponível.", code: "PERSISTENCE_UNAVAILABLE" });
  }
}