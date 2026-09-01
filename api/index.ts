import app from "../server";
import { initializeDb } from "../src/db.js";

export default async function handler(req: any, res: any) {
  await initializeDb();
  return app(req, res);
}
