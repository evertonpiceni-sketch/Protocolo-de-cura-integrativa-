import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { ElevenLabsClient } from "elevenlabs";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { getDb, saveDb } from "./src/db.js";

const SESSION_COOKIE = "session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const THERAPEUTIC_DISCLAIMER = "Nota Terapêutica: O Protocolo de Cura Integrada e as sugestões de Florais de Bach e Óleos Essenciais atuam como práticas integrativas e tratamentos complementares. Eles não substituem, sob nenhuma hipótese, o diagnóstico, tratamento ou acompanhamento médico, psiquiátrico ou psicológico tradicional. Mantenha seus tratamentos de saúde ativos.";
const JWT_SECRET = process.env.JWT_SECRET;

if (process.env.NODE_ENV === "production" && (!JWT_SECRET || JWT_SECRET.length < 32)) {
  throw new Error("JWT_SECRET must be at least 32 characters in production.");
}
const signingSecret = JWT_SECRET || "development-only-secret-change-me-please";
const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, maxAge: SESSION_TTL_MS, path: "/" };

const getGemini = () => process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const getElevenLabs = () => process.env.ELEVENLABS_API_KEY ? new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY }) : null;
const audioCache = new Map<string, { buffer: Buffer; contentType: string }>();
const prepareTherapeuticSSML = (text: string) => text.replace(/\.\s/g, "... <break time=\"1.0s\" /> ").replace(/,\s/g, ", <break time=\"0.5s\" /> ");

interface AuthRequest extends Request { user?: any; userId?: string }
const publicUser = (user: any) => { const { password: _password, ...safeUser } = user; return safeUser; };
const hasPremiumAccess = (user: any) => user?.plan === "pro" && (!user.profile?.subscriptionExpiresAt || new Date(user.profile.subscriptionExpiresAt).getTime() > Date.now());

const registerSchema = z.object({ login: z.string().trim().min(3).max(50).regex(/^[a-zA-Z0-9_.-]+$/), password: z.string().min(12).max(100), fullName: z.string().trim().min(1).max(100).optional(), email: z.string().trim().email().max(100).optional().or(z.literal("")) }).strict();
const loginSchema = z.object({ login: z.string().trim().min(3).max(50), password: z.string().min(1).max(100) }).strict();
const profileSchema = z.object({ name: z.string().trim().max(100).optional(), fullName: z.string().trim().max(100).optional(), email: z.string().trim().email().max(100).optional().or(z.literal("")), audioEnabled: z.boolean().optional(), bgMusicVolume: z.number().min(0).max(1).optional(), bgMusicType: z.enum(["396hz", "528hz", "432hz", "639hz", "741hz", "852hz", "963hz", "417hz", "waves", "florestazen", "chuvaserena", "none"]).optional(), notificationsEnabled: z.boolean().optional(), reminderTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(), currentStreak: z.number().int().min(0).max(10000).optional(), longestStreak: z.number().int().min(0).max(10000).optional(), unlockedAchievements: z.array(z.string().max(100)).max(100).optional() }).passthrough();
const progressSchema = z.array(z.object({ dayNumber: z.number().int().min(1).max(21), completed: z.boolean(), completedAt: z.string().datetime().optional(), journalText: z.string().max(5000).optional(), mood: z.number().int().min(1).max(5).optional(), beforeFeeling: z.unknown().optional(), afterFeeling: z.unknown().optional() }).strict()).length(21).superRefine((items, ctx) => { if (new Set(items.map((item) => item.dayNumber)).size !== 21) ctx.addIssue({ code: "custom", message: "Cada dia deve aparecer uma única vez." }); });
const syncSchema = z.object({ profile: profileSchema.optional(), progress: progressSchema.optional() }).strict().refine((value) => value.profile || value.progress, "Envie perfil ou progresso.");
const anamneseSchema = z.object({ anamnesis: z.object({ mainComplaints: z.array(z.string().trim().min(1).max(120)).max(10).default([]), stressLevel: z.enum(["low", "moderate", "high", "baixo", "moderado", "alto"]).optional(), personalReport: z.string().trim().max(4000).optional() }).strict(), language: z.enum(["pt", "en", "es"]).default("pt") }).strict();
const ttsSchema = z.object({ text: z.string().trim().min(1).max(3000), voiceId: z.enum(["masculina", "male", "everton", "Marcus", "feminina", "female", "sofia", "Rachel"]).optional(), stability: z.number().min(0).max(1).optional(), similarityBoost: z.number().min(0).max(1).optional(), style: z.number().min(0).max(1).optional(), useSpeakerBoost: z.boolean().optional(), enableBreathingPauses: z.boolean().optional() }).strict();
const adminPlanSchema = z.object({ plan: z.enum(["free", "pro"]), subscriptionPlan: z.enum(["arcanjo_7d", "jornada_7d", "mensal", "trimestral", "semestral", "anual", "teste_vip_7d"]).optional() }).strict();
const communicationSchema = z.object({ eventType: z.enum(["day8_transition", "day15_pink_ray", "day21_completion", "daily_reminder"]), dayNumber: z.number().int().min(1).max(21).optional() }).strict();

