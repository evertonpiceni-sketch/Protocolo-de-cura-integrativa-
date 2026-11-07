import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('Místico Moderno uses its own official board in the four-style selector', () => {
  assert.equal(existsSync(resolve(root, 'public/brand/mistico-moderno/prancha-oficial.webp')), true);
  const modal = readFileSync(resolve(root, 'src/components/LayoutChoiceModal.tsx'), 'utf8');
  assert.match(modal, /\/brand\/mistico-moderno\/prancha-oficial\.webp/);
  assert.match(modal, /const isMysticCard = layout\.id === 'mistico-moderno'/);
  assert.match(modal, /bg-\[#0A0F18\]/);
  assert.match(modal, /useState<LayoutId \| null>\(null\)/);
  assert.match(modal, /disabled=\{!selectedLayout \|\| isSaving\}/);
  const app = readFileSync(resolve(root, 'src/App.tsx'), 'utf8');
  assert.match(app, /onClick=\{\(\) => setLayoutChoiceRequested\(true\)\}/);
  assert.match(app, /const selected = layoutConfirmedThisSession \? OFFICIAL_LAYOUTS\.find/);
});

test('logout discards the previous account layout confirmation', () => {
  const app = readFileSync(resolve(root, 'src/App.tsx'), 'utf8');
  const start = app.indexOf('const handleLogout');
  const end = app.indexOf('// Retrieve mood description text', start);
  assert.ok(start >= 0 && end > start);
  const logout = app.slice(start, end);
  assert.match(logout, /setLayoutConfirmedThisSession\(false\)/);
  assert.match(logout, /setLayoutChoiceRequested\(false\)/);
  assert.match(logout, /delete document\.documentElement\.dataset\.layout/);
});

test('Arcanjo receives an isolated night treatment only when Style 4 is active', () => {
  const main = readFileSync(resolve(root, 'src/main.tsx'), 'utf8');
  const view = readFileSync(resolve(root, 'src/components/ArcanjoProtocolView.tsx'), 'utf8');
  const css = readFileSync(resolve(root, 'src/mistico-moderno-arcanjo-audit.css'), 'utf8');
  assert.match(main, /import '\.\/mistico-moderno-arcanjo-audit\.css';/);
  assert.match(view, /id="arcanjo-protocol-view"/);
  assert.match(view, /id="arcanjo-protocol-backdrop"/);
  assert.match(view, /id="arcanjo-chakra-stage"/);
  assert.match(view, /id="arcanjo-chakra-caption"/);
  assert.match(css, /:root\[data-layout="mistico-moderno"\]/);
  assert.doesNotMatch(css, /^\s*(?:body|html|#root)\s*\{/m);
});

test('all imported Místico Moderno CSS modules remain scoped to the active layout', () => {
  const main = readFileSync(resolve(root, 'src/main.tsx'), 'utf8');
  const imports = [...main.matchAll(/import '\.\/(mistico-moderno-[^']+\.css)';/g)].map(match => match[1]);
  assert.ok(imports.length >= 23, `Expected the existing 22 modules plus Arcanjo; found ${imports.length}.`);
  for (const filename of imports) {
    const css = readFileSync(resolve(root, 'src', filename), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const blocks = [...css.matchAll(/([^{}]+)\{/g)].map(match => match[1].trim().replace(/\s+/g, ' '));
    const selectors = blocks.filter(selector => selector && !selector.startsWith('@') && !/^(from|to|\d+%)/.test(selector));
    const unscoped = selectors.filter(selector => !selector.includes('data-layout="mistico-moderno"'));
    assert.deepEqual(unscoped, [], `${filename} contains a selector outside the Místico Moderno scope.`);
  }
});
