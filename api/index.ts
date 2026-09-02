import app from "../server.js";
import { initializeDb } from "../src/db.js";

export default async function handler(req: any, res: any) {
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
    return;
  }
}
