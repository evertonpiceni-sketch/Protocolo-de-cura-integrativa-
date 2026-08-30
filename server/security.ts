import type { Request, Response, NextFunction } from "express";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

export type AuthContext = {
  userId: string;
  email?: string;
  role: "user" | "admin";
  plan: "free" | "pro";
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server credentials are not configured");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.header("authorization");
    const bearer = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
    const accessToken = bearer || req.cookies?.["sb-access-token"] || "";
    if (!accessToken) return res.status(401).json({ error: "Autenticação necessária." });

    const supabase = getSupabaseAdmin();
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !userData.user) return res.status(401).json({ error: "Sessão inválida ou expirada." });

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, plan")
      .eq("id", userData.user.id)
      .single();
    if (profileError || !profile) return res.status(403).json({ error: "Perfil não autorizado." });

    req.auth = {
      userId: userData.user.id,
      email: userData.user.email,
      role: profile.role === "admin" ? "admin" : "user",
      plan: profile.plan === "pro" ? "pro" : "free",
    };
    next();
  } catch (error) {
    console.error("Authentication middleware error");
    return res.status(500).json({ error: "Falha na autenticação." });
  }
}

export function requirePremium(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) return res.status(401).json({ error: "Autenticação necessária." });
  if (req.auth.plan !== "pro") return res.status(402).json({ error: "Recurso disponível no plano PRO." });
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) return res.status(401).json({ error: "Autenticação necessária." });
  if (req.auth.role !== "admin") return res.status(403).json({ error: "Acesso administrativo negado." });
  next();
}

export const anamnesisSchema = z.object({
  nome: z.string().trim().min(1).max(120).optional(),
  queixas_principais: z.array(z.string().trim().max(300)).max(30).optional(),
  relato_livre: z.string().trim().max(12000).optional(),
  nivel_estresse: z.number().int().min(0).max(10).optional(),
  qualidade_sono: z.string().trim().max(80).optional(),
  sintomas_fisicos: z.array(z.string().trim().max(300)).max(30).optional(),
  estados_emocionais: z.array(z.string().trim().max(300)).max(30).optional(),
  chakras_desalinhados: z.array(z.string().trim().max(100)).max(20).optional(),
}).strict();

export function validateAnamnesis(req: Request, res: Response, next: NextFunction) {
  const result = anamnesisSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: "Dados da anamnese inválidos." });
  req.body = result.data;
  next();
}

export function sanitizeHealth(_req: Request, res: Response) {
  res.json({ status: "ok" });
}
