import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('todos os escritores do snapshot completo usam o mesmo lock Redis', () => {
  const paymentRoutes = fs.readFileSync('src/lib/paymentRoutes.ts', 'utf8');
  const helperStart = paymentRoutes.indexOf('export async function acquireSharedDatabaseWriteLock');
  const helperEnd = paymentRoutes.indexOf('\nexport function paymentRoutes', helperStart);
  assert.ok(helperStart >= 0 && helperEnd > helperStart, 'helper de lock compartilhado deve existir');
  const helper = paymentRoutes.slice(helperStart, helperEnd);
  assert.ok(helper.indexOf('await lock.assertHeld()') < helper.indexOf('await refreshDbFromPersistentStorage()'));
  assert.ok(helper.lastIndexOf('await lock.assertHeld()') > helper.indexOf('await refreshDbFromPersistentStorage()'));
  assert.equal(paymentRoutes.split('await acquireSharedDatabaseWriteLock()').length - 1, 3, 'checkout, confirmação e VIP7 devem usar o helper');

  const writers = [
    { path: 'server.ts', writes: 3, label: 'admin plan, cadastro e sincronização de perfil' },
    { path: 'api/index.ts', writes: 1, label: 'bootstrap administrativo' },
    { path: 'api/[...path].ts', writes: 2, label: 'expiração e resgate VIP7 no catch-all Vercel' }
  ];
  for (const writer of writers) {
    const source = fs.readFileSync(writer.path, 'utf8');
    assert.equal(source.split('await saveDb()').length - 1, writer.writes, writer.path + ': contagem de persistências esperada (' + writer.label + ')');
    assert.equal(source.split('await acquireSharedDatabaseWriteLock()').length - 1, writer.writes, writer.path + ': cada persistência deve adquirir o lock compartilhado (' + writer.label + ')');
  }
});
