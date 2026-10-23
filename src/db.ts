import fs from 'fs';
import path from 'path';
import { mergeStoredChanges } from './lib/dbMerge.js';

const DB_FILE = path.join(process.cwd(), 'database.json');
const DB_KEY = process.env.UPSTASH_DB_KEY || 'cura_integrada:database:v1';
const upstashUrlCandidates = [
  process.env.UPSTASH_REDIS_REST_KV_REST_API_URL,
  process.env.UPSTASH_REDIS_REST_REST_API_URL,
  process.env.UPSTASH_REDIS_REST_URL,
  process.env.KV_REST_API_URL,
];
const rawUpstash = upstashUrlCandidates.find((value) => value?.startsWith('http'))?.replace(/\/$/, '') || '';
const UPSTASH_URL = rawUpstash;
const UPSTASH_TOKEN =
  process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.KV_REST_API_TOKEN;
const REDIS_TIMEOUT_MS = 8000;

export interface Database {
  users: any[];
  paymentOrders?: import('./lib/paymentRoutes.js').PaymentOrder[];
}

let db: Database = { users: [] };
let initialized = false;
let persistedSnapshot = JSON.stringify(db);
let persistedRaw = '';
const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value));
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

export async function redisCommand(command: string, args: string[] = []) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;

  const suffix = args.map(encodeURIComponent).join('/');
  const bodyCommand = command.toLowerCase() === 'eval';
  const url = bodyCommand ? UPSTASH_URL : suffix ? `${UPSTASH_URL}/${command}/${suffix}` : `${UPSTASH_URL}/${command}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REDIS_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: bodyCommand ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, ...(bodyCommand ? { 'Content-Type': 'application/json' } : {}) },
      ...(bodyCommand ? { body: JSON.stringify([command, ...args]) } : {}),
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
    throw new Error('Persistent database is required in production. Configure the Upstash REST URL and token environment variables.');
  }
}

export async function initializeDb(refresh = false) {
  if (initialized && !refresh) return;
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
          persistedRaw = remote;
        } else if (remote == null) {
          db = { users: [] }; persistedRaw = '';
        } else { throw new Error('Persistent database contains an invalid schema.'); }
      } else {
        const local = readLocalDatabase();
        if (local) db = local;
      }

      persistedSnapshot = JSON.stringify(db);
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

export async function saveDb(validate?: (candidate: Database) => void): Promise<void> {
  requireProductionPersistence();
  let baseline = JSON.parse(persistedSnapshot);
  let expected = persistedRaw;
  let snapshot = copy(db);
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    const cas = "local v=redis.call('GET',KEYS[1]); if (v or '')~=ARGV[1] then return 0 end; redis.call('SET',KEYS[1],ARGV[2]); return 1";
    for (let attempt = 0; attempt < 4; attempt++) {
      validate?.(snapshot);
      const serialized = JSON.stringify(snapshot);
      const written = await redisCommand('eval', [cas, '1', DB_KEY, expected, serialized]);
      if (Number(written) === 1) {
        db = snapshot; persistedSnapshot = serialized; persistedRaw = serialized;
        return;
      }
      const remote = await redisCommand('get', [DB_KEY]);
      const current = typeof remote === 'string' ? JSON.parse(remote) : remote || { users: [] };
      snapshot = mergeStoredChanges(baseline, snapshot, current);
      baseline = current; expected = typeof remote === 'string' ? remote : remote ? JSON.stringify(remote) : '';
    }
    throw new Error('PERSISTENCE_CONFLICT');
  }
  validate?.(snapshot);
  writeLocalDatabase(snapshot);
  persistedSnapshot = JSON.stringify(snapshot);
}

export function hasPersistentDatabase() {
  return Boolean(UPSTASH_URL && UPSTASH_TOKEN);
}
