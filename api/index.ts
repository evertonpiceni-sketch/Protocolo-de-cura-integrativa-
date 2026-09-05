import app from "../server.js";
import { initializeDb, getDb, saveDb } from "../src/db.js";
import bcrypt from "bcryptjs";

const bootstrapAttempts = new Map<string, { count: number; resetAt: number }>();

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

export default async function handler(req: any, res: any) {
  // Vercel rewrites nested /api/* requests to this single function and
  // carries the original Express route in the `path` query parameter.
  const rawPath = req.query?.path;
  if (typeof rawPath === "string" && rawPath.length > 0) {
    const query = { ...req.query };
    delete query.path;
    const search = new URLSearchParams(
      Object.entries(query).flatMap(([key, value]) =>
        Array.isArray(value)
          ? value.map(item => [key, String(item)] as [string, string])
          : value == null
            ? []
            : [[key, String(value)] as [string, string]]
      )
    ).toString();
    req.url = `/api/${rawPath}${search ? `?${search}` : ""}`;
  }

  const pathname = (req.url || "").split("?")[0];

  // Health is deliberately independent from persistence.
  if (pathname === "/api/health") {
    return app(req, res);
  }

  try {
    await initializeDb();

    // One-time administrator activation. The bootstrap secret is never stored in the DB
    // and the chosen login password is persisted only as a bcrypt hash.
    if (pathname === "/api/admin/bootstrap" && req.method === "POST") {
      if (!allowBootstrapAttempt(req)) {
        return res.status(429).json({ error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." });
      }

      const configuredSecret = process.env.ADMIN_BOOTSTRAP_SECRET;
      if (!configuredSecret || configuredSecret.length < 16) {
        return res.status(503).json({ error: "Ativação administrativa não configurada." });
      }

      const { secret, password } = req.body || {};
      if (typeof secret !== "string" || secret !== configuredSecret) {
        return res.status(403).json({ error: "Código de ativação inválido." });
      }
      if (typeof password !== "string" || password.length < 10 || password.length > 100) {
        return res.status(400).json({ error: "A senha deve ter entre 10 e 100 caracteres." });
      }

      const db = getDb();
      const existingAdmin = db.users.find((user: any) => user.role === "admin");
      if (existingAdmin) {
        return res.status(409).json({ error: "O administrador já foi ativado. Entre normalmente com seu login." });
      }

      const login = "everton.admin";
      const passwordHash = await bcrypt.hash(password, 12);
      const existing = db.users.find((user: any) => user.login === login);

      if (existing) {
        existing.password = passwordHash;
        existing.role = "admin";
        existing.plan = "pro";
        existing.fullName = existing.fullName || "Everton Piceni";
        existing.profile = { ...(existing.profile || {}), name: existing.profile?.name || "Everton Piceni", plan: "pro" };
      } else {
        db.users.push({
          id: `admin-${Date.now()}`,
          login,
          password: passwordHash,
          fullName: "Everton Piceni",
          email: "",
          plan: "pro",
          role: "admin",
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
    if (!res.headersSent) {
      return res.status(503).json({
        error: "Serviço temporariamente indisponível.",
        code: "PERSISTENCE_UNAVAILABLE"
      });
    }
  }
}
