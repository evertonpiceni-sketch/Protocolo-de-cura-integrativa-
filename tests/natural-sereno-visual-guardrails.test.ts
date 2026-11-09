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


test('o player Natural Sereno usa um único canvas flexível, sem offsets ou chapas verdes legadas', () => {
  const base = read('src/natural-sereno.css');
  const finalAudit = read('src/natural-sereno-final-audit.css');
  const overrides = read('src/natural-sereno-approved-overrides.css');

  assert.match(base, /#meditation-session \{\s*color: #2A2421 !important;\s*background: linear-gradient\(180deg, rgba\(250,247,242,\.96\), rgba\(245,239,229,\.94\)\) !important;\s*overflow: hidden !important;/);
  assert.doesNotMatch(base, /rgba\(4,\s*38,\s*26|rgba\(3,\s*35,\s*24|padding-left:\s*50%|#meditation-session\[data-session-phase="playing"\]::before/);
  assert.match(finalAudit, /justify-content: space-between !important;/);
  assert.match(finalAudit, /flex: 1 1 auto !important;/);
  assert.match(overrides, /object-position: center 52%/);
  assert.match(overrides, /opacity: \.56/);
});

test('ícones, números do dia e progresso usam superfícies claras e dourado, com sálvia só como acento', () => {
  const base = read('src/natural-sereno.css');
  assert.match(base, /\.ns-row-icon \{[\s\S]*?color: #6F7B55;[\s\S]*?background: #FBF8F2;/);
  assert.match(base, /\.ns-day-number \{[\s\S]*?background:\s*#C89D52;[\s\S]*?color:\s*#2A2421;/);
  assert.ok(base.includes('progress::-webkit-progress-value { background: #C89D52; }'));
  assert.ok(base.includes('progress::-moz-progress-bar { background: #C89D52; }'));
  assert.match(base, /\.ns-profile-identity \{[^}]*color: var\(--ns-ink\)/);
});

test('o seletor só aplica um tema após escolha e confirmação explícitas', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const app = read('src/App.tsx');
  assert.match(modal, /useState<LayoutId \| null>\(null\)/);
  assert.match(app, /const selected = layoutConfirmedThisSession \? OFFICIAL_LAYOUTS\.find/);
  assert.match(app, /setLayoutConfirmedThisSession\(true\)/);
});


test('fundos dourados translúcidos mantêm seu alpha no Natural Sereno', () => {
  const overrides = read('src/natural-sereno-approved-overrides.css');
  const audio = read('src/components/AudioSettingsModal.tsx');
  const app = read('src/App.tsx');
  const variants = [
    ['8', '.08'],
    ['10', '.10'],
    ['12', '.12'],
    ['15', '.15'],
    ['20', '.20'],
  ];

  for (const [alpha, opacity] of variants) {
    const token = `bg-[#B88736]/${alpha}`;
    assert.ok(audio.includes(token) || app.includes(token), `Uso atual da variante ${token} não encontrado`);
    assert.ok(overrides.includes(`[class~="${token}"]`), `Alpha ${opacity} não protegido no tema Natural Sereno`);
    assert.ok(overrides.includes(`rgba(200,157,82,${opacity})`), `Transparência aprovada ${opacity} ausente`);
  }
});


test('CTAs compartilhados do áudio e configurações usam dourado premium e texto café', () => {
  const overrides = read('src/natural-sereno-approved-overrides.css');
  const audio = read('src/components/AudioSettingsModal.tsx');
  const app = read('src/App.tsx');

  assert.ok(audio.includes('bg-[#B88736]'));
  assert.ok(app.includes('bg-[#B88736]'));
  assert.ok(overrides.includes('#audio-settings-modal button[class~="bg-[#B88736]"]'));
  assert.ok(overrides.includes('#settings-view button[class~="bg-[#B88736]"]'));
  assert.ok(overrides.includes('background-image: linear-gradient(180deg,#E2B96B,#C89D52) !important;'));
  assert.ok(overrides.includes('color: #2A2421 !important;'));
  assert.ok(overrides.includes('border-radius: 18px !important;'));
  assert.ok(overrides.includes('background-color: #A87E37 !important;'));
});
