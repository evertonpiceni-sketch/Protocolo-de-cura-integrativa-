import app from "../server.js";
import { initializeDb } from "../src/db.js";

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

  // Health is deliberately independent from persistence.
  if ((req.url || "").split("?")[0] === "/api/health") {
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
