import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('RUN 174 — onboarding Natural Sereno usa a paleta aprovada e assinatura discreta', () => {
  const app = read('src/App.tsx');
  const flow = read('src/components/OnboardingFlow.tsx');
  const main = read('src/main.tsx');
  const css = read('src/natural-sereno-approved-overrides.css');
  const marker = css.indexOf('/* RUN 174 — Onboarding de primeira entrada');
  assert.ok(marker >= 0, 'override Natural Sereno do onboarding ausente');
  const block = css.slice(marker);
  const selectors = block.replace(/\/\*[\s\S]*?\*\//g, '').split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.endsWith('{') && !line.startsWith('@'));

  assert.ok(selectors.length >= 10);
  assert.ok(selectors.every(selector => selector.startsWith(':root[data-layout="natural-sereno"]')), selectors.join('\n'));
  assert.ok(block.includes('background: linear-gradient(145deg,#FFFDF8 0%,#F5EFE4 100%) !important;'));
  assert.ok(block.includes('background: transparent !important;'));
  assert.ok(block.includes('opacity: .30 !important;'));
  assert.ok(block.includes('background-image: linear-gradient(180deg,#E2B96B,#C89D52) !important;'));
  assert.doesNotMatch(block, /#073426|#031B13|rgba\(7,52,38|rgba\(3,27,19/i);

  // The global approved override is imported after App and its component CSS.
  assert.ok(main.indexOf("import App from './App.tsx';") < main.indexOf("import './natural-sereno-approved-overrides.css';"));
  assert.ok(flow.includes("import '../essencia-luminosa-onboarding-audit.css';"));
  assert.ok(flow.includes('step === 6'));
  assert.ok(app.includes('!layoutConfirmedThisSession || layoutChoiceRequested'));
  assert.ok(app.includes('const selected = layoutConfirmedThisSession ? OFFICIAL_LAYOUTS.find'));
});
