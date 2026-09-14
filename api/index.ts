import app from "../server.js";
import { initializeDb, getDb, saveDb } from "../src/db.js";
import { REINTEGRATION_DAYS } from "../src/data/reintegrationJourneyPublic.js";
import { ElevenLabsClient } from "elevenlabs";
import bcrypt from "bcryptjs";

const bootstrapAttempts = new Map<string, { count: number; resetAt: number }>();
const reintegrationAudioCache = new Map<string, Buffer>();
const reintegrationCues = new Set(REINTEGRATION_DAYS.flatMap(day => day.audioCues.map(cue => cue.text.trim())));

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
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  const day = Math.max(1, Math.min(21, Number(req.body?.day) || 1));
  if (!text || !reintegrationCues.has(text)) return res.status(403).json({ error: "Trecho não autorizado para esta jornada." });
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "Voz neural indisponível." });

  const firstOpening = REINTEGRATION_DAYS[day - 1]?.audioCues?.[0]?.text?.trim();
  const spokenText = text === firstOpening
    ? `${day === 1 ? "Seja bem-vindo ao primeiro dia dessa jornada maravilhosa de retorno a si." : `Que bom que você voltou. Seja bem-vindo ao dia ${day} desta jornada de retorno a si.`} ${text}`
    : text;
  const cacheKey = `reintegration_v3_${day}_${spokenText.length}_${spokenText.slice(0, 80)}`;
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
    console.error("Reintegração TTS:", error?.message || error);
    return res.status(500).json({ error: "Não foi possível preparar a condução de voz." });
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
