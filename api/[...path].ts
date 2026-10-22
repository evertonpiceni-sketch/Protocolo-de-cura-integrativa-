import app from "../server.js";
import { getDb, initializeDb, saveDb } from "../src/db.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const FREE_TRIAL_PLAN = "teste_vip_7d";
const FREE_TRIAL_DAYS = 7;
const INFINITEPAY_API = "https://api.checkout.infinitepay.io";
const INFINITEPAY_HANDLE = String(process.env.INFINITEPAY_HANDLE || "evertonterapeutareiki").trim().replace(/^\$/, "");
const INFINITEPAY_API_KEY = String(process.env.INFINITEPAY_API_KEY || "").trim();

const PAID_PLANS: Record<string, { priceCents: number; days: number; description: string }> = {
  jornada_7d: { priceCents: 5990, days: 7, description: "Acesso avulso — 7 dias" },
  jornada_21d: { priceCents: 9990, days: 21, description: "Acesso avulso — 21 dias" },
  mensal: { priceCents: 3990, days: 30, description: "Plano Mensal" },
  trimestral: { priceCents: 6990, days: 90, description: "Plano Trimestral" },
  semestral: { priceCents: 9990, days: 180, description: "Plano Semestral" },
  anual: { priceCents: 15990, days: 365, description: "Plano Anual" },
};
const COUPONS: Record<string, number> = { PROMO15: 15, PROMO20: 20 };

