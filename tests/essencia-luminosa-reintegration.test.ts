import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const journey = fs.readFileSync('src/components/PersonalJourney21.tsx', 'utf8');
const css = fs.readFileSync('src/essencia-luminosa-approved-overrides.css', 'utf8');
const run146 = css.slice(css.indexOf('/* RUN 146 — Essência Luminosa: Reintegração da Vida */'));

test('a jornada de 21 dias recebe superfícies claras apenas na Essência Luminosa', () => {
  assert.ok(journey.includes('data-ep-reintegration="true"'));
  assert.ok(journey.includes('data-journey-days="21"'));
  assert.ok(run146.includes(':root[data-layout="essencia-luminosa"] [data-ep-reintegration="true"] .ep-reintegration-panel'));
  assert.ok(run146.includes(':root[data-layout="essencia-luminosa"] [data-ep-reintegration="true"] .ep-reintegration-card'));
  assert.ok(run146.includes('var(--layout-card)'));
  assert.ok(run146.includes('var(--layout-canvas-alt)'));
});

test('o player da Reintegração preserva a fotografia natural e remove o azul-noturno no Estilo 3', () => {
  assert.ok(journey.includes('const isEssenciaLuminosa ='));
  assert.ok(journey.includes("isEssenciaLuminosa ? 'rgba(42,36,32,.20),rgba(42,36,32,.82)'"));
  assert.ok(journey.includes("url('${dayArtworkUrl}')"));
  assert.ok(run146.includes('[data-ep-reintegration-running="true"]'));
  assert.ok(run146.includes('linear-gradient(180deg, #2A2420, #39322B)'));
});

test('o logo da Reintegração permanece assinatura transparente em desktop e mobile', () => {
  assert.ok(run146.includes('.ep-reintegration-logo img'));
  assert.ok(run146.includes('opacity: .30 !important;'));
  assert.ok(run146.includes('opacity: .26 !important;'));
});

test('todas as regras novas ficam isoladas pelo layout da Essência Luminosa', () => {
  const selectors = run146.split('\n').map(line => line.trim()).filter(line => line.startsWith(':root[data-layout='));
  assert.ok(selectors.length >= 20);
  assert.ok(selectors.every(selector => selector.startsWith(':root[data-layout="essencia-luminosa"]')));
});
