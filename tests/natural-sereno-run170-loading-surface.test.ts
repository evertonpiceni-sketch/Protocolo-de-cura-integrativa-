import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('o carregamento Natural Sereno usa paisagem real sob véu marfim e não recupera arte corporal antiga', () => {
  const baseCss = read('src/natural-sereno.css');
  const approvedCss = read('src/natural-sereno-approved-overrides.css');
  const main = read('src/main.tsx');
  const marker = approvedCss.indexOf('/* RUN 170 — carregamento Natural Sereno: substituir o véu escuro herdado por leitura marfim. */');
  assert.ok(marker >= 0, 'Override final do carregamento não encontrado');
  const block = approvedCss.slice(marker);

  assert.ok(block.includes(':root[data-layout="natural-sereno"] #auth-loading-view'));
  assert.ok(block.includes('background-color: #FAF7F2 !important;'));
  assert.ok(block.includes("url('/brand/natural-sereno/vale-amanhecer.webp')"));
  assert.ok(block.includes('rgba(250,247,242,.76)'));
  assert.ok(block.includes('rgba(250,247,242,.90)'));
  assert.ok(block.includes('color: #2A2421 !important;'));
  assert.ok(block.includes('color: #6B625B !important;'));
  assert.ok(block.includes('linear-gradient(90deg,#C89D52,#A87E37)'));

  assert.ok(baseCss.includes("url('/brand/natural-sereno/vale-amanhecer.webp')"));
  const baseLoadingRules = [...baseCss.matchAll(/:root\\[data-layout="natural-sereno"\\] #auth-loading-view\\s*\\{[^}]*\\}/g)].map(match => match[0]);
  assert.ok(baseLoadingRules.length >= 2, 'As regras-base do carregamento devem continuar protegidas');
  for (const rule of baseLoadingRules) {
    assert.ok(rule.includes("url('/brand/natural-sereno/vale-amanhecer.webp')"));
    assert.ok(rule.includes('rgba(250,247,242,.76)'));
    assert.ok(!rule.includes('rgba(42,36,33,.68)'));
    assert.ok(!rule.includes('var(--ns-waterfall)'));
  }
  assert.ok(baseCss.includes('#auth-loading-view :is(h2, p) { color: #2A2421 !important; }'));
  assert.ok(baseCss.includes('.ns-loading-details small { font-size: 12px; color: #6B625B;'));
  assert.ok(baseCss.includes('background: rgba(200,157,82,.16); border: 1px solid rgba(168,126,55,.24);'));
  assert.ok(!baseCss.includes('presenca.webp'));
  assert.ok(!approvedCss.includes('presenca.webp'), 'A arte antiga com chakras não pode voltar ao tema ativo');

  const baseImport = main.indexOf("import './natural-sereno.css';");
  const finalImport = main.indexOf("import './natural-sereno-approved-overrides.css';");
  assert.ok(baseImport >= 0 && finalImport > baseImport, 'A camada aprovada deve prevalecer sobre o CSS-base');
});