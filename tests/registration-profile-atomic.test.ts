import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('onboarding sends birth details and initial preferences in the registration request', () => {
  const profileSetup = fs.readFileSync('src/components/ProfileSetup.tsx', 'utf8');
  const server = fs.readFileSync('server.ts', 'utf8');

  assert.ok(profileSetup.includes('profile: registrationProfile'));
  assert.ok(profileSetup.includes('birthDate,'));
  assert.ok(profileSetup.includes('birthCity: birthCity.trim()'));
  assert.ok(profileSetup.includes('preferredVoiceGender: voiceChoice'));
  assert.ok(!profileSetup.includes("fetch('/api/user/sync'"), 'onboarding must not depend on a second persistence request');

  assert.ok(server.includes('const registrationProfileSchema = z.object({'));
  assert.ok(server.includes('profile: registrationProfileSchema.optional()'));
  assert.ok(server.includes('const { login, password, fullName, email, profile } = registerSchema.parse(req.body);'));
  assert.ok(server.includes('...(profile || {})'));
  assert.ok(server.includes('await saveDb();'), 'registration must persist the new user before returning');
});

test('user sync advertises its lock retry interval', () => {
  const server = fs.readFileSync('server.ts', 'utf8');
  const routeStart = server.indexOf('app.post("/api/user/sync"');
  const route = server.slice(routeStart, server.indexOf('app.use(\'/api\', paymentRoutes', routeStart));
  assert.ok(route.includes('res.setHeader("Retry-After", "1")'));
});
