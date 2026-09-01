import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'database.json');
const DB_KEY = process.env.UPSTASH_DB_KEY || 'cura_integrada:database:v1';
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export interface Database {
  users: any[];
}

let db: Database = { users: [] };
let initialized = false;
let initializationPromise: Promise<void> | null = null;

function readLocalDatabase(): Database | null {
  if (!fs.existsSync(DB_FILE)) return null;
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (parsed && Array.isArray(parsed.users)) return parsed;
  } catch (err) {
    console.error('Error reading local database:', err);
  }
  return null;
}

function writeLocalDatabase(snapshot: Database) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(snapshot, null, 2));
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Local database could not be written:', err);
    }
  }
}

async function redisCommand(command: string, args: string[] = []) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  const suffix = args.map(encodeURIComponent).join('/');
  const url = suffix ? `${UPSTASH_URL}/${command}/${suffix}` : `${UPSTASH_URL}/${command}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  if (!response.ok) {
    throw new Error(`Persistent database request failed: ${response.status}`);
  }
  const payload = await response.json() as { result?: unknown; error?: string };
  if (payload.error) throw new Error(payload.error);
  return payload.result ?? null;
}

function requireProductionPersistence() {
  if (process.env.NODE_ENV === 'production' && (!UPSTASH_URL || !UPSTASH_TOKEN)) {
    throw new Error('Persistent database is required in production. Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL/KV_REST_API_TOKEN).');
  }
}

export async function initializeDb() {
  if (initialized) return;
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    try {
      requireProductionPersistence();
      if (UPSTASH_URL && UPSTASH_TOKEN) {
        const remote = await redisCommand('get', [DB_KEY]);
        if (typeof remote === 'string' && remote.trim()) {
          const parsed = JSON.parse(remote);
          if (parsed && Array.isArray(parsed.users)) db = parsed;
        }
      } else {
        const local = readLocalDatabase();
        if (local) db = local;
      }
    } catch (err) {
      console.error('Error initializing database:', err);
      if (process.env.NODE_ENV === 'production') throw err;
      const local = readLocalDatabase();
      if (local) db = local;
    } finally {
      initialized = true;
      initializationPromise = null;
    }
  })();

  return initializationPromise;
}

export function getDb() {
  return db;
}

export async function saveDb(): Promise<void> {
  requireProductionPersistence();
  const snapshot = JSON.stringify(db);
  if (process.env.NODE_ENV !== 'production') writeLocalDatabase(db);
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    await redisCommand('set', [DB_KEY, snapshot]);
  }
}

export function hasPersistentDatabase() {
  return Boolean(UPSTASH_URL && UPSTASH_TOKEN);
}
