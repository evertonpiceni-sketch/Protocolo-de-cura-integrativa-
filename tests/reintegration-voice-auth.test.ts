import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'node:fs';
import { getAuthenticatedUserId } from '../src/lib/requestAuth.js';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const TEST_SECRET = 'natural-sereno-test-secret-with-at-least-32-characters';

function withJwtSecret<T>(run: () => T): T {
  const previous = process.env.JWT_SECRET;
  process.env.JWT_SECRET = TEST_SECRET;
  try {
    return run();
  } finally {
    if (previous === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previous;
  }
}

test('request auth rejects missing, malformed and weak session credentials', () => {
  withJwtSecret(() => {
    assert.equal(getAuthenticatedUserId({ headers: {} }), null);
    assert.equal(getAuthenticatedUserId({ headers: { cookie: 'other=value' } }), null);
    assert.equal(getAuthenticatedUserId({ headers: { cookie: 'token=%E0%A4%A' } }), null);
    assert.equal(getAuthenticatedUserId({ headers: { cookie: 'token=not-a-jwt' } }), null);
  });

  const previous = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'short';
  try {
    assert.equal(getAuthenticatedUserId({ headers: { cookie: 'token=anything' } }), null);
  } finally {
    if (previous === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previous;
  }
});

test('request auth accepts only a valid signed HttpOnly session token with userId', () => {
  withJwtSecret(() => {
    const token = jwt.sign({ userId: 'account-123' }, TEST_SECRET, { expiresIn: '1h' });
    assert.equal(
      getAuthenticatedUserId({ headers: { cookie: `other=value; token=${encodeURIComponent(token)}` } }),
      'account-123'
    );

    const noUserId = jwt.sign({ role: 'user' }, TEST_SECRET, { expiresIn: '1h' });
    assert.equal(getAuthenticatedUserId({ headers: { cookie: `token=${noUserId}` } }), null);

    const expired = jwt.sign({ userId: 'account-123' }, TEST_SECRET, { expiresIn: -1 });
    assert.equal(getAuthenticatedUserId({ headers: { cookie: `token=${expired}` } }), null);
  });
});

test('both Vercel Reintegração voice routes initialize the database and require an existing account', () => {
  const apiIndex = read('api/index.ts');
  const standalone = read('api/reintegration-tts.ts');

  const initIndex = apiIndex.indexOf('await initializeDb();');
  const routeIndex = apiIndex.indexOf('if (pathname === "/api/reintegration-tts")');
  const authIndex = apiIndex.indexOf('getAuthenticatedUserId(req)', routeIndex);
  const serveIndex = apiIndex.indexOf('return serveReintegrationVoice(req, res, userId)', routeIndex);
  assert.ok(initIndex >= 0 && routeIndex > initIndex && authIndex > routeIndex && serveIndex > authIndex);
  assert.ok(apiIndex.includes('getDb().users.some((user: any) => user.id === userId)'));

  assert.ok(standalone.includes('await initializeDb()'));
  assert.ok(standalone.includes('getAuthenticatedUserId(req)'));
  assert.ok(standalone.includes('getDb().users.some((user: any) => user.id === userId)'));
});

test('Reintegração voice audio is user-scoped, never shared-cached, and sends the same-origin session cookie', () => {
  const apiIndex = read('api/index.ts');
  const standalone = read('api/reintegration-tts.ts');
  const player = read('src/components/PersonalJourney21.tsx');

  assert.ok(apiIndex.includes('allowReintegrationVoiceAttempt(userId)'));
  assert.ok(standalone.includes('allowVoiceAttempt(userId)'));
  assert.ok(apiIndex.includes('private, no-store'));
  assert.ok(standalone.includes('private, no-store'));
  assert.doesNotMatch(apiIndex, /public,\\s*max-age|s-maxage=/i);
  assert.doesNotMatch(standalone, /public,\\s*max-age|s-maxage=/i);
  assert.ok(player.includes("credentials: 'same-origin'"));
});
