import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const marker = '/* RUN 171 — canvas externo da Reintegração: alinhar o shell ao marfim aprovado.';

test('o shell de 21 dias usa o canvas marfim aprovado no Natural Sereno', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  const css = read('src/natural-sereno-approved-overrides.css');
  const main = read('src/main.tsx');
  const start = css.lastIndexOf(marker);
  const block = css.slice(start);

  assert.ok(start >= 0, 'Override final do shell não encontrado');
  assert.ok(journey.includes('data-ep-reintegration="true" data-journey-days="21" className="ep-reintegration-shell'));
  assert.ok(block.includes(':root[data-layout="natural-sereno"] [data-ep-reintegration="true"].ep-reintegration-shell'));
  assert.ok(block.includes('color: #2A2421 !important;'));
  assert.ok(block.includes('background: #FAF7F2 !important;'));

  const baseImport = main.indexOf("import './natural-sereno.css';");
  const finalImport = main.indexOf("import './natural-sereno-approved-overrides.css';");
  assert.ok(baseImport >= 0 && finalImport > baseImport, 'O override aprovado precisa vir depois do CSS-base');
});

test('a correção do shell não altera os outros três estilos', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const start = css.lastIndexOf(marker);
  const block = css.slice(start);
  const selectors = block.split('\\n').map(line => line.trim()).filter(line => line.startsWith(':root'));

  assert.ok(start >= 0);
  assert.equal(selectors.length, 1);
  assert.ok(selectors[0].startsWith(':root[data-layout="natural-sereno"]'));
  assert.doesNotMatch(block, /data-layout="(?:elegancia-profunda|essencia-luminosa|mistico-moderno)"/);
});
