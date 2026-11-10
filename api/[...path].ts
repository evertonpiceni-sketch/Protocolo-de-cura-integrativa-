import app from "../server.js";
import { getDb, initializeDb, saveDb } from "../src/db.js";
import { acquireSharedDatabaseWriteLock } from "../src/lib/paymentRoutes.js";
import jwt from "jsonwebtoken";

const FREE_TRIAL_PLAN = "teste_vip_7d";
const FREE_TRIAL_DAYS = 7;

function getCookie(req: any, name: string) {
  const raw = typeof req.headers?.cookie === "string" ? req.headers.cookie : "";
  for (const part of raw.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return undefined;
}

function getAuthenticatedUserId(req: any): string | null {
  const secret = process.env.JWT_SECRET;
  const token = getCookie(req, "token");
  if (!secret || secret.length < 32 || !token) return null;
  try {
    const decoded = jwt.verify(token, secret) as { userId?: string };
    return typeof decoded.userId === "string" && decoded.userId ? decoded.userId : null;
  } catch {
    return null;
  }
}

async function expireTrialIfNeeded(req: any) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) return;
  const cachedUser = getDb().users.find((candidate: any) => candidate.id === userId);
  if (!cachedUser || cachedUser.profile?.subscriptionPlan !== FREE_TRIAL_PLAN) return;
  const cachedExpiry = cachedUser.profile?.subscriptionExpiresAt;
  if (!cachedExpiry || Date.now() < new Date(cachedExpiry).getTime()) return;

  const lock = await acquireSharedDatabaseWriteLock();
  if (!lock) throw new Error("Database write lock is busy while expiring VIP7.");
  let user: any;
  let previous: { plan: any; profile: any } | undefined;
  try {
    await lock.assertHeld();
    user = getDb().users.find((candidate: any) => candidate.id === userId);
    if (!user || user.profile?.subscriptionPlan !== FREE_TRIAL_PLAN) return;
    const expiresAt = user.profile?.subscriptionExpiresAt;
    if (!expiresAt || Date.now() < new Date(expiresAt).getTime()) return;

    previous = { plan: user.plan, profile: user.profile };
    user.plan = "free";
    user.profile = {
      ...user.profile,
      plan: "free",
      subscriptionPlan: undefined,
      subscriptionExpiresAt: undefined,
      proActiveSince: undefined,
    };
    await lock.assertHeld();
    await saveDb();
  } catch (error) {
    if (user && previous) { user.plan = previous.plan; user.profile = previous.profile; }
    throw error;
  } finally {
    await lock.release();
  }
}

async function redeemFreeTrial(req: any, res: any) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) return res.status(401).json({ error: "Não autorizado." });

  const { planId, price, couponCode } = req.body || {};
  if (
    planId !== FREE_TRIAL_PLAN ||
    Number(price) !== 0 ||
    String(couponCode || "").trim().toUpperCase() !== "VIP7"
  ) {
    return res.status(403).json({ error: "Degustação VIP7 inválida." });
  }

  let lock: Awaited<ReturnType<typeof acquireSharedDatabaseWriteLock>> = null;
  let user: any;
  let previous: { plan: any; profile: any } | undefined;
  try {
    lock = await acquireSharedDatabaseWriteLock();
    if (!lock) return res.status(409).json({ error: "Há outra atualização de dados em andamento. Tente novamente." });
    await lock.assertHeld();
    const db = getDb();
    user = db.users.find((candidate: any) => candidate.id === userId);
    if (!user) return res.status(401).json({ error: "Não autorizado." });
    if (user.profile?.trial7dRedeemedAt) {
      return res.status(409).json({ error: "A degustação VIP de 7 dias já foi utilizada nesta conta." });
    }
    const redeemedCount = db.users.filter((candidate: any) => Boolean(candidate.profile?.trial7dRedeemedAt)).length;
    if (redeemedCount >= 20) {
      return res.status(410).json({ error: "A campanha VIP7 atingiu o limite de 20 resgates." });
    }

    previous = { plan: user.plan, profile: user.profile };
    const activatedAt = new Date();
    const expiresAt = new Date(activatedAt.getTime() + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000);
    user.plan = "pro";
    user.profile = {
      ...user.profile,
      plan: "pro",
      subscriptionPlan: FREE_TRIAL_PLAN,
      proActiveSince: activatedAt.toISOString(),
      subscriptionExpiresAt: expiresAt.toISOString(),
      trial7dRedeemedAt: activatedAt.toISOString(),
    };

    await lock.assertHeld();
    await saveDb();
    const { password: _password, ...safeUser } = user;
    return res.json({ success: true, user: safeUser, expiresAt: expiresAt.toISOString() });
  } catch (error) {
    if (user && previous) { user.plan = previous.plan; user.profile = previous.profile; }
    console.error("Failed to persist VIP trial:", error);
    return res.status(503).json({ error: "Não foi possível ativar a degustação agora.", code: "PERSISTENCE_UNAVAILABLE" });
  } finally {
    if (lock) await lock.release();
  }
}

// Catch-all Vercel Function for the Express API.
// The incoming request URL already contains the /api prefix; do not rewrite
// or mutate it because Express routes are registered with /api/* paths.
export default async function handler(req: any, res: any) {
  // Health must remain independent from external persistence so it can
  // diagnose the function even when Redis/Upstash is unavailable.
  const requestPath = typeof req.url === "string" ? req.url.split("?")[0] : "";
  if (requestPath === "/api/health") {
    return app(req, res);
  }

  try {
    await initializeDb();
    await expireTrialIfNeeded(req);

    // Compatibility route for the existing VIP modal. Only the zero-cost
    // 7-day trial is accepted here; paid upgrades remain fail-closed.
    if (requestPath === "/api/user/upgrade" && req.method === "POST") {
      return redeemFreeTrial(req, res);
    }

    return app(req, res);
  } catch (error) {
    console.error("API initialization failed:", error);
    if (!res.headersSent) {
      return res.status(503).json({
        error: "Serviço temporariamente indisponível.",
        code: "PERSISTENCE_UNAVAILABLE"
      });
    }
  }
}
