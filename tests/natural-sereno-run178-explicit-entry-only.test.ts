import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('o seletor obrigatório é a única abertura automática de entrada', () => {
  const app = read('src/App.tsx');

  assert.match(app, /\{\(!layoutConfirmedThisSession \|\| layoutChoiceRequested\) && \(\s*<LayoutChoiceModal/);
  assert.match(app, /setLayoutConfirmedThisSession\(true\)/);
  assert.doesNotMatch(app, /\b(?:OnboardingFlow|DailyTipModal|WelcomeModal)\b/);
  assert.doesNotMatch(app, /\b(?:showWelcomeModal|showDailyTip|setShowWelcomeModal|setShowDailyTip)\b/);
  assert.doesNotMatch(app, /cura_integrada_welcome_seen_v1/);
});

test('os quatro estilos exigem escolha explícita antes de aplicar o tema', () => {
  const chooser = read('src/components/LayoutChoiceModal.tsx');
  const definitions = read('src/config/layouts.ts');

  assert.match(chooser, /useState<LayoutId \| null>\(null\)/);
  assert.match(chooser, /OFFICIAL_LAYOUTS\.map/);
  assert.match(chooser, /disabled=\{!selectedLayout \|\| isSaving\}/);
  assert.match(chooser, /await onSelect\(selectedLayout\)/);
  assert.match(chooser, /O estilo só será aplicado depois da sua confirmação/);
  assert.match(chooser, /NATURAL_SERENO_OFFICIAL_BOARD/);
  assert.match(chooser, /object-contain/);

  for (const name of ['Natural Sereno', 'Elegância Profunda', 'Essência Luminosa', 'Místico Moderno']) {
    assert.ok(definitions.includes(`name: '${name}'`), `estilo ausente no seletor: ${name}`);
  }
});
