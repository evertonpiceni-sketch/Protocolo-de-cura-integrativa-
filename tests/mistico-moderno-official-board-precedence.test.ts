import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno treats the official board as atmosphere/palette and preserves later approved decisions', () => {
  const chooser = read('src/components/LayoutChoiceModal.tsx');
  const layouts = read('src/config/layouts.ts');
  const app = read('src/App.tsx');
  const finalCss = read('src/mistico-moderno-final-audit.css');

  assert.match(chooser, /MISTICO_MODERNO_OFFICIAL_BOARD = '\/brand\/mistico-moderno\/prancha-oficial-card\.svg'/);
  assert.match(chooser, /A prancha é referência de atmosfera e paleta; prevalecem as decisões aprovadas posteriores: jornada de 21 dias, corpo neutro e logo oficial discreto\/transparente\./);
  assert.match(layouts, /jornada vigente permanece com 21 dias, corpo neutro e logo oficial discreto\/transparente como assinatura/);
  assert.match(chooser, /useState<LayoutId \| null>\(null\)/);
  assert.match(chooser, /disabled={!selectedLayout \|\| isSaving}/);
  assert.match(app, /const \[layoutConfirmedThisSession, setLayoutConfirmedThisSession\] = useState\(false\)/);
  assert.match(app, /Never activate a visual theme before the user explicitly confirms a choice/);
  assert.match(finalCss, /esmeralda fica restrita à natureza/);
});
