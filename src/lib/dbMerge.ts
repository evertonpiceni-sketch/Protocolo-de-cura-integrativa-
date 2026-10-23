/** Three-way merge prevents a stale serverless worker from overwriting payments
 * or other accounts. Conflicting edits fail instead of silently losing data. */
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
export function mergeStoredChanges(base: any, local: any, remote: any): any {
  if (same(local, base)) return remote;
  if (same(remote, base) || same(local, remote)) return local;
  if (Array.isArray(local) && Array.isArray(remote)) {
    const all = [...(Array.isArray(base) ? base : []), ...local, ...remote];
    const key = ['id', 'dayNumber', 'orderNsu'].find(k => all.length && all.every(v => v && typeof v === 'object' && v[k] != null));
    if (key) {
      const index = (array: any[]) => new Map(array.map(v => [v[key], v]));
      const b = index(Array.isArray(base) ? base : []), l = index(local), r = index(remote);
      return [...new Set([...r.keys(), ...l.keys(), ...b.keys()])].map(id => mergeStoredChanges(b.get(id), l.get(id), r.get(id))).filter(v => v !== undefined);
    }
  }
  const object = (v: any) => v != null && typeof v === 'object' && !Array.isArray(v);
  if (object(local) && object(remote) && (base === undefined || object(base))) {
    const result: any = {};
    for (const key of new Set([...Object.keys(base || {}), ...Object.keys(local), ...Object.keys(remote)])) {
      const value = mergeStoredChanges(base?.[key], local[key], remote[key]);
      if (value !== undefined) result[key] = value;
    }
    return result;
  }
  throw new Error('PERSISTENCE_CONFLICT');
}
