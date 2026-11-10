import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Home ativa do Natural Sereno não herda os painéis verde-floresta do CSS global', () => {
  const home = read('src/components/TransformationHome.tsx');
  const globalCss = read('src/index.css');
  const overrides = read('src/natural-sereno-approved-overrides.css');
  const entry = read('src/main.tsx');

  assert.ok(home.includes('className="ep-home mx-auto'));
  assert.ok(home.includes('className="ep-luxury-card ep-progress-card'));
  assert.ok(home.includes('className="ep-subcard'));
  assert.ok(globalCss.includes('.ep-luxury-card{'));
  assert.ok(globalCss.includes('rgba(7,52,38,.97)'));

  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] .ep-home .ep-home-hero'));
  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] .ep-home .ep-luxury-card'));
  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] .ep-home .ep-subcard'));
  assert.ok(overrides.includes('var(--ns-valley) !important;'));
  assert.ok(overrides.includes('background: #E8E0D5 !important;'));
  assert.ok(overrides.includes('color: #6B625B !important;'));

  const approved = entry.indexOf("import './natural-sereno-approved-overrides.css';");
  assert.ok(approved > entry.indexOf("import './natural-sereno-legacy-green-audit.css';"));
});

test('o acolhimento ativo usa paisagem realista e logo-assinatura transparente', () => {
  const home = read('src/components/TransformationHome.tsx');
  const overrides = read('src/natural-sereno-approved-overrides.css');

  assert.ok(home.includes('ep-welcome-audio ep-home-hero'));
  assert.ok(home.includes('ep-brand-signature-wrap'));
  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] .ep-welcome-audio'));
  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] :is(.ep-home,.ep-welcome-audio) .ep-brand-signature-wrap'));
  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] :is(.ep-home,.ep-welcome-audio) .ep-brand-signature'));
  assert.ok(overrides.includes('opacity: .30 !important;'));
  assert.ok(overrides.includes('background: transparent !important;'));
});

test('o cartão da afirmação do dia corrige o texto claro sobre fundo marfim', () => {
  const home = read('src/components/TransformationHome.tsx');
  const overrides = read('src/natural-sereno-approved-overrides.css');

  assert.ok(home.includes('text-[#f2e7c6]'));
  assert.ok(overrides.includes('.ep-home .ep-luxury-card > p:first-child + h3 + p + div'));
  assert.ok(overrides.includes('color: #6B625B !important;'));
  assert.ok(overrides.includes('background: #F5EFE4 !important;'));
});

test('Reintegração da Vida usa superfícies marfim no Natural Sereno, sem alterar outros estilos', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  const overrides = read('src/natural-sereno-approved-overrides.css');

  assert.ok(journey.includes('data-ep-reintegration="true"'));
  assert.ok(journey.includes('className="ep-reintegration-panel'));
  assert.ok(journey.includes('className="ep-reintegration-card'));
  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] [data-ep-reintegration="true"] .ep-reintegration-panel'));
  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] [data-ep-reintegration="true"] .ep-reintegration-card'));
  assert.ok(overrides.includes('background: linear-gradient(145deg,#FFFDF8 0%,#FAF7F2 58%,#F3EBDD 100%) !important;'));
  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] [data-ep-reintegration="true"] .ep-reintegration-day-button[aria-pressed="true"]'));
});

test('player imersivo da Reintegração não herda azul-noturno no Natural Sereno', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  const overrides = read('src/natural-sereno-approved-overrides.css');

  assert.ok(journey.includes('data-ep-reintegration-running="true"'));
  assert.ok(journey.includes('bg-[#031426]'));
  assert.ok(journey.includes('ep-reintegration-running-backdrop'));
  assert.ok(journey.includes('ep-reintegration-running-glow'));
  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] [data-ep-reintegration-running="true"]'));
  assert.ok(overrides.includes('background: #FAF7F2 !important;'));
  assert.ok(overrides.includes('background-image: linear-gradient(180deg,rgba(250,247,242,0) 0%,rgba(250,247,242,.82) 24%,#FAF7F2 100%) !important;'));
  assert.ok(overrides.includes('linear-gradient(135deg,#E2B96B,#C89D52) !important;'));
  assert.ok(overrides.includes('opacity: .24 !important;'));
  assert.ok(overrides.includes('background: #FAF7F2 !important;'));
});

test('o escopo da correção da Home e Reintegração é exclusivo do Natural Sereno', () => {
  const overrides = read('src/natural-sereno-approved-overrides.css');
  const run154 = overrides.slice(overrides.indexOf('/* RUN 154'));
  assert.ok(run154.length > 0);
  assert.doesNotMatch(run154, /:root(?!\[data-layout="natural-sereno"\])/);
  assert.doesNotMatch(run154, /:root\[data-layout="(?:elegancia-profunda|essencia-luminosa|mistico-moderno)"\]/);
});
