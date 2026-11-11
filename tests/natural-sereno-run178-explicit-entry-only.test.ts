import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('o seletor obrigatório é a única abertura automática de entrada', () => {
  const app = read('src/App.tsx');

  assert.match(app, /\{\(!layoutConfirmedThisSession \|\| layoutChoiceRequested\) && \(\s*<LayoutChoiceModal/);
  assert.match(app, /setLayoutConfirmedThisSession\(true\)/);

  assert.match(app, /const \[showWelcomeModal, setShowWelcomeModal\] = useState<boolean>\(false\)/);
  assert.match(app, /const \[showDailyTip, setShowDailyTip\] = useState<boolean>\(false\)/);
  assert.doesNotMatch(app, /setShowWelcomeModal\(\s*true\s*\)/);
  assert.doesNotMatch(app, /setShowDailyTip\(\s*true\s*\)/);
});

test('o componente antigo WelcomeModal não é importado nem montado', () => {
  const app = read('src/App.tsx');
  assert.doesNotMatch(app, /(?:import|lazy\(\(\)\s*=>\s*import)\s*[^\n]*WelcomeModal/);
});
