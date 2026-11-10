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

  const borderSources = [
    audio,
    app,
    read('src/components/TransformationHome.tsx'),
    read('src/components/ArcanjoProtocolView.tsx'),
    read('src/lib/universalAnamnesisDiaryAccessPatch.ts'),
  ].join('\\n');
  const borderVariants = [
    ['15', '.15'], ['16', '.16'], ['18', '.18'], ['20', '.20'],
    ['22', '.22'], ['24', '.24'], ['25', '.25'], ['28', '.28'],
    ['30', '.30'], ['35', '.35'], ['40', '.40'], ['45', '.45'],
    ['50', '.50'], ['55', '.55'],
  ];
  for (const [alpha, opacity] of borderVariants) {
    const token = `border-[#B88736]/${alpha}`;
    assert.ok(borderSources.includes(token), `Uso atual da variante ${token} não encontrado`);
    assert.ok(overrides.includes(`[class~="${token}"]`), `Alpha de borda ${opacity} não protegido`);
    assert.ok(overrides.includes(`rgba(200,157,82,${opacity})`), `Transparência de borda ${opacity} ausente`);
  }
  assert.ok(overrides.includes('[class~="text-[#B88736]/60"]'));
  assert.ok(overrides.includes('color: rgba(200,157,82,.60) !important;'));
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


test('Prática Individual remove âmbar saturado, painel índigo e foco esmeralda no Natural Sereno', () => {
  const modal = read('src/components/SpecificTreatmentModal.tsx');
  const overrides = read('src/natural-sereno-approved-overrides.css');
  const scope = ':root[data-layout="natural-sereno"] #specific-treatment-modal';

  for (const token of [
    'bg-amber-400',
    'text-slate-950',
    'bg-indigo-950/30',
    'text-indigo-200',
    'via-slate-950/40',
    'focus:border-emerald-500',
    'text-emerald-500',
    'shadow-emerald',
  ]) {
    assert.ok(modal.includes(token), `O componente deve manter o token legado identificável: ${token}`);
    assert.ok(overrides.includes(`${scope} [class*="${token}"]`), `Falta neutralização específica para ${token}`);
  }

  assert.ok(overrides.includes('background: linear-gradient(180deg,#E2B96B,#C89D52) !important;'));
  assert.ok(overrides.includes('background: linear-gradient(145deg,#FFFDF8 0%,#F5EFE5 100%) !important;'));
  assert.ok(overrides.includes('border-color: #C89D52 !important;'));
  assert.ok(overrides.includes('box-shadow: 0 8px 18px rgba(67,52,39,.08) !important;'));
});

test('Home Natural Sereno usa somente o dourado refinado nos pequenos acentos', () => {
  const homeModel = read('src/lib/naturalSerenoHomeApprovedModel.ts');

  assert.doesNotMatch(homeModel, /#8F631E/i, 'O ocre legado não pode reaparecer nos textos de acento da Home');
  assert.equal((homeModel.match(/#A87E37/gi) || []).length >= 4, true);
  for (const selector of [
    '.ep-home-anamnesis-card > small',
    '.ns-current-day .ns-row-copy small',
    '.ns-insight > small',
    '.ep-home-closing p',
  ]) {
    assert.ok(homeModel.includes(selector), `Seletor da Home não encontrado: ${selector}`);
  }
});
