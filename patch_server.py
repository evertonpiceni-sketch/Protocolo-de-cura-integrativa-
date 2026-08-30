import re

with open('server.ts', 'r') as f:
    content = f.read()

# Add imports
imports = """import express from "express";
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
import { getDb, saveDb } from "./src/db.js";"""

content = re.sub(r'import express.*?\nimport \{ getDb, saveDb \} from "\./src/db\.js";', imports, content, flags=re.DOTALL)

# Add Helmet and Rate Limiter setup
setup_code = """  const app = express();
  const PORT = 3000;

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for dev compatibility (Vite WebSocket, iframes)
  }));

  // Rate Limiting
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { error: "Muitas requisições, tente novamente mais tarde." }
  });
  
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30, // 30 auth attempts per 15 min
    message: { error: "Muitas tentativas de login, tente novamente mais tarde." }
  });

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // 100 API calls per 15 min
    message: { error: "Limite de uso da API excedido." }
  });

  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use('/api/', globalLimiter);"""

content = re.sub(r'  const app = express\(\);\n  const PORT = 3000;\n\n  app\.use\(express\.json\(\{ limit: "1mb" \}\)\);.*?\n  app\.use\(cookieParser\(\)\);', setup_code, content, flags=re.DOTALL)

# Add authenticateAdmin middleware and refine authenticate
middlewares = """  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Não autorizado." });
    }
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
  };"""

content = re.sub(r'  const authenticate = \(req: any.*? \};', middlewares, content, flags=re.DOTALL)

# Add validation schemas and apply them
validation_routes = """
  // Zod Schemas
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

  // Auth Routes
  app.post("/api/auth/register", authLimiter, async (req, res) => {
    try {
      const { login, password, fullName, email } = registerSchema.parse(req.body);
      
      const db = getDb();
      if (db.users.find(u => u.login === login)) {
        return res.status(400).json({ error: "Usuário já existe." });
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Determine if it's first user to make them admin (optional, for safety we just set user)
      const role = db.users.length === 0 ? "admin" : "user";
      
      const newUser = {
        id: Date.now().toString(),
        login,
        password: hashedPassword,
        fullName: fullName || login,
        email: email || "",
        plan: "free",
        role: role,
        profile: {
          name: fullName || login,
          email: email || "",
          audioEnabled: true,
          bgMusicVolume: 0.5,
          bgMusicType: '528hz',
          plan: "free"
        },
        progress: Array.from({ length: 21 }, (_, index) => ({
          dayNumber: index + 1,
          completed: false
        }))
      };
      
      db.users.push(newUser);
      saveDb();
      
      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
      
      const { password: _, ...userWithoutPassword } = newUser;
      res.json({ user: userWithoutPassword });
    } catch (e) {
       res.status(400).json({ error: "Dados de registro inválidos." });
    }
  });

  app.post("/api/auth/login", authLimiter, async (req, res) => {
    try {
      const { login, password } = loginSchema.parse(req.body);
      const db = getDb();
      const user = db.users.find(u => u.login === login);
      
      if (!user) return res.status(400).json({ error: "Credenciais inválidas." });
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Credenciais inválidas." });
      
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (e) {
       res.status(400).json({ error: "Dados de login inválidos." });
    }
  });"""

content = re.sub(r'  // Auth Routes.*?  app\.post\("/api/auth/logout"', validation_routes + '\n\n  app.post("/api/auth/logout"', content, flags=re.DOTALL)

# Add admin status endpoint
admin_route = """  app.get("/api/admin/status", authenticate, authenticateAdmin, (_req, res) => {
    res.json({ 
      geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "SUA_CHAVE_AQUI",
      elevenlabsConfigured: !!process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY !== "SUA_CHAVE_ELEVENLABS"
    });
  });"""

content = re.sub(r'  app\.get\("/api/health".*?\}\);', '  app.get("/api/health", (_req, res) => {\n    res.json({ status: "ok" });\n  });\n\n' + admin_route, content, flags=re.DOTALL)

# Add limiter to anamnese
content = content.replace('app.post("/api/anamnese", authenticate, handleProcessAnamnese);', 'app.post("/api/anamnese", authenticate, apiLimiter, handleProcessAnamnese);')
content = content.replace('app.post("/api/anamnesis", authenticate, handleProcessAnamnese);', 'app.post("/api/anamnesis", authenticate, apiLimiter, handleProcessAnamnese);')

# Also protect elevenlabs endpoints with authenticate middleware
content = content.replace('app.get("/api/elevenlabs/voices", async (_req, res) => {', 'app.get("/api/elevenlabs/voices", authenticate, apiLimiter, async (req, res) => {')
content = content.replace('app.post("/api/elevenlabs/tts", async (req, res) => {', 'app.post("/api/elevenlabs/tts", authenticate, apiLimiter, async (req, res) => {')

with open('server.ts', 'w') as f:
    f.write(content)
