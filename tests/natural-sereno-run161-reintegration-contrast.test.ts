import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Reintegração Natural Sereno usa luz creme no backdrop, sem banho azul-noturno', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  assert.ok(journey.includes("dataset.layout === 'natural-sereno'"));
  assert.ok(journey.includes("isNaturalSereno ? 'rgba(250,247,242,.10),rgba(250,247,242,.58)'"));
  assert.ok(journey.includes("isEleganciaProfunda ? 'rgba(3,20,14,.38),rgba(3,20,14,.88)'"));
});

test('shell e modais da Reintegração usam marfim aprovado somente no Natural Sereno', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  assert.ok(css.includes(':root[data-layout="natural-sereno"] [data-ep-reintegration="true"] {'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] [data-ep-reintegration="true"] [data-ep-reintegration-modal="true"] {'));
  assert.ok(css.includes('background: #FAF7F2 !important;'));
  assert.ok(css.includes('color: #2A2421 !important;'));
});

test('controles de fechar da Reintegração deixam o formato de pílula no Natural Sereno', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  assert.ok(css.includes('[data-ep-reintegration-modal="true"] > button,'));
  assert.ok(css.includes('.ep-reintegration-script-close {'));
  assert.ok(css.includes('border-radius: 14px !important;'));
  assert.ok(css.includes('.ep-reintegration-running-close {'));
});

test('as correções da Reintegração não atingem os outros três estilos', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const start = css.lastIndexOf('/* RUN 161 — Reintegração: harmonizar o shell/modal');
  const block = css.slice(start);
  assert.ok(start >= 0);
  assert.doesNotMatch(block, /:root(?!\[data-layout="natural-sereno"\])/);
  assert.doesNotMatch(block, /data-layout="(?:elegancia-profunda|essencia-luminosa|mistico-moderno)"/);
});
