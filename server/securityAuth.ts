import type { NextFunction, Request, Response } from "express";
import { createClient, type User } from "@supabase/supabase-js";

export type AppRole = "user" | "admin";
export type AppPlan = "free" | "pro";

export interface AuthenticatedIdentity {
  id: string;
  email: string | null;
  role: AppRole;
  plan: AppPlan;
}

export interface AuthenticatedRequest extends Request {
  identity?: AuthenticatedIdentity;
  authUser?: User;
}

function getSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase server credentials are not configured");
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getBearerToken(req: Request): string | null {
  const header = req.header("authorization");
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

export async function authenticateRequest(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: "Autenticação necessária." });
    }

    const supabase = getSupabaseAdminClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ error: "Sessão inválida ou expirada." });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, plan")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({ error: "Perfil de usuário não configurado." });
    }

    const role: AppRole = profile.role === "admin" ? "admin" : "user";
    const plan: AppPlan = profile.plan === "pro" ? "pro" : "free";

    req.authUser = user;
    req.identity = { id: user.id, email: user.email ?? null, role, plan };
    return next();
  } catch (error) {
    console.error("Authentication middleware error", error);
    return res.status(500).json({ error: "Falha ao validar a sessão." });
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.identity?.role !== "admin") {
    return res.status(403).json({ error: "Acesso administrativo não autorizado." });
  }
  return next();
}

export function requirePremium(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.identity?.plan !== "pro") {
    return res.status(402).json({ error: "Este recurso exige o plano Premium." });
  }
  return next();
}
