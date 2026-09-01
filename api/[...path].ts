import app from "../server";

// Catch-all Vercel Function for the Express API.
// The incoming request URL already contains the /api prefix; do not rewrite
// or mutate it because Express routes are registered with /api/* paths.
export default function handler(req: any, res: any) {
  return app(req, res);
}
