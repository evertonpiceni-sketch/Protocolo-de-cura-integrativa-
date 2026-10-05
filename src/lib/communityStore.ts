import fs from 'node:fs';
import path from 'node:path';
import { hasPersistentDatabase, redisCommand } from '../db.js';

// Separate hashes avoid overwriting accounts, journals or another person's post.
const PREFIX = `${process.env.UPSTASH_DB_KEY || 'cura_integrada:database:v1'}:community:v1`;
const LOCAL_FILE = path.join(process.cwd(), 'community.json');
type Hash = Record<string, string>;
let local: Record<string, Hash> | undefined;
function localStore() {
  if (!local) local = fs.existsSync(LOCAL_FILE) ? JSON.parse(fs.readFileSync(LOCAL_FILE, 'utf8')) : {};
  return local!;
}
function persistLocal() { fs.writeFileSync(LOCAL_FILE, JSON.stringify(localStore())); }
export async function communityHash(name: string): Promise<Hash> {
  if (!hasPersistentDatabase()) {
    if (process.env.NODE_ENV === 'production') throw new Error('Community persistence unavailable');
    return { ...(localStore()[name] || {}) };
  }
  const result = await redisCommand('hgetall', [`${PREFIX}:${name}`]);
  if (Array.isArray(result)) {
    const hash: Hash = {};
    for (let i = 0; i < result.length; i += 2) hash[String(result[i])] = String(result[i + 1]);
    return hash;
  }
  return result && typeof result === 'object' ? result as Hash : {};
}
export async function communitySet(name: string, field: string, value: string) {
  if (hasPersistentDatabase()) await redisCommand('hset', [`${PREFIX}:${name}`, field, value]);
  else {
    if (process.env.NODE_ENV === 'production') throw new Error('Community persistence unavailable');
    (localStore()[name] ||= {})[field] = value;
    persistLocal();
  }
}
export async function communityDelete(name: string, field: string) {
  if (hasPersistentDatabase()) await redisCommand('hdel', [`${PREFIX}:${name}`, field]);
  else {
    if (process.env.NODE_ENV === 'production') throw new Error('Community persistence unavailable');
    delete (localStore()[name] ||= {})[field];
    persistLocal();
  }
}
