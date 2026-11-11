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


test('Místico Moderno keeps detached green UI accents out of the 27 style sheets', () => {
  const forbidden = [
    ['src/mistico-moderno-daily-diary-audit.css', /rgba\(18,\s*112,\s*103/],
    ['src/mistico-moderno-milestone-audit.css', /rgba\(8,\s*42,\s*43/],
    ['src/mistico-moderno-report-certificate-audit.css', /rgba\(8,\s*47,\s*50/],
    ['src/mistico-moderno-video-studio-audit.css', /rgba\(21,\s*116,\s*103|#12675f/i]
  ] as const;

  for (const [path, pattern] of forbidden) {
    const css = read(path).replace(/\/\*[\s\S]*?\*\//g, '');
    assert.doesNotMatch(css, pattern, 'Detached green UI color remains in ' + path + '.');
  }

  const theme = read('src/approved-theme.css');
  assert.match(theme, /Reservado à vegetação em imagens; não aplicar em superfícies, botões ou gradientes da interface/);
  assert.match(theme, /--layout-emerald:#1E6B5A;/);
});
