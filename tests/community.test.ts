import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { communityTextError, communityInitials } from '../src/lib/communityPolicy';

test('community blocks contact information and generates initials without exposing identity', () => {
  for (const text of ['Meu contato é teste@example.com', 'Ligue (51) 99999-9999', 'Meu perfil @nomepublico', 'Veja https://example.com']) assert.ok(communityTextError(text));
  assert.equal(communityTextError('Hoje consegui respirar com mais calma.'), null);
  assert.match(communityInitials('user-123'), /^[A-Z]\.[A-Z]\.$/);
  assert.equal(communityInitials('user-123'), communityInitials('user-123'));
});

test('real publication requires consent, protects pending text, enforces moderation and ownership', async () => {
  const originalCwd = process.cwd();
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'entre-nos-test-'));
  process.env.VERCEL = '1'; process.env.NODE_ENV = 'test';
  for (const key of Object.keys(process.env)) if (/UPSTASH|KV_REST|JWT_SECRET/.test(key)) delete process.env[key];
  process.chdir(folder);
  const { initializeDb, getDb } = await import('../src/db');
  await initializeDb();
  const { createApp } = await import('../server');
  const server = createApp().listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const base = `http://127.0.0.1:${address.port}`;
  async function call(route: string, method = 'GET', body?: unknown, cookie?: string) {
    return fetch(base + route, { method, headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  }
  async function account(login: string) {
    const response = await call('/api/auth/register', 'POST', { login, password: 'test-only-password', fullName: 'Nome Privado', email: `${login}@example.test` });
    assert.equal(response.status, 200);
    return response.headers.get('set-cookie')!.split(';')[0];
  }
  try {
    assert.equal((await call('/api/community')).status, 401);
    const owner = await account('autor-teste'), other = await account('leitor-teste'), admin = await account('moderador-teste');
    getDb().users.find(user => user.login === 'moderador-teste').role = 'admin';
    assert.equal((await call('/api/community', 'POST', { text: 'Hoje consegui respirar com calma.' }, owner)).status, 400);
    assert.equal((await call('/api/community', 'POST', { text: 'Me ligue 51999999999', consent: true }, owner)).status, 400);
    const response = await call('/api/community', 'POST', { text: 'Hoje consegui respirar com calma.', consent: true }, owner);
    assert.equal(response.status, 201);
    const { id } = await response.json();
    assert.equal((await (await call('/api/community', 'GET', undefined, other)).json()).posts.length, 0);
    const ownFeed = await (await call('/api/community', 'GET', undefined, owner)).json();
    assert.equal(ownFeed.posts[0].status, 'pending');
    assert.equal(ownFeed.posts[0].authorId, undefined);
    assert.equal(ownFeed.posts[0].fullName, undefined);
    assert.equal((await call(`/api/community/${id}/moderate`, 'POST', { status: 'approved' }, other)).status, 403);
    assert.equal((await call(`/api/community/${id}`, 'DELETE', undefined, other)).status, 403);
    assert.equal((await call(`/api/community/${id}/moderate`, 'POST', { status: 'approved' }, admin)).status, 200);
    assert.equal((await (await call('/api/community', 'GET', undefined, other)).json()).posts.length, 1);
    await call(`/api/community/${id}/like`, 'POST', { liked: true }, other);
    await call(`/api/community/${id}/like`, 'POST', { liked: true }, other);
    assert.equal((await (await call('/api/community', 'GET', undefined, owner)).json()).posts[0].likes, 1);
    assert.equal((await call(`/api/community/${id}/report`, 'POST', { reason: 'Precisa de revisão' }, other)).status, 200);
    assert.equal((await (await call('/api/community', 'GET', undefined, other)).json()).posts.length, 0);
    const review = await (await call('/api/community', 'GET', undefined, admin)).json();
    assert.deepEqual(review.posts[0].reports, ['Precisa de revisão']);
    assert.equal((await call(`/api/community/${id}`, 'DELETE', undefined, owner)).status, 200);
    assert.equal((await (await call('/api/community', 'GET', undefined, admin)).json()).posts.length, 0);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
    process.chdir(originalCwd); fs.rmSync(folder, { recursive: true, force: true });
  }
});
