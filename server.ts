import dotenv from "dotenv";
dotenv.config({ override: true });
import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { ElevenLabsClient } from "elevenlabs";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { getDb, saveDb } from "./src/db.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be configured with at least 32 characters.");
}

const getGemini = () => {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5) {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return null;
};

const getElevenLabs = () => {
  if (process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY.length > 5) {
    return new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
  }
  return null;
};

const audioCache = new Map<string, { buffer: Buffer, contentType: string }>();

const prepareTherapeuticSSML = (text: string) => {
  return text
    .replace(/\.\s/g, '... <break time="1.0s" /> ')
    .replace(/,\s/g, ', <break time="0.5s" /> ');
};

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false
  }));

  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    validate: { xForwardedForHeader: false, trustProxy: false, forwardedHeader: false },
    message: { error: "Muitas requisições, tente novamente mais tarde." }
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    validate: { xForwardedForHeader: false, trustProxy: false, forwardedHeader: false },
    message: { error: "Muitas tentativas de login, tente novamente mais tarde." }
  });

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    validate: { xForwardedForHeader: false, trustProxy: false, forwardedHeader: false },
    message: { error: "Limite de uso da API excedido." }
  });

  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use('/api/', globalLimiter);

  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Não autorizado." });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.userId = decoded.userId;
      const db = getDb();
      const user = db.users.find(u => u.id === req.userId);
      if (!user) {
        res.clearCookie("token");
        return res.status(401).json({ error: "Usuário não encontrado." });
      }
      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ error: "Sessão inválida ou expirada." });
    }
  };

  const authenticateAdmin = (req: any, res: any, next: any) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: "Acesso administrativo negado." });
    }
    next();
  };

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/admin/status", authenticate, authenticateAdmin, (_req, res) => {
    res.json({
      geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5,
      elevenlabsConfigured: !!process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY.length > 5
    });
  });

  app.get("/api/admin/users", authenticate, authenticateAdmin, (_req, res) => {
    const db = getDb();
    const usersList = db.users.map(u => ({
      login: u.login,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      plan: u.plan,
      profile: u.profile,
      progress: u.progress
    }));
    res.json({ users: usersList });
  });

  app.post("/api/admin/users/:login/plan", authenticate, authenticateAdmin, async (req: any, res: any) => {
    const db = getDb();
    const { login } = req.params;
    const { plan, subscriptionPlan } = req.body;
    const user = db.users.find(u => u.login === login);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    user.plan = plan;
    user.profile.plan = plan;
    if (subscriptionPlan) user.profile.subscriptionPlan = subscriptionPlan;
    try {
      await saveDb();
      return res.json({ success: true });
    } catch (err) {
      console.error("Error saving admin plan change:", err);
      return res.status(503).json({ error: "Não foi possível salvar a alteração.", code: "PERSISTENCE_UNAVAILABLE" });
    }
  });

  const registerSchema = z.object({
    login: z.string().min(3).max(50),
    password: z.string().min(6).max(100),
    fullName: z.string().max(100).optional(),
    email: z.string().email().max(100).optional().or(z.literal(''))
  });

  const loginSchema = z.object({
    login: z.string().min(3).max(50),
    password: z.string().min(6).max(100)
  });

  app.post("/api/auth/register", authLimiter, async (req, res) => {
    try {
      const { login, password, fullName, email } = registerSchema.parse(req.body);
      const normalizedLogin = login.trim().toLowerCase();
      const db = getDb();
      if (db.users.find(u => u.login === normalizedLogin)) {
        return res.status(400).json({ error: "Usuário já existe." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = {
        id: Date.now().toString(),
        login: normalizedLogin,
        password: hashedPassword,
        fullName: fullName || normalizedLogin,
        email: email || "",
        plan: "free",
        role: "user",
        profile: {
          name: fullName || normalizedLogin,
          email: email || "",
          audioEnabled: true,
          bgMusicVolume: 0.5,
          bgMusicType: '528hz',
          plan: "free"
        },
        progress: Array.from({ length: 21 }, (_, index) => ({ dayNumber: index + 1, completed: false }))
      };

      db.users.push(newUser);

      // Registration must wait for persistence. A rejected Redis request
      // must become a controlled HTTP response instead of an unhandled
      // serverless rejection after the response is sent.
      await saveDb();

      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
      const { password: _, ...userWithoutPassword } = newUser;
      return res.json({ user: userWithoutPassword });
    } catch (e) {
      console.error("Registration failed:", e);
      if (res.headersSent) return;
      if (e instanceof z.ZodError) {
        return res.status(400).json({ error: "Dados de registro inválidos." });
      }
      return res.status(503).json({ error: "Não foi possível concluir o cadastro agora.", code: "PERSISTENCE_UNAVAILABLE" });
    }
  });

  app.post("/api/auth/login", authLimiter, async (req, res) => {
    try {
      const { login, password } = loginSchema.parse(req.body);
      const normalizedLogin = login.trim().toLowerCase();
      const db = getDb();
      const user = db.users.find(u => u.login === normalizedLogin);
      if (!user) return res.status(400).json({ error: "Credenciais inválidas." });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Credenciais inválidas." });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
      const { password: _, ...userWithoutPassword } = user;
      return res.json({ user: userWithoutPassword });
    } catch (e) {
      return res.status(400).json({ error: "Dados de login inválidos." });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
  });

  app.get("/api/auth/me", authenticate, (req: any, res: any) => {
    const db = getDb();
    const user = db.users.find(u => u.id === req.userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  app.post("/api/user/sync", authenticate, async (req: any, res: any) => {
    const db = getDb();
    const userIndex = db.users.findIndex(u => u.id === req.userId);
    if (userIndex === -1) return res.status(404).json({ error: "Usuário não encontrado." });
    const { profile, progress } = req.body;
    if (profile) {
      db.users[userIndex].profile = {
        ...db.users[userIndex].profile,
        ...profile,
        plan: db.users[userIndex].plan,
        subscriptionPlan: db.users[userIndex].profile.subscriptionPlan,
        subscriptionExpiresAt: db.users[userIndex].profile.subscriptionExpiresAt,
        proActiveSince: db.users[userIndex].profile.proActiveSince,
      };
    }
    if (progress) db.users[userIndex].progress = progress;
    try {
      await saveDb();
      return res.json({ success: true });
    } catch (err) {
      console.error("Error syncing user:", err);
      return res.status(503).json({ error: "Não foi possível salvar o perfil agora.", code: "PERSISTENCE_UNAVAILABLE" });
    }
  });

  app.post("/api/payment/create-checkout", authenticate, apiLimiter, (_req: any, res: any) => {
    return res.status(503).json({ error: "Pagamento ainda não está configurado." });
  });

  app.post("/api/webhooks/payment", express.raw({ type: "application/json" }), (_req: any, res: any) => {
    return res.status(503).json({ error: "Webhook de pagamento ainda não está configurado." });
  });

  app.post("/api/anamnese", authenticate, apiLimiter, handleProcessAnamnese);
  app.post("/api/anamnesis", authenticate, apiLimiter, handleProcessAnamnese);

  async function handleProcessAnamnese(req: any, res: any) {
    try {
      const db = getDb();
      const user = db.users.find(u => u.id === req.userId);
      if (!user) return res.status(401).json({ error: "Não autorizado" });
      const { anamnesis } = req.body;
      const isPremium = user.plan === "pro";
      if (!anamnesis) return res.status(400).json({ error: "Dados de anamnese ausentes." });
      const ai = getGemini();
      if (!ai) {
        return res.json({
          status: "success",
          treatmentTitle: "Reequilíbrio Inicial",
          summaryDiagnosis: "Análise baseada nos dados fornecidos.",
          therapeuticRationale: "Aguardando conexão com IA.",
          primaryChakraFocus: "Básico",
          planName: isPremium ? "Plano PRO 21 Dias" : "Plano Gratuito 7 Dias",
          frequencyLabel: "528Hz",
          severityLevel: "moderado",
          flowerRemedy: isPremium ? "Rescue Remedy" : "",
          essentialOil: isPremium ? "Lavanda" : "",
          flowerRemedyDescription: "Harmonização inicial.",
          essentialOilDescription: "Calmante.",
          premiumBlocked: !isPremium,
          disclaimer: "Nota Terapêutica: As sugestões atuam como práticas integrativas. Não substituem tratamento médico."
        });
      }
      const prompt = `Analise os dados de anamnese e forneça recomendações integrativas e de bem-estar. Não faça diagnósticos médicos, e não prescreva tratamentos médicos.
      Apresente como práticas de relaxamento e autocuidado.
      Queixas: ${anamnesis.mainComplaints?.join(', ')}
      Estresse: ${anamnesis.stressLevel}
      Relato: ${anamnesis.personalReport}
      Premium: ${isPremium}
      Retorne APENAS um JSON válido com os seguintes campos:
      treatmentTitle, summaryDiagnosis, therapeuticRationale, primaryChakraFocus, planName, frequencyLabel, severityLevel (baixo, moderado, alto), flowerRemedy (apenas se Premium, senão string vazia), essentialOil (apenas se Premium), flowerRemedyDescription, essentialOilDescription.`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text;
      let parsed: any = {};
      try {
        parsed = JSON.parse(text || "{}");
      } catch {
        return res.status(500).json({ error: "Erro ao processar dados da IA." });
      }
      if (!isPremium) {
        parsed = { ...parsed, flowerRemedy: "", essentialOil: "", premiumBlocked: true };
      } else {
        parsed = { ...parsed, premiumBlocked: false };
      }
      const disclaimer = "Nota Terapêutica: O Protocolo de Cura Integrada e as sugestões de Florais de Bach e Óleos Essenciais atuam como práticas integrativas e de bem-estar. Eles não substituem, sob nenhuma hipótese, o diagnóstico, tratamento ou acompanhamento médico, psiquiátrico ou psicológico tradicional. Mantenha seus tratamentos de saúde ativos.";
      return res.json({ status: "success", ...parsed, disclaimer });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro interno ao processar anamnese." });
    }
  }

  app.post("/api/communications/trigger", authenticate, (req: any, res: any) => {
    const { eventType, dayNumber, userName, phone } = req.body;
    let pushTitle = "Protocolo de Cura Integrada";
    let pushBody = "Notificação de sistema";
    let subject = "Mensagem do Protocolo";
    let message = "Olá!";
    if (eventType === "day8_transition") {
      pushTitle = "✨ O Karuna Ki te chama";
      pushBody = "Iniciamos hoje o processo de transmutação celular mais profundo. Venha ancorar seu símbolo Halu.";
      subject = "✨ Dia 8: Mergulho Profundo Iniciado";
      message = `Olá ${userName},\n\nHoje é um marco sagrado no seu tratamento. Iniciamos o uso das frequências avançadas. Seja gentil com você.\n\nCom carinho,\nÉverton Rodrigo Piceni`;
    } else if (eventType === "day15_pink_ray") {
      pushTitle = "🌸 O Raio Rosa te Acolhe";
      pushBody = "Você não está só. Sinta a frequência do Amor Incondicional hoje.";
      subject = "🌸 Dia 15: O Abraço da Cura";
      message = `Olá ${userName},\n\nRespire fundo. A partir de hoje o foco é acolhimento e amor incondicional para as dores que já foram curadas.\n\nCom amor,\nÉverton Rodrigo Piceni`;
    } else if (eventType === "day21_completion") {
      pushTitle = "👑 Parabéns, Mestre!";
      pushBody = "Seu Protocolo foi concluído. Acesse para selar sua energia.";
      subject = "👑 Celebração de Conclusão: Você conseguiu!";
      message = `Olá ${userName},\n\n👑 Você assumiu o seu Trono: Parabéns pela conclusão do seu Protocolo de Cura!\n\nCom a benção e o empoderamento de Ganesha, esse tratamento está totalmente selado e blindado no seu DNA cósmico.\n\nVocê é livre para ser feliz. Você é cura. Você é amor. Você está em paz.\n\nCom profunda gratidão,\nÉverton Rodrigo Piceni`;
    } else {
      pushTitle = `✨ Lembrete Diário: Dia ${dayNumber}`;
      pushBody = `${userName}, seu momento sagrado de alinhamento vibracional está pronto hoje.`;
      subject = `✨ Dia ${dayNumber} do Protocolo de Cura Integrada`;
      message = `Olá ${userName},\n\nSeu momento de autocuidado, paz e meditação do Dia ${dayNumber} espera por você. Reserve alguns minutos para alinhar sua energia e silenciar a mente.\n\nCom carinho,\nÉverton Rodrigo Piceni`;
    }
    const cleanPhone = String(phone || "").replace(/\D/g, "");
    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = cleanPhone ? `https://wa.me/55${cleanPhone.startsWith("55") ? cleanPhone.slice(2) : cleanPhone}?text=${encodedMsg}` : `https://wa.me/?text=${encodedMsg}`;
    return res.json({
      status: "success",
      dayNumber,
      userName,
      pushNotification: { title: pushTitle, body: pushBody },
      email: { subject, body: message },
      whatsapp: { phone: cleanPhone, message, url: whatsappUrl }
    });
  });

  app.get("/api/elevenlabs/status", (_req, res) => {
    const hasKey = !!process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY.length > 5;
    res.json({
      configured: hasKey,
      defaultVoice: process.env.ELEVENLABS_VOICE_ID || "Marcus",
      model: "eleven_multilingual_v2",
      stability: 0.45,
      similarityBoost: 0.75
    });
  });

  app.get("/api/elevenlabs/voices", authenticate, apiLimiter, async (_req, res) => {
    const client = getElevenLabs();
    const defaultCuratedVoices = [
      { voice_id: "Marcus", name: "Marcus (Éverton Piceni Style)", category: "cloned/curated", description: "Voz masculina profunda, acolhedora, serena e terapêutica.", preview_url: "" },
      { voice_id: "Rachel", name: "Rachel (Acolhimento & Paz)", category: "premade", description: "Voz feminina suave, doce e maternal.", preview_url: "" }
    ];
    if (!client) return res.json({ voices: defaultCuratedVoices, isCustomApiKey: false });
    try {
      const response = await client.voices.getAll();
      const apiVoices = (response.voices || []).map((v: any) => ({
        voice_id: v.voice_id,
        name: v.name,
        category: v.category || "custom",
        description: v.description || (v.labels ? Object.values(v.labels).join(", ") : "Voz ElevenLabs"),
        preview_url: v.preview_url || ""
      }));
      const allVoices = [...defaultCuratedVoices];
      apiVoices.forEach((av: any) => {
        if (!allVoices.some(v => v.voice_id === av.voice_id)) allVoices.push(av);
      });
      return res.json({ voices: allVoices, isCustomApiKey: true });
    } catch (err: any) {
      console.warn("ElevenLabs voices fetch warning:", err?.message || err);
      return res.json({ voices: defaultCuratedVoices, isCustomApiKey: true });
    }
  });

  app.post("/api/elevenlabs/tts", authenticate, apiLimiter, async (req, res) => {
    try {
      const { text, voiceId = process.env.ELEVENLABS_VOICE_ID || "Marcus", stability = 0.45, similarityBoost = 0.75, style = 0.15, useSpeakerBoost = true, enableBreathingPauses = true, cacheKey } = req.body;
      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({ error: "Texto para sintetizar é obrigatório." });
      }
      const effectiveCacheKey = cacheKey || `${voiceId}_${stability}_${text.slice(0, 100)}_${text.length}`;
      if (audioCache.has(effectiveCacheKey)) {
        const cached = audioCache.get(effectiveCacheKey)!;
        res.setHeader("Content-Type", cached.contentType);
        res.setHeader("X-Audio-Cache", "HIT");
        return res.send(cached.buffer);
      }
      const client = getElevenLabs();
      if (!client) {
        return res.status(503).json({ error: "ELEVENLABS_API_KEY não configurada no servidor.", fallbackToNativeTTS: true, message: "Configure sua chave." });
      }
      const formattedText = enableBreathingPauses ? prepareTherapeuticSSML(text) : text;
      let resolvedVoiceId = voiceId;
      if (voiceId === 'masculina' || voiceId === 'male' || voiceId === 'everton' || voiceId === 'Marcus') {
        resolvedVoiceId = process.env.ELEVENLABS_VOICE_ID || "Marcus";
      } else if (voiceId === 'feminina' || voiceId === 'female' || voiceId === 'sofia' || voiceId === 'Rachel') {
        resolvedVoiceId = "21m00Tcm4TlvDq8ikWAM";
      }
      const audioStream = await client.generate({
        voice: resolvedVoiceId,
        model_id: "eleven_multilingual_v2",
        text: formattedText,
        voice_settings: { stability: Number(stability), similarity_boost: Number(similarityBoost), style: Number(style), use_speaker_boost: useSpeakerBoost }
      });
      const chunks: Buffer[] = [];
      for await (const chunk of audioStream as any) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      const audioBuffer = Buffer.concat(chunks);
      if (audioCache.size > 50) {
        const firstKey = audioCache.keys().next().value;
        if (firstKey) audioCache.delete(firstKey);
      }
      audioCache.set(effectiveCacheKey, { buffer: audioBuffer, contentType: "audio/mpeg" });
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Content-Length", audioBuffer.length);
      res.setHeader("X-Audio-Cache", "MISS");
      return res.send(audioBuffer);
    } catch (error: any) {
      console.error("Erro na geração de áudio ElevenLabs:", error);
      return res.status(500).json({ error: error.message || "Falha ao sintetizar áudio", fallbackToNativeTTS: true });
    }
  });

  app.post("/api/logs/security", express.json(), (req: any, res: any) => {
    console.warn("[SECURITY LOG]", new Date().toISOString(), req.body);
    res.json({ success: true });
  });

  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error("Erro interno:", err.message);
    res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
  });

  return app;
}

const app = createApp();

if (process.env.VERCEL !== "1") {
  const PORT = Number(process.env.PORT || 3000);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✨ Servidor do Protocolo de Cura Integrada rodando em http://localhost:${PORT}`);
  });
}

export default app;
