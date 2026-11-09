import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('expiração e resgate VIP7 usam lock global antes de salvar o snapshot', () => {
  const source = fs.readFileSync('api/[...path].ts', 'utf8');
  assert.equal(source.split('await saveDb()').length - 1, 2);
  assert.equal(source.split('await acquireSharedDatabaseWriteLock()').length - 1, 2);
  assert.ok(source.indexOf('await lock.assertHeld();') < source.indexOf('await saveDb();'));
});
