import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('RUN 174 — o card Natural Sereno usa a referência oficial sem reativar onboarding antigo', () => {
  const app = read('src/App.tsx');
  const selector = read('src/components/LayoutChoiceModal.tsx');
  const theme = read('src/approved-theme.css');

  assert.ok(selector.includes('NATURAL_SERENO_OFFICIAL_BOARD'));
  assert.ok(selector.includes('docs/visual-qa/natural-sereno/reference.jpg'));
  assert.ok(selector.includes('object-contain'));
  assert.ok(selector.includes('Prancha oficial de referência. Decisões posteriores prevalecem.'));
  assert.ok(selector.includes('useState<LayoutId | null>(null)'));
  assert.ok(selector.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(app.includes('{(!layoutConfirmedThisSession || layoutChoiceRequested) && ('));
  assert.doesNotMatch(app, /OnboardingFlow|DailyTipModal|WelcomeModal/);
  assert.ok(theme.includes('--layout-canvas:#FAF7F2;'));
  assert.ok(theme.includes('--layout-text:#2A2421;'));
});
