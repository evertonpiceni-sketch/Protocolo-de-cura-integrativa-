import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Natural Sereno apresenta a prancha oficial no seletor antes de aplicar o tema', () => {
  const app = read('src/App.tsx');
  const selector = read('src/components/LayoutChoiceModal.tsx');
  const profile = read('src/components/ProfileSetup.tsx');
  const main = read('src/main.tsx');

  assert.ok(app.includes("import LayoutChoiceModal from './components/LayoutChoiceModal'"));
  assert.ok(app.includes('{(!layoutConfirmedThisSession || layoutChoiceRequested) && ('));
  assert.ok(app.includes('setLayoutConfirmedThisSession(true)'));
  assert.doesNotMatch(app, /OnboardingFlow|DailyTipModal|WelcomeModal|showWelcomeModal|showDailyTip/);
  assert.ok(selector.includes('NATURAL_SERENO_OFFICIAL_BOARD'));
  assert.ok(selector.includes('docs/visual-qa/natural-sereno/reference.jpg'));
  assert.ok(selector.includes('object-contain'));
  assert.ok(selector.includes('Prancha oficial de referência. Decisões posteriores prevalecem.'));
  assert.ok(selector.includes('Natural Sereno'));
  assert.ok(profile.includes('ep-auth-prestyle'));
  assert.ok(main.includes("import './layout-choice-neutral-shell.css'"));
});

test('a prévia começa sem seleção e só confirma um dos quatro estilos', () => {
  const selector = read('src/components/LayoutChoiceModal.tsx');
  for (const name of ['Natural Sereno', 'Elegância Profunda', 'Essência Luminosa', 'Místico Moderno']) {
    assert.ok(selector.includes(name), `Prévia ausente: ${name}`);
  }
  assert.ok(selector.includes('useState<LayoutId | null>(null)'));
  assert.ok(selector.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(selector.includes('await onSelect(selectedLayout)'));
});
