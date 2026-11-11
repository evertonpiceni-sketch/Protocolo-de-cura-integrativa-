import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('o acolhimento Natural Sereno mantém fotografia realista e base creme/marfim', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const marker = css.lastIndexOf('/* RUN 169 — Acolhimento Natural Sereno');
  assert.ok(marker >= 0, 'a camada final do acolhimento deve existir');
  const finalLayer = css.slice(marker);

  assert.ok(finalLayer.includes(':root[data-layout="natural-sereno"] .ns-app.ns-welcome'));
  assert.ok(finalLayer.includes("url('/brand/natural-sereno/acolhimento.webp')"));
  assert.ok(finalLayer.includes('background-color: #FAF7F2 !important;'));
  assert.ok(finalLayer.includes('rgba(250,247,242,.70)'));
  assert.ok(finalLayer.includes('rgba(250,247,242,.86)'));
  assert.doesNotMatch(finalLayer, /rgba\(42,36,33,\.(58|72)\)/);
});

test('a versão desktop preserva o enquadramento vertical da paisagem no acolhimento', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const marker = css.lastIndexOf('/* RUN 169 — Acolhimento Natural Sereno');
  const finalLayer = css.slice(marker);
  assert.match(finalLayer, /@media\s*\(min-width:\s*900px\)/);
  assert.match(finalLayer, /center\s*\/\s*auto\s+100%\s+no-repeat/);
});

test('o logo do acolhimento permanece uma assinatura discreta e os estilos não são afetados', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const welcome = read('src/components/NaturalSerenoHome.tsx');
  const marker = css.lastIndexOf('/* RUN 169 — Acolhimento Natural Sereno');
  const finalLayer = css.slice(marker);

  assert.ok(welcome.includes('className="ns-welcome-brand"'));
  assert.ok(css.includes('.ns-welcome-brand') && css.includes('opacity:.30!important;'));
  assert.ok(finalLayer.includes(':root[data-layout="natural-sereno"]'));
  assert.doesNotMatch(finalLayer, /data-layout="(elegancia-profunda|essencia-luminosa|mistico-moderno)"/);
});
