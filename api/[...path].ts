import app from "../server.js";
import { initializeDb } from "../src/db.js";

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
