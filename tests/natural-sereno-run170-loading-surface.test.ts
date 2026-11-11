import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('o carregamento Natural Sereno usa natureza sob véu marfim, sem a chapa escura legada', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const main = read('src/main.tsx');
  const marker = css.indexOf('/* RUN 170 — carregamento Natural Sereno: substituir o véu escuro herdado por leitura marfim. */');
  assert.ok(marker >= 0, 'Override final do carregamento não encontrado');
  const block = css.slice(marker);

  assert.ok(block.includes(':root[data-layout="natural-sereno"] #auth-loading-view'));
  assert.ok(block.includes('background-color: #FAF7F2 !important;'));
  assert.ok(block.includes("url('/brand/natural-sereno/presenca.webp')"));
  assert.ok(block.includes('rgba(250,247,242,.76)'));
  assert.ok(block.includes('rgba(250,247,242,.90)'));
  assert.ok(block.includes('color: #2A2421 !important;'));
  assert.ok(block.includes('color: #6B625B !important;'));
  assert.ok(block.includes('linear-gradient(90deg,#C89D52,#A87E37)'));

  const baseImport = main.indexOf("import './natural-sereno.css';");
  const finalImport = main.indexOf("import './natural-sereno-approved-overrides.css';");
  assert.ok(baseImport >= 0 && finalImport > baseImport, 'A camada aprovada deve prevalecer sobre o CSS-base');
});
