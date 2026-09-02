import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'database.json');
const DB_KEY = process.env.UPSTASH_DB_KEY || 'cura_integrada:database:v1';
const UPSTASH_URL = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '').replace(/\/$/, '');
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const REDIS_TIMEOUT_MS = 8000;

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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REDIS_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Persistent database request failed: ${response.status}`);
    }

    const payload = await response.json() as { result?: unknown; error?: string };
    if (payload.error) throw new Error(payload.error);
    return payload.result ?? null;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Persistent database request timed out after ${REDIS_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
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
          if (!parsed || !Array.isArray(parsed.users)) {
            throw new Error('Persistent database contains an invalid schema.');
          }
          db = parsed;
        }
      } else {
        const local = readLocalDatabase();
        if (local) db = local;
      }

      initialized = true;
    } catch (err) {
      console.error('Error initializing database:', err);
      if (process.env.NODE_ENV !== 'production') {
        const local = readLocalDatabase();
        if (local) {
          db = local;
          initialized = true;
          return;
        }
      }
      throw err;
    } finally {
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
