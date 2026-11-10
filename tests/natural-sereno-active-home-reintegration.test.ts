import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Home ativa do Natural Sereno monta NaturalSerenoHome, não o fallback legado', () => {
  const wrapper = read('src/components/TransformationHome.tsx');
  const home = read('src/components/NaturalSerenoHome.tsx');
  const entry = read('src/main.tsx');

  assert.match(wrapper, /if \(props\.visualLayout === 'natural-sereno'\)\s*\{\s*return <NaturalSerenoHome/);
  assert.ok(home.includes('className="ns-app ns-welcome"'));
  assert.ok(home.includes('className="ns-app"'));
  assert.ok(home.includes('<section className="ns-home-scene">'));
  assert.ok(home.includes('className="ns-home-content"'));
  assert.ok(entry.includes("import './lib/naturalSerenoHomeApprovedModel';"));
  assert.ok(entry.includes("import './natural-sereno-home-surface-audit.css';"));
  assert.ok(entry.includes("import './natural-sereno-approved-overrides.css';"));
});

test('Home ativa enquadra a paisagem realista separadamente em desktop e mobile', () => {
  const home = read('src/components/NaturalSerenoHome.tsx');
  const base = read('src/natural-sereno.css');
  const surface = read('src/natural-sereno-home-surface-audit.css');
  const latest = read('src/natural-sereno-home-latest-approved.css');
  const model = read('src/lib/naturalSerenoHomeApprovedModel.ts');

  assert.ok(home.includes('<section className="ns-home-scene">'));
  assert.ok(base.includes("--ns-valley: url('/brand/natural-sereno/vale-amanhecer.webp');"));
  assert.ok(surface.includes('var(--ns-valley) center 56% / cover no-repeat!important;'));
  assert.ok(surface.includes('@media (min-width:768px)'));
  assert.ok(surface.includes('@media (max-width:767px)'));
  assert.ok(latest.includes('@media (min-width: 900px)'));
  assert.ok(latest.includes('@media (max-width: 899px)'));
  assert.ok(model.includes('var(--ns-valley) center 35% / cover no-repeat !important;'));
  assert.ok(existsSync(new URL('../public/brand/natural-sereno/vale-amanhecer.webp', import.meta.url)));
});

test('acolhimento ativo usa fotografia real e logo oficial como assinatura discreta', () => {
  const home = read('src/components/NaturalSerenoHome.tsx');
  const base = read('src/natural-sereno.css');
  const overrides = read('src/natural-sereno-approved-overrides.css');

  assert.ok(home.includes('className="ns-app ns-welcome"'));
  assert.ok(home.includes('className="ns-welcome-brand"'));
  assert.ok(base.includes("background: url('/brand/natural-sereno/acolhimento.webp') center 42% / cover no-repeat #FAF7F2;"));
  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] :is(.approved-brand,[data-approved-brand],.ep-brand-signature,.ns-welcome-brand)'));
  assert.ok(overrides.includes('opacity:.30!important;'));
  assert.ok(existsSync(new URL('../public/brand/natural-sereno/acolhimento.webp', import.meta.url)));
});

test('cartões e mensagem da Home ativa usam superfícies claras e textos café', () => {
  const home = read('src/components/NaturalSerenoHome.tsx');
  const base = read('src/natural-sereno.css');
  const surface = read('src/natural-sereno-home-surface-audit.css');

  assert.ok(home.includes('className="ns-home-message"'));
  assert.ok(home.includes('className="ns-current-day ns-row"'));
  assert.ok(home.includes('className="ns-editorial-card"'));
  assert.ok(base.includes('.ns-home-message'));
  assert.ok(base.includes('.ns-editorial-card'));
  assert.ok(surface.includes('background:#FAF7F2!important;'));
  assert.ok(surface.includes('color:#2A2421!important;'));
  assert.ok(surface.includes('background:rgba(250,247,242,.88)!important;'));
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


test('CTA da Home ativa usa dourado refinado, texto café e cantos premium', () => {
  const home = read('src/components/NaturalSerenoHome.tsx');
  const surface = read('src/natural-sereno-home-surface-audit.css');

  assert.ok(home.includes('className="ns-gold"'));
  assert.match(surface, /\.ns-home-scene > \.ns-gold[\s\S]*?background-image:linear-gradient\(180deg,#E2B96B 0%,#C89D52 100%\)!important;/);
  assert.ok(surface.includes('color:#2A2421!important;'));
  assert.ok(surface.includes('border-radius:18px!important;'));
});

test('controles da sessão imersiva evitam botões em formato de pílula', () => {
  const overrides = read('src/natural-sereno-approved-overrides.css');
  assert.ok(overrides.includes('.ep-reintegration-running-script-button,'));
  assert.ok(overrides.includes('.ep-reintegration-running-control {\n  border-radius: 14px !important;'));
  assert.ok(overrides.includes('.ep-reintegration-running-cta {\n  border-radius: 18px !important;'));
});
