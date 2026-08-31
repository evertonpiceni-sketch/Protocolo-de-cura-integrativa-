import app from "../server";

// Vercel catch-all function for every /api/* request.
// Express routes in server.ts are defined with the /api prefix, so preserve
// that prefix when Vercel invokes this catch-all handler.
export default function handler(req: any, res: any) {
  if (typeof req.url === "string" && !req.url.startsWith("/api")) {
    req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
  }
  return app(req, res);
}