function validate<T>(schema: z.ZodType<T>) { return (req: Request, res: Response, next: NextFunction) => { const parsed = schema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: "Dados inválidos.", details: parsed.error.issues.map((issue) => issue.path.join(".")) }); req.body = parsed.data; next(); }; }
function issueSession(res: Response, userId: string) { const token = jwt.sign({ sub: userId }, signingSecret, { expiresIn: "7d", issuer: "protocolo-cura" }); res.cookie(SESSION_COOKIE, token, cookieOptions); }
function requireAuth(req: AuthRequest, res: Response, next: NextFunction) { const token = req.cookies?.[SESSION_COOKIE]; if (!token) return res.status(401).json({ error: "Autenticação obrigatória." }); try { const decoded = jwt.verify(token, signingSecret, { issuer: "protocolo-cura" }) as jwt.JwtPayload; const user = getDb().users.find((candidate) => candidate.id === decoded.sub); if (!user) throw new Error("user not found"); req.user = user; req.userId = user.id; return next(); } catch { res.clearCookie(SESSION_COOKIE, { path: "/" }); return res.status(401).json({ error: "Sessão inválida ou expirada." }); } }
function rejectFrontendPrivileges(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === "object" && ["userId", "isAdmin", "role", "usuario_premium", "isPremium"].some((key) => key in req.body)) return res.status(403).json({ error: "Privilégios são definidos somente pelo servidor." });
  next();
}
function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) { if (req.user?.role !== "admin") return res.status(403).json({ error: "Acesso administrativo negado." }); next(); }
function requirePremium(req: AuthRequest, res: Response, next: NextFunction) { if (!hasPremiumAccess(req.user)) return res.status(403).json({ error: "Este recurso requer uma assinatura Premium ativa." }); next(); }

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);
  app.disable("x-powered-by");
  app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false, crossOriginResourcePolicy: { policy: "same-origin" } }));
  app.use((req, res, next) => { const origin = req.get("origin"); if (origin && process.env.APP_URL && origin !== process.env.APP_URL) return res.status(403).json({ error: "Origem não permitida." }); res.setHeader("Vary", "Origin"); next(); });
  app.use(express.json({ limit: "64kb" }));
  app.use(cookieParser());
  const limit = (max: number, message: string) => rateLimit({ windowMs: 15 * 60 * 1000, max, standardHeaders: "draft-7", legacyHeaders: false, message: { error: message } });
  const publicLimiter = limit(120, "Muitas requisições. Tente mais tarde.");
  const authLimiter = limit(10, "Muitas tentativas de autenticação. Tente mais tarde.");
  const aiLimiter = limit(12, "Limite de uso de IA excedido.");
  const ttsLimiter = limit(20, "Limite de síntese de voz excedido.");
  const adminLimiter = limit(30, "Limite administrativo excedido.");
  app.use("/api", publicLimiter);

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.post("/api/auth/register", authLimiter, validate(registerSchema), async (req, res) => { const { login, password, fullName, email } = req.body; const db = getDb(); if (db.users.some((user) => user.login.toLowerCase() === login.toLowerCase())) return res.status(409).json({ error: "Não foi possível criar a conta." }); const user = { id: crypto.randomUUID(), login, password: await bcrypt.hash(password, 12), fullName: fullName || login, email: email || "", plan: "free", role: "user", profile: { name: fullName || login, email: email || "", audioEnabled: true, bgMusicVolume: 0.5, bgMusicType: "528hz", plan: "free" }, progress: Array.from({ length: 21 }, (_, index) => ({ dayNumber: index + 1, completed: false })) }; db.users.push(user); saveDb(); issueSession(res, user.id); return res.status(201).json({ user: publicUser(user) }); });
  app.post("/api/auth/login", authLimiter, validate(loginSchema), async (req, res) => { const user = getDb().users.find((candidate) => candidate.login.toLowerCase() === req.body.login.toLowerCase()); if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(401).json({ error: "Credenciais inválidas." }); issueSession(res, user.id); return res.json({ user: publicUser(user) }); });
  app.post("/api/auth/logout", (req, res) => { res.clearCookie(SESSION_COOKIE, { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" }); res.status(204).end(); });
  app.get("/api/auth/me", requireAuth, (req: AuthRequest, res) => res.json({ user: publicUser(req.user) }));

  app.post("/api/user/sync", requireAuth, rejectFrontendPrivileges, validate(syncSchema), (req: AuthRequest, res) => { const user = req.user!; if (req.body.profile) user.profile = { ...user.profile, ...req.body.profile, plan: user.plan, subscriptionPlan: user.profile.subscriptionPlan, subscriptionExpiresAt: user.profile.subscriptionExpiresAt }; if (req.body.progress) user.progress = req.body.progress; saveDb(); res.json({ user: publicUser(user) }); });
  app.delete("/api/user/account", requireAuth, (req: AuthRequest, res) => { const db = getDb(); db.users = db.users.filter((user) => user.id !== req.userId); saveDb(); res.clearCookie(SESSION_COOKIE, { path: "/" }); res.status(204).end(); });

  app.get("/api/admin/status", requireAuth, requireAdmin, adminLimiter, (_req, res) => res.json({ geminiConfigured: Boolean(process.env.GEMINI_API_KEY), elevenlabsConfigured: Boolean(process.env.ELEVENLABS_API_KEY) }));
  app.get("/api/admin/users", requireAuth, requireAdmin, adminLimiter, (_req, res) => res.json({ users: getDb().users.map(publicUser) }));
  app.patch("/api/admin/users/:login/plan", requireAuth, requireAdmin, adminLimiter, validate(adminPlanSchema), (req, res) => { const user = getDb().users.find((candidate) => candidate.login === req.params.login); if (!user) return res.status(404).json({ error: "Usuário não encontrado." }); user.plan = req.body.plan; user.profile.plan = req.body.plan; if (req.body.subscriptionPlan) user.profile.subscriptionPlan = req.body.subscriptionPlan; saveDb(); res.json({ user: publicUser(user) }); });

  app.post("/api/payment/create-checkout", requireAuth, validate(z.object({ planId: z.enum(["arcanjo_7d", "jornada_7d", "mensal", "trimestral", "semestral", "anual"]) }).strict()), (_req, res) => res.status(501).json({ error: "Gateway de pagamento ainda não configurado. O acesso Premium só é liberado por webhook verificado." }));

  app.post("/api/anamnese", requireAuth, rejectFrontendPrivileges, aiLimiter, validate(anamneseSchema), handleProcessAnamnese);
  app.post("/api/anamnesis", requireAuth, rejectFrontendPrivileges, aiLimiter, validate(anamneseSchema), handleProcessAnamnese);
  async function handleProcessAnamnese(req: AuthRequest, res: Response) { const { anamnesis } = req.body; const premium = hasPremiumAccess(req.user); const ai = getGemini(); const blocked = "Para liberar a sua receita personalizada de Florais e Aromaterapia que vai atuar diretamente na raiz desse sintoma, além de destravar os 21 dias do protocolo com todas as frequências do Karuna Ki e Imara Reiki, faça o upgrade para a jornada completa na tela inicial."; try { if (!ai) return res.json({ status: "success", treatmentTitle: "Prática inicial de bem-estar", summaryDiagnosis: "Reflexão de bem-estar baseada nas informações enviadas.", therapeuticRationale: "Use este resultado como apoio ao autocuidado.", primaryChakraFocus: "Básico", planName: premium ? "Plano Pro" : "Plano Gratuito", frequencyLabel: premium ? "432Hz" : "528Hz", severityLevel: "moderado", flowerRemedy: premium ? "Olive" : "", essentialOil: premium ? "Alecrim" : "", flowerRemedyDescription: premium ? "Prática integrativa complementar." : blocked, essentialOilDescription: premium ? "Prática integrativa complementar." : "", premiumBlocked: !premium, disclaimer: THERAPEUTIC_DISCLAIMER }); const prompt = `Responda APENAS JSON. Produza uma reflexão de bem-estar, sem diagnóstico, cura ou alegação médica. Queixas: ${anamnesis.mainComplaints.join(", ")}. Estresse: ${anamnesis.stressLevel || "não informado"}. Relato: ${anamnesis.personalReport || "não informado"}.`; const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json" } }); const result = JSON.parse(response.text || "{}"); return res.json({ status: "success", ...result, flowerRemedy: premium ? result.flowerRemedy || "" : "", essentialOil: premium ? result.essentialOil || "" : "", flowerRemedyDescription: premium ? result.flowerRemedyDescription || "" : blocked, essentialOilDescription: premium ? result.essentialOilDescription || "" : "", premiumBlocked: !premium, disclaimer: THERAPEUTIC_DISCLAIMER }); } catch { return res.status(502).json({ error: "Não foi possível processar a solicitação de IA." }); } }

  app.get("/api/elevenlabs/status", requireAuth, (_req, res) => res.json({ configured: Boolean(process.env.ELEVENLABS_API_KEY), defaultVoice: "Marcus" }));
  app.get("/api/elevenlabs/voices", requireAuth, requirePremium, ttsLimiter, async (_req, res) => { const client = getElevenLabs(); if (!client) return res.json({ voices: [] }); try { const response = await client.voices.getAll(); return res.json({ voices: (response.voices || []).map((voice: any) => ({ voice_id: voice.voice_id, name: voice.name, category: voice.category || "custom", description: voice.description || "", preview_url: voice.preview_url || "" })) }); } catch { return res.status(502).json({ error: "Não foi possível carregar vozes." }); } });
  app.post("/api/elevenlabs/tts", requireAuth, requirePremium, ttsLimiter, validate(ttsSchema), async (req, res) => { const values = req.body; const cacheKey = `${values.voiceId || "Marcus"}:${values.text}`; const cached = audioCache.get(cacheKey); if (cached) { res.type(cached.contentType).set("X-Audio-Cache", "HIT"); return res.send(cached.buffer); } const client = getElevenLabs(); if (!client) return res.status(503).json({ error: "Serviço de voz indisponível.", fallbackToNativeTTS: true }); try { const voice = ["feminina", "female", "sofia", "Rachel"].includes(values.voiceId || "") ? "21m00Tcm4TlvDq8ikWAM" : process.env.ELEVENLABS_VOICE_ID || "Marcus"; const stream = await client.generate({ voice, model_id: "eleven_multilingual_v2", text: values.enableBreathingPauses === false ? values.text : prepareTherapeuticSSML(values.text), voice_settings: { stability: values.stability ?? 0.45, similarity_boost: values.similarityBoost ?? 0.75, style: values.style ?? 0.15, use_speaker_boost: values.useSpeakerBoost ?? true } }); const chunks: Buffer[] = []; for await (const chunk of stream as any) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)); const buffer = Buffer.concat(chunks); if (audioCache.size >= 50) audioCache.delete(audioCache.keys().next().value!); audioCache.set(cacheKey, { buffer, contentType: "audio/mpeg" }); return res.type("audio/mpeg").set("X-Audio-Cache", "MISS").send(buffer); } catch { return res.status(502).json({ error: "Não foi possível sintetizar o áudio.", fallbackToNativeTTS: true }); } });

  app.post("/api/communications/trigger", requireAuth, validate(communicationSchema), (req: AuthRequest, res) => { const name = req.user!.profile?.name || req.user!.fullName; const day = req.body.dayNumber || 1; res.json({ status: "success", dayNumber: day, userName: name, pushNotification: { title: "Lembrete de bem-estar", body: `${name}, reserve um momento para seu autocuidado hoje.` } }); });

  if (process.env.NODE_ENV !== "production") { const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" }); app.use(vite.middlewares); } else { const distPath = path.join(process.cwd(), "dist"); app.use(express.static(distPath)); app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html"))); }
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => { if (err?.type === "entity.too.large") return res.status(413).json({ error: "Payload excede o limite permitido." }); console.error("Unhandled server error", err?.message); return res.status(500).json({ error: "Ocorreu um erro interno no servidor." }); });
  app.listen(PORT, "0.0.0.0", () => console.log(`Servidor iniciado na porta ${PORT}`));
}
startServer();
