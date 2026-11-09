import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Natural Sereno não reintroduz os tokens legados de verdão ou amarelo saturado', () => {
  const base = read('src/natural-sereno.css');
  const mobile = read('src/natural-sereno-mobile-fixes.css');
  assert.doesNotMatch(`${base}\n${mobile}`, /#063020|#e6c66e|#297241/i);
});

test('os tokens ativos do Estilo 1 permanecem creme, café, dourado e sálvia', () => {
  const theme = read('src/approved-theme.css');
  const overrides = read('src/natural-sereno-approved-overrides.css');
  for (const token of [
    '--layout-canvas:#FAF7F2;',
    '--layout-accent:#6F7B55;',
    '--layout-gold:#C89D52;',
    '--layout-text:#2A2421;',
    '--layout-text-secondary:#6B625B;',
  ]) {
    assert.ok(theme.includes(token) || overrides.includes(token), `Token aprovado ausente: ${token}`);
  }
});

test('CTAs Natural Sereno mantêm cantos premium de 18px, sem formato de pílula', () => {
  const overrides = read('src/natural-sereno-approved-overrides.css');
  const start = overrides.indexOf(':root[data-layout="natural-sereno"] .ns-app .ns-gold {');
  const end = overrides.indexOf(':root[data-layout="natural-sereno"] .ns-app .ns-gold:hover', start);
  const cta = start >= 0 && end > start ? overrides.slice(start, end) : '';
  assert.ok(cta.includes('border-radius: 18px !important;'));
  assert.doesNotMatch(cta, /border-radius:\s*999px/);
});

test('player e Arcanjo usam superfícies claras, mantendo o verde apenas em acentos', () => {
  const overrides = read('src/natural-sereno-approved-overrides.css');
  assert.ok(overrides.includes('#meditation-session.ep-session > footer'));
  assert.ok(overrides.includes('background: rgba(250,247,242,.94) !important;'));
  assert.ok(overrides.includes('.ep-forest-panel {'));
  assert.ok(overrides.includes('background: linear-gradient(145deg,#FFFDF8 0%,#F5EFE5 100%) !important;'));
});
