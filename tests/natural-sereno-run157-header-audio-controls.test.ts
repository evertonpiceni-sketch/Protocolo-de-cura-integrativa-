import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('src/natural-sereno-approved-overrides.css', 'utf8');
const app = readFileSync('src/App.tsx', 'utf8');

test('RUN 157 — controles de áudio do cabeçalho usam marfim e dourado refinado', () => {
  assert.ok(app.includes('id="header-audio-quick-control"'));
  assert.ok(app.includes('id="header-btn-audio-settings"'));
  assert.match(css, /:root\[data-layout="natural-sereno"\] #header-audio-quick-control button\s*\{[^}]*background: #FBF8F2 !important;/s);
  assert.match(css, /:root\[data-layout="natural-sereno"\] #header-audio-quick-control button svg\s*\{[^}]*color: #A87E37 !important;/s);
});

test('RUN 157 — acentos ocre do cabeçalho são convertidos para dourado refinado', () => {
  assert.match(css, /:root\[data-layout="natural-sereno"\] #main-header \[class\*="text-\[#8F631E\]"\]/);
  assert.match(css, /:root\[data-layout="natural-sereno"\] #main-header \[class\*="text-\[#B88736\]"\]/);
});

test('RUN 157 — CTA de exportação mantém texto café também no hover', () => {
  const block = css.slice(css.lastIndexOf('/* O CTA do Diário mantém texto café'));
  assert.match(block, /#btn-export-journal:hover\s*\{[^}]*color: #2A2421 !important;/s);
});

test('RUN 157 — todos os seletores novos permanecem isolados no Natural Sereno', () => {
  const start = css.indexOf('/* RUN 157 —');
  assert.ok(start >= 0, 'bloco RUN 157 ausente');
  const block = css.slice(start).replace(/\/\*[\s\S]*?\*\//g, '');
  const selectors = [...block.matchAll(/([^{}]+)\{/g)]
    .map(match => match[1].trim())
    .filter(selector => !selector.startsWith('@'))
    .flatMap(selector => selector.split(',').map(part => part.trim()));
  assert.ok(selectors.length >= 6);
  assert.ok(selectors.every(selector => selector.startsWith(':root[data-layout="natural-sereno"]')), selectors.join('\n'));
});
