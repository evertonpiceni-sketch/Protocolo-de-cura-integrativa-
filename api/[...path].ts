import app from "../server.js";
import { initializeDb } from "../src/db.js";

// Catch-all Vercel Function for the Express API.
// The incoming request URL already contains the /api prefix; do not rewrite
// or mutate it because Express routes are registered with /api/* paths.
export default async function handler(req: any, res: any) {
  await initializeDb();
  return app(req, res);
}
