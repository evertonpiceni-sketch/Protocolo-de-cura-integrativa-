import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('acolhimento desktop Natural Sereno usa paisagem realista e superfície clara aprovada', () => {
  const base = read('src/natural-sereno.css');
  const mobile = read('src/natural-sereno-approved-overrides.css');
  const welcomeStart = base.indexOf(':root[data-layout="natural-sereno"] .ns-welcome {');
  const welcomeEnd = base.indexOf(':root[data-layout="natural-sereno"] .ns-welcome-content {', welcomeStart);
  const welcomeSurface = base.slice(welcomeStart, welcomeEnd);

  assert.ok(welcomeStart >= 0 && welcomeEnd > welcomeStart, 'regras de acolhimento precisam existir');
  assert.match(welcomeSurface, /acolhimento\.webp[^;]*center 42%[^;]*#FAF7F2[^;]*color: #2A2421/s);
  assert.match(welcomeSurface, /rgba\(250,247,242,\.72\)[^}]*rgba\(250,247,242,\.86\)/s);
  assert.doesNotMatch(welcomeSurface, /rgba\(42,36,33,\.58\)|rgba\(42,36,33,\.72\)/);
  assert.match(base, /\.ns-welcome h1 \{[^}]*color: #2A2421/);
  assert.match(base, /\.ns-welcome p \{[^}]*color: #6B625B/);
  assert.match(base, /\.ns-welcome-play \{[^}]*background: rgba\(250,247,242,\.94\)[^}]*color: #A87E37[^}]*box-shadow: 0 8px 22px rgba\(67,52,39,\.10\)/s);
  assert.ok(mobile.includes("url('/brand/natural-sereno/acolhimento.webp') center 46% / cover no-repeat"));
  assert.ok(mobile.includes('background: rgba(250,247,242,.94) !important;'));
});

test('ícones de Ferramentas e trilha de progresso usam tokens neutros aprovados', () => {
  const base = read('src/natural-sereno.css');
  assert.match(base, /\.ns-tools \.ns-row-icon \{[^}]*color: #A87E37/);
  assert.match(base, /\.ns-profile-progress progress::-webkit-progress-bar \{ background: #E8E0D5; \}/);
  assert.doesNotMatch(base, /#a4833e|#e6ddbc/i);
});

test('os estados hover do Natural Sereno usam o dourado claro aprovado, sem o amarelo anterior', () => {
  const overrides = read('src/natural-sereno-approved-overrides.css');
  const finalAudit = read('src/natural-sereno-final-audit.css');
  assert.doesNotMatch(overrides, /#E8C47D/i);
  assert.doesNotMatch(finalAudit, /#E8C47D/i);
  assert.ok(overrides.includes('#E2B96B'));
  assert.ok(finalAudit.includes('#E2B96B'));
});
