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
  const route = server.slice(routeStart, routeStart + 1800);
  assert.ok(route.includes('res.setHeader("Retry-After", "1")'));
});


test('login e cadastro permanecem neutros até a confirmação de um dos quatro estilos', () => {
  const profileSetup = fs.readFileSync('src/components/ProfileSetup.tsx', 'utf8');
  const theme = fs.readFileSync('src/approved-theme.css', 'utf8');
  assert.ok(profileSetup.includes('ep-auth-prestyle'));
  assert.ok(theme.includes('#profile-setup-view.ep-auth-prestyle'));
  assert.ok(!theme.includes('ep-auth-style-one'), 'não pode restar herança de pré-seleção Natural Sereno');
  assert.ok(theme.includes('background: #FAF7F2 !important'));
  assert.ok(theme.includes('display: none !important'), 'paisagem/vinheta não podem aparecer antes da escolha');
});

test('camadas de Natural Sereno não mantêm fallbacks antigos de verdão, amarelão ou CTA em pílula', () => {
  const base = fs.readFileSync('src/natural-sereno.css', 'utf8');
  const refinement = fs.readFileSync('src/natural-sereno-refinement.css', 'utf8');
  const mobile = fs.readFileSync('src/natural-sereno-mobile-fixes.css', 'utf8');
  const shared = fs.readFileSync('src/approved-theme.css', 'utf8');

  assert.ok(base.includes('border-radius: 18px'));
  assert.ok(base.includes('linear-gradient(180deg,#E2B96B 0%,#C89D52 55%,#A87E37 100%)'));
  for (const stale of ['#063020', '#ead394', '#c49b42', '#aa7d25', '#98701f', '#d7b55e']) {
    assert.ok(!base.includes(stale), `fallback antigo no CSS base: ${stale}`);
  }
  for (const stale of ['#073b2b', '#174b37', '#dfc57f', '#21563c', '#315d3d']) {
    assert.ok(!refinement.includes(stale), `herança antiga na camada refinement: ${stale}`);
  }
  for (const stale of ['#073b2b', '#063020', '#ead394', '#dfc57f', '#fff9e8']) {
    assert.ok(!mobile.includes(stale), `herança antiga na camada mobile: ${stale}`);
  }
  assert.ok(!mobile.includes('.ep-reintegration-running'), 'regras compartilhadas da Reintegração não pertencem à folha Natural Sereno');
  assert.ok(shared.includes('.ep-reintegration-running'), 'regras estruturais compartilhadas permanecem no tema comum');
});
