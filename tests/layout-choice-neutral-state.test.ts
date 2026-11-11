import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('a saved layout is not applied until the user confirms it in the current session', () => {
  const app = read('src/App.tsx');
  const modal = read('src/components/LayoutChoiceModal.tsx');

  assert.match(app, /layoutConfirmedThisSession, setLayoutConfirmedThisSession\] = useState\(false\)/);
  assert.match(app, /const selected = layoutConfirmedThisSession \? OFFICIAL_LAYOUTS\.find/);
  assert.match(app, /if \(!selected\) \{\s*delete document\.documentElement\.dataset\.layout/);
  assert.match(app, /\(!layoutConfirmedThisSession \|\| layoutChoiceRequested\)/);
  assert.match(modal, /useState<LayoutId \| null>\(null\)/);
  assert.match(modal, /disabled=\{!selectedLayout \|\| isSaving\}/);

  const saveStart = app.indexOf('onSelect={async (layout) => {');
  const saveSuccess = app.indexOf('if (!response.ok)', saveStart);
  const confirm = app.indexOf('setLayoutConfirmedThisSession(true)', saveStart);
  assert.ok(saveStart >= 0 && saveSuccess > saveStart && confirm > saveSuccess,
    'The style must be confirmed only after the persisted preference succeeds.');

  const logout = app.indexOf('const handleLogout = async () =>');
  const reset = app.indexOf('setLayoutConfirmedThisSession(false)', logout);
  assert.ok(logout >= 0 && reset > logout, 'A new login session must require a fresh explicit choice.');
});

test('the preselection shell neutralizes legacy forest styling only while no style is active', () => {
  const main = read('src/main.tsx');
  const css = read('src/prestyle-neutral.css');

  assert.match(main, /import '\.\/prestyle-neutral\.css';/);
  assert.ok(main.indexOf("import './prestyle-neutral.css';") > main.indexOf("import './mistico-moderno-final-audit.css';"),
    'The neutral preselection layer must load after all four theme layers.');

  const selectors = [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{/g)]
    .map(match => match[1].trim())
    .filter(selector => selector && !selector.startsWith('@'));
  assert.ok(selectors.length >= 12, 'Expected explicit neutral shell coverage.');
  assert.ok(selectors.every(selector => selector.includes(':root:not([data-layout])')),
    'Every preselection rule must be inactive once a style is confirmed.');

  assert.match(css, /#cura-main-layout #main-header/);
  assert.match(css, /#cura-main-layout #bottom-action-dock/);
  assert.match(css, /#cura-main-layout #settings-view/);
  assert.match(css, /\.ep-premium-surface/);
  assert.match(css, /\.ep-forest-panel/);
  assert.doesNotMatch(css, /#073426|#04261B|#031B13|#0A2742|#2E3B73|#6C3FA0/,
    'The chooser shell must not silently inherit any approved style palette.');
});

test('the neutral chooser layer does not alter the approved public Reintegração experience', () => {
  const css = read('src/prestyle-neutral.css');
  assert.doesNotMatch(css, /ep-reintegration|reintegration21|#arcanjo-protocol-view|#plans-modal/);
  assert.match(css, /#main-header \.ep-brand-signature[\s\S]*?opacity: \.30/);
});

test('the Místico Moderno preview keeps natural sage out of standalone palette swatches', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');

  assert.doesNotMatch(modal, /#6F8F55|#1E6B5A/i,
    'Standalone sage/emerald swatches are not allowed in Style 4; emerald is reserved for natural imagery.');
  assert.match(modal, /\['#0A2742', '#2E3B73', '#6C3FA0', '#D4AF37', '#E2B96B', '#F4F1EB', '#141F30'\]/,
    'The Style 4 swatch row must use only the approved night, indigo, violet, gold, amber and ivory palette.');
});

test('the Místico Moderno chooser uses the verified official 4:3 board preview asset', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const board = read('public/brand/mistico-moderno/prancha-oficial-card.svg');

  assert.match(modal, /const MISTICO_MODERNO_OFFICIAL_BOARD = '\/brand\/mistico-moderno\/prancha-oficial-card\.svg';/);
  assert.doesNotMatch(modal, /prancha-oficial-card\.webp/);
  assert.match(modal, /className="h-full w-full object-contain p-1"/);
  assert.match(board, /width="384" height="288" viewBox="0 0 384 288"/);
  assert.match(board, /preserveAspectRatio="xMidYMid meet"/);
  assert.match(board, /data:image\/webp;base64,/);
});

test('the React chooser shell stays neutral until an explicit style choice', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const shellLine = modal.split('\n').find(line => line.includes('data-layout-choice-shell="true"'));

  assert.ok(shellLine, 'Expected an identifiable neutral chooser shell.');
  assert.ok(shellLine.includes('border-[#E3DFD6]'));
  assert.ok(shellLine.includes('bg-[#F8F7F3]'));
  assert.doesNotMatch(shellLine, /FBF8F2|E5DAC6|2A2420/);
  assert.ok(modal.includes('bg-[#302E2A]/35'));
  assert.ok(modal.includes('text-[#302E2A]">Escolha o que mais toca você</h2>'));
  assert.ok(modal.includes('text-[#625E56]">4 estilos, uma mesma essência</p>'));
  assert.ok(modal.includes('from-[#D8D4CB] via-[#C7C1B6] to-[#AFA99D]'));
  assert.ok(!modal.includes('from-[#A99B84] via-[#B7AD9D] to-[#817460]'));
});
