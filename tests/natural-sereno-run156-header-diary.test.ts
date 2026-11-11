import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const css = read('src/natural-sereno-approved-overrides.css');
const app = read('src/App.tsx');
const journal = read('src/components/JournalLog.tsx');

test('RUN 156 — a barra do navegador usa o marfim da pré-seleção', () => {
  assert.match(app, /const themeColor = selected\?\.swatches\[0\] \?\? '#FAF7F2';/);
});

test('RUN 161 — o logo do cabeçalho permanece transparente e sem halo', () => {
  assert.match(app, /id="header-profile-avatar"/);
  assert.match(css, /:root\[data-layout="natural-sereno"\] #header-profile-avatar\s*\{[^}]*background: transparent !important;[^}]*border: 0 !important;[^}]*box-shadow: none !important;/s);
});

test('RUN 161 — a regra de maior especificidade não reintroduz disco, moldura ou halo no logo', () => {
  const rule = css.match(/:root\[data-layout="natural-sereno"\] #main-header #header-profile-avatar\s*\{([^}]*)\}/s);
  assert.ok(rule, 'regra específica do avatar do logo ausente');
  assert.match(rule[1], /background:\s*transparent\s*!important/);
  assert.match(rule[1], /border:\s*0\s*!important/);
  assert.match(rule[1], /box-shadow:\s*none\s*!important/);
  assert.doesNotMatch(css, /#main-header\s+\.border-indigo-500\\\/40\s*\{/);
  assert.match(css, /#main-header \.ep-brand-signature\s*\{[^}]*opacity:\.30!important/s);
});

test('RUN 156 — o atalho Arcanjo não herda azul de outro estilo', () => {
  assert.match(app, /id="header-btn-archangel"/);
  assert.match(css, /:root\[data-layout="natural-sereno"\] #header-btn-archangel\s*\{[^}]*background: #FBF8F2 !important;[^}]*border-radius: 14px !important;/s);
  assert.match(css, /:root\[data-layout="natural-sereno"\] #header-btn-archangel svg\s*\{[^}]*color: #A87E37 !important;/s);
});

test('RUN 156 — o estado atual do Diário usa superfície marfim, não chapa esmeralda', () => {
  assert.match(journal, /id="journal-dashboard-view"/);
  assert.match(journal, /bg-emerald-50\/65/);
  assert.match(css, /:root\[data-layout="natural-sereno"\] #journal-dashboard-view section\[class\*="bg-emerald-50\/65"\]\s*\{[^}]*background: linear-gradient\(145deg,#FFFDF8,#F5EFE4\) !important;/s);
  assert.match(css, /:root\[data-layout="natural-sereno"\] #journal-dashboard-view section\[class\*="bg-emerald-50\/65"\] \[class\*="text-emerald-700"\]/);
});

test('RUN 156 — exportação do Diário usa CTA dourado com texto café', () => {
  assert.match(journal, /id="btn-export-journal"/);
  assert.match(css, /:root\[data-layout="natural-sereno"\] #btn-export-journal\s*\{[^}]*color: #2A2421 !important;[^}]*background: linear-gradient\(135deg,#E2B96B,#C89D52\) !important;/s);
});

test('RUN 156 — todas as novas regras estão isoladas no Natural Sereno', () => {
  const block = css.split('/* RUN 156 —')[1];
  assert.ok(block, 'bloco RUN 156 ausente');
  const selectors = [...block.matchAll(/^([^\n{}]+)\{/gm)].map(match => match[1].trim());
  assert.ok(selectors.length >= 8, 'esperava pelo menos oito regras específicas');
  assert.ok(selectors.every(selector => selector.startsWith(':root[data-layout="natural-sereno"]')), selectors.join('\n'));
});
