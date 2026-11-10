import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Natural Sereno renders the active welcome onboarding on a light approved surface', () => {
  const app = read('src/App.tsx');
  const onboarding = read('src/components/OnboardingFlow.tsx');
  const css = read('src/natural-sereno-approved-overrides.css');
  const marker = '/* RUN 149 — acolhimento do Natural Sereno: remover o painel verde-escuro herdado do onboarding compartilhado. */';
  const start = css.lastIndexOf(marker);
  assert.ok(start >= 0, 'O override específico do acolhimento Natural Sereno deve existir.');
  const block = css.slice(start);

  assert.ok(app.includes('showWelcomeModal && userProfile && layoutConfirmedThisSession && !layoutChoiceRequested'));
  assert.ok(onboarding.includes('className="ep-care-onboarding-card'));
  assert.match(block, /:root\[data-layout="natural-sereno"\] \.ep-care-onboarding-card\s*\{/);
  assert.match(block, /background: linear-gradient\(145deg, #FFFDF8 0%, #FAF7F2 60%, #F0E7D9 100%\) !important/);
  assert.match(block, /border-color: rgba\(200,157,82,\.34\) !important/);
  assert.match(block, /color: #2A2421 !important/);
  assert.match(block, /button\[aria-pressed="true"\]/);
  assert.match(block, /button\[aria-pressed="false"\]/);
  assert.match(block, /\.ep-gold-button/);
  assert.doesNotMatch(block, /rgba\(7,52,38|rgba\(3,27,19|#073b2b|#0c4a34/i);
  assert.ok(css.includes(':root[data-layout="natural-sereno"] .ep-care-onboarding-card .ep-brand-signature {'));
});