function infinitePayHeaders() {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (INFINITEPAY_API_KEY) headers["X-Api-Key"] = INFINITEPAY_API_KEY;
  return headers;
}
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
  } catch { return null; }
}
function safeUser(user: any) { const { password: _password, ...rest } = user; return rest; }
function requestOrigin(req: any) {
  const configured = String(process.env.PUBLIC_APP_URL || process.env.APP_URL || "").replace(/\/$/, "");
  if (configured) return configured;
  const proto = String(req.headers?.["x-forwarded-proto"] || "https").split(",")[0].trim();
  const host = String(req.headers?.["x-forwarded-host"] || req.headers?.host || "").split(",")[0].trim();
  return host ? `${proto}://${host}` : "";
}
function getPaymentOrders(user: any) {
  user.profile = user.profile || {};
  if (!Array.isArray(user.profile.paymentOrders)) user.profile.paymentOrders = [];
  return user.profile.paymentOrders as any[];
}
function findOrder(orderNsu: string) {
  for (const user of getDb().users) {
    const order = Array.isArray(user.profile?.paymentOrders) ? user.profile.paymentOrders.find((candidate: any) => candidate.orderNsu === orderNsu) : undefined;
    if (order) return { user, order };
  }
  return null;
}
async function verifyInfinitePayPayment(order: any, transactionNsu: string, slug: string) {
  const response = await fetch(`${INFINITEPAY_API}/payment_check`, {
    method: "POST", headers: infinitePayHeaders(),
    body: JSON.stringify({ handle: INFINITEPAY_HANDLE, order_nsu: order.orderNsu, transaction_nsu: transactionNsu, slug }),
  });
  if (!response.ok) return null;
  const result = await response.json() as any;
  if (!result?.success || !result?.paid) return null;
  if (Number(result.amount) !== Number(order.amountCents)) return null;
  return result;
}
async function activatePaidOrder(user: any, order: any, payment: any, transactionNsu: string, slug: string) {
  if (order.status === "paid") return;
  const plan = PAID_PLANS[order.planId];
  if (!plan) throw new Error("UNKNOWN_PLAN");
  const activatedAt = new Date();
  const expiresAt = new Date(activatedAt.getTime() + plan.days * 86400000);
  order.status = "paid"; order.paidAt = activatedAt.toISOString(); order.transactionNsu = transactionNsu; order.slug = slug;
  order.captureMethod = payment.capture_method; order.receiptUrl = payment.receipt_url || order.receiptUrl;
  user.plan = "pro";
  user.profile = { ...(user.profile || {}), plan: "pro", subscriptionPlan: order.planId, subscriptionPrice: order.amountCents / 100, subscriptionPaymentMethod: payment.capture_method === "pix" ? "pix" : "card", proActiveSince: activatedAt.toISOString(), subscriptionExpiresAt: expiresAt.toISOString(), paymentOrders: user.profile?.paymentOrders || [] };
  await saveDb();
}
async function createInfinitePayCheckout(req: any, res: any) {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: "Entre na sua conta para iniciar uma compra." });
  const { productType, planId, couponCode } = req.body || {};
  if (productType !== "subscription" || !PAID_PLANS[planId]) return res.status(400).json({ error: "Plano de pagamento inválido." });
  const plan = PAID_PLANS[planId];
  const coupon = String(couponCode || "").trim().toUpperCase();
  const discount = coupon ? COUPONS[coupon] : 0;
  if (coupon && !discount) return res.status(400).json({ error: "Cupom inválido ou indisponível." });
  const amountCents = Math.round(plan.priceCents * (1 - discount / 100));
  const orderNsu = `protocolo-${user.id}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const origin = requestOrigin(req);
  if (!origin) return res.status(500).json({ error: "Não foi possível determinar a URL pública do aplicativo." });
  const order: any = { orderNsu, planId, baseAmountCents: plan.priceCents, amountCents, couponCode: coupon || undefined, status: "pending", createdAt: new Date().toISOString() };
  getPaymentOrders(user).push(order); await saveDb();
  const payload: any = {
    redirect_url: `${origin}/api/payment/return`,
    order_nsu: orderNsu,
    customer: { name: user.fullName || user.profile?.name || user.login, email: user.email || user.profile?.email || undefined, phone_number: user.profile?.phone || undefined },
    items: [{ quantity: 1, price: amountCents, description: plan.description }],
    options: {
      assured_installments: 0,
      single_payment: true,
      payment_methods_enabled: ["credit_card", "pix"]
    },
    webhook: {
      url: `${origin}/api/webhooks/infinitepay`,
      events: ["paid", "refunded", "canceled", "payment_failed"]
    }
  };
  if (!INFINITEPAY_API_KEY) payload.handle = INFINITEPAY_HANDLE;
  const response = await fetch(`${INFINITEPAY_API}/links`, {
    method: "POST", headers: infinitePayHeaders(), body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({})) as any;
  if (!response.ok || !data?.url) {
    order.status = "checkout_error"; await saveDb();
    console.error("InfinitePay checkout creation failed:", response.status, data);
    return res.status(502).json({ error: "Não foi possível iniciar o pagamento na InfinitePay." });
  }
  order.checkoutUrl = data.url; await saveDb();
  return res.json({ checkoutUrl: data.url, orderNsu, status: "pending" });
}
async function handleInfinitePayWebhook(req: any, res: any) {
  const payload = req.body || {};
  const orderNsu = String(payload.order_nsu || payload.orderNsu || "");
  const transactionNsu = String(payload.transaction_nsu || payload.transactionNsu || "");
  const slug = String(payload.invoice_slug || payload.slug || "");
  if (!orderNsu || !transactionNsu || !slug) return res.status(400).json({ success: false, message: "Dados de pagamento incompletos" });
  const found = findOrder(orderNsu);
  if (!found) return res.status(400).json({ success: false, message: "Pedido não encontrado" });
  if (found.order.status === "paid") return res.status(200).json({ success: true, message: null });
  try {
    const verified = await verifyInfinitePayPayment(found.order, transactionNsu, slug);
    if (!verified) return res.status(400).json({ success: false, message: "Pagamento não confirmado" });
    await activatePaidOrder(found.user, found.order, { ...verified, receipt_url: payload.receipt_url }, transactionNsu, slug);
    return res.status(200).json({ success: true, message: null });
  } catch (error) { console.error("InfinitePay webhook failed:", error); return res.status(400).json({ success: false, message: "Falha ao validar pagamento" }); }
}
async function handlePaymentReturn(req: any, res: any) {
  const query = req.query || {};
  const orderNsu = String(query.order_nsu || ""), transactionNsu = String(query.transaction_nsu || ""), slug = String(query.slug || "");
  const origin = requestOrigin(req) || "/";
  const found = orderNsu ? findOrder(orderNsu) : null;
  if (!found || !transactionNsu || !slug) return res.redirect(`${origin}/?payment=not_confirmed`);
  try {
    const verified = await verifyInfinitePayPayment(found.order, transactionNsu, slug);
    if (!verified) return res.redirect(`${origin}/?payment=pending`);
    await activatePaidOrder(found.user, found.order, { ...verified, receipt_url: query.receipt_url }, transactionNsu, slug);
    return res.redirect(`${origin}/?payment=approved&plan=${encodeURIComponent(found.order.planId)}`);
  } catch (error) { console.error("InfinitePay return validation failed:", error); return res.redirect(`${origin}/?payment=error`); }
}
async function expireTrialIfNeeded(req: any) {
  const user = getAuthenticatedUser(req);
  if (!user || user.profile?.subscriptionPlan !== FREE_TRIAL_PLAN) return;
  const expiresAt = user.profile?.subscriptionExpiresAt;
  if (!expiresAt || Date.now() < new Date(expiresAt).getTime()) return;
  user.plan = "free";
  user.profile = { ...user.profile, plan: "free", subscriptionPlan: undefined, subscriptionExpiresAt: undefined, proActiveSince: undefined };
  await saveDb();
}
async function redeemFreeTrial(req: any, res: any) {
  const user = getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ error: "Não autorizado." });
  const { planId, price, couponCode } = req.body || {};
  if (planId !== FREE_TRIAL_PLAN || Number(price) !== 0 || String(couponCode || "").trim().toUpperCase() !== "VIP7") return res.status(403).json({ error: "Degustação VIP7 inválida." });
  if (user.profile?.trial7dRedeemedAt) return res.status(409).json({ error: "A degustação VIP de 7 dias já foi utilizada nesta conta." });
  const redeemedCount = getDb().users.filter((candidate: any) => Boolean(candidate.profile?.trial7dRedeemedAt)).length;
  if (redeemedCount >= 20) return res.status(410).json({ error: "A campanha VIP7 atingiu o limite de 20 resgates." });
  const activatedAt = new Date(), expiresAt = new Date(activatedAt.getTime() + FREE_TRIAL_DAYS * 86400000);
  user.plan = "pro";
  user.profile = { ...user.profile, plan: "pro", subscriptionPlan: FREE_TRIAL_PLAN, proActiveSince: activatedAt.toISOString(), subscriptionExpiresAt: expiresAt.toISOString(), trial7dRedeemedAt: activatedAt.toISOString() };
  try { await saveDb(); return res.json({ success: true, user: safeUser(user), expiresAt: expiresAt.toISOString() }); }
  catch (error) { console.error("Failed to persist VIP trial:", error); return res.status(503).json({ error: "Não foi possível ativar a degustação agora.", code: "PERSISTENCE_UNAVAILABLE" }); }
}

export default async function handler(req: any, res: any) {
  const requestPath = typeof req.url === "string" ? req.url.split("?")[0] : "";
  if (requestPath === "/api/health") return app(req, res);
  try {
    await initializeDb(); await expireTrialIfNeeded(req);
    if (requestPath === "/api/user/upgrade" && req.method === "POST") return redeemFreeTrial(req, res);
    if (requestPath === "/api/payment/create-checkout" && req.method === "POST") return createInfinitePayCheckout(req, res);
    if (requestPath === "/api/webhooks/infinitepay" && req.method === "POST") return handleInfinitePayWebhook(req, res);
    if (requestPath === "/api/payment/return" && req.method === "GET") return handlePaymentReturn(req, res);
    return app(req, res);
  } catch (error) {
    console.error("API initialization failed:", error);
    if (!res.headersSent) return res.status(503).json({ error: "Serviço temporariamente indisponível.", code: "PERSISTENCE_UNAVAILABLE" });
  }
}
