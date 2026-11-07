import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { shouldPlayProtocolSessionBackground } from '../src/lib/protocolSessionAudioPolicy';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('o seletor apresenta os quatro estilos e exige confirmação antes de aplicar o tema', () => {
  const app = read('src/App.tsx');
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const layouts = read('src/config/layouts.ts');

  for (const id of ['natural-sereno', 'elegancia-profunda', 'essencia-luminosa', 'mistico-moderno']) {
    assert.ok(layouts.includes(id), `estilo oficial ausente: ${id}`);
  }

  assert.ok(app.includes('(!layoutConfirmedThisSession || layoutChoiceRequested)'));
  assert.ok(app.includes('const selected = layoutConfirmedThisSession ? OFFICIAL_LAYOUTS.find'));
  assert.ok(app.includes('document.documentElement.dataset.layout = selected.id'));
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(modal.includes('O estilo só será aplicado depois da sua confirmação.'));
  assert.ok(modal.includes('../../docs/visual-qa/natural-sereno/reference.jpg'));
  assert.ok(modal.includes("selectedLayout === 'natural-sereno' ? 'rounded-2xl' : 'rounded-full'"));
  assert.ok(fs.existsSync('docs/visual-qa/natural-sereno/reference.jpg'));
});

test('a paisagem do Natural Sereno mantém enquadramento responsivo em desktop e mobile', () => {
  const home = read('src/natural-sereno-home-surface-audit.css');
  assert.ok(home.includes('var(--ns-valley)'));
  assert.ok(home.includes('background-size: cover') || home.includes('/ cover'));
  assert.ok(home.includes('@media (min-width:768px)'));
  assert.ok(home.includes('@media (max-width:767px)'));
  assert.ok(home.includes('background-position:center 52%'));
  assert.ok(home.includes('background-position:center 54%'));
  assert.ok(home.includes('.ep-home-continue'));
  assert.ok(home.includes('.ns-home-content'));
  assert.ok(home.includes('background: linear-gradient(180deg,#E2B96B 0%,#C89D52 100%)'));
});

test('as últimas heranças verde-floresta são neutralizadas somente no Natural Sereno', () => {
  const main = read('src/main.tsx');
  const css = read('src/natural-sereno-approved-overrides.css');

  assert.ok(main.indexOf("import './natural-sereno-approved-overrides.css'") > main.indexOf("import './natural-sereno-legacy-green-audit.css'"));
  assert.ok(main.indexOf("import './natural-sereno-approved-overrides.css'") > main.indexOf("import './natural-sereno-refinement.css'"));
  assert.ok(main.indexOf("import './natural-sereno-approved-overrides.css'") > main.indexOf("import './natural-sereno-mobile-fixes.css'"));
  assert.ok(main.indexOf("import './natural-sereno-approved-overrides.css'") > main.indexOf("import './natural-sereno-home-surface-audit.css'"));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] :is(#astral-map-modal,#numerology-modal) div[class*="bg-[#073b2b]"]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #herbal-baths-modal button[class*="bg-[#073b2b]"]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #hooponopono-modal [role="tab"][aria-selected="true"]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #admin-panel-modal :is(button,a)[class*="bg-emerald"]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] :is(#settings-view,#audio-settings-modal,#mobile-install-modal,#achievements-modal,#journal-dashboard-view) button[class~="bg-[#B88736]"]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #daily-diary-modal :is(div,span)[class*="bg-[#B88736]/"]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #admin-panel-modal button[type="submit"]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] [data-ns-pix-card]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #anamnesis-modal > div'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #anamnesis-modal :is(button,a)[class*="bg-emerald-"]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #anamnesis-modal .ep-anamnesis-progress-fill'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #anamnesis-modal .ep-anamnesis-frequency'));
  assert.ok(css.includes("url('/brand/natural-sereno/acolhimento.webp')"));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] .ns-app .ns-gold {\n  border-radius: 18px !important;'));
  assert.ok(css.includes('#profile-setup-view.ep-auth-prestyle #onboarding-card :is(#register-form,#login-form) button[type="submit"]'));
  assert.ok(!css.includes('#profile-setup-view.ep-auth-style-one #onboarding-card'));
});

test('o logo permanece como assinatura discreta e o Diário conserva superfícies claras', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const diary = read('src/components/DailyDiaryModal.tsx');

  assert.ok(css.includes('#main-header .ep-brand-signature { opacity:.30!important'));
  assert.ok(css.includes('#main-header .ep-brand-signature { opacity:.26!important'));
  assert.ok(diary.includes('id="daily-diary-modal"'));
  assert.ok(css.includes('#daily-diary-modal .bg-emerald-50'));
  assert.ok(css.includes('#daily-diary-modal .bg-amber-50'));
});

test('o player Natural Sereno usa voz neural e não reativa o Solfeggio durante a fala', () => {
  const home = read('src/components/TransformationHome.tsx');
  const session = read('src/components/MeditationSession.tsx');
  const voicePatch = read('src/lib/naturalSerenoOfficialVoicePatch.ts');
  const app = read('src/App.tsx');
  const profile = read('src/components/ProfileSetup.tsx');

  assert.ok(profile.includes('voiceType: voiceChoice'));
  assert.ok(profile.includes('preferredVoiceGender: voiceChoice'));
  assert.ok(!profile.includes('Rachel'));
  assert.ok(!profile.includes('SpeechSynthesis'));
  assert.ok(!profile.includes('speechSynthesis'));
  assert.ok(home.includes('const requiresNeuralVoice = isNaturalSereno ||'));
  assert.ok(home.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(voicePatch.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(session.includes('shouldPlayProtocolSessionBackground(sessionPhase, bgMusicType)'));
  assert.ok(app.includes('activeSessionDay === null'));
  assert.ok(app.includes('!showArcanjoView'));

  assert.equal(shouldPlayProtocolSessionBackground('playing', '528hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', '432hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', 'waves'), true);
  assert.equal(shouldPlayProtocolSessionBackground('portal', 'waves'), false);
});

test('a animação do player preserva etapas, movimento por frame e preferência por movimento reduzido', () => {
  const session = read('src/components/MeditationSession.tsx');
  const canvas = read('src/components/session/SacredEnergyCanvas.tsx');

  assert.ok(session.includes('<SacredEnergyCanvas'));
  assert.ok(session.includes('stageId={currentStage.id}'));
  assert.ok(canvas.includes('prefers-reduced-motion: reduce'));
  assert.ok(canvas.includes('requestAnimationFrame(render)'));
  for (const stage of ['ABERTURA', 'ATERRAMENTO', 'VITALIDADE', 'TRANSMUTACAO', 'BALSAMO', 'SELAMENTO']) {
    assert.ok(canvas.includes(`ProtocolStage.${stage}`), `etapa sem animação: ${stage}`);
  }
});

test('Numerologia e Prática Específica usam checkout InfinitePay com confirmação no servidor', () => {
  const numerology = read('src/components/NumerologyModal.tsx');
  const treatment = read('src/components/SpecificTreatmentModal.tsx');
  const routes = read('src/lib/paymentRoutes.ts');

  assert.ok(numerology.includes('/api/payment/create-checkout'));
  assert.ok(numerology.includes("productType: 'numerology_full'"));
  assert.ok(treatment.includes('/api/payment/create-checkout'));
  assert.ok(treatment.includes("productType: 'specific_treatment'"));
  assert.ok(!treatment.includes('handleCopyPix'));
  assert.ok(routes.includes("router.post('/payment/create-checkout'"));
  assert.ok(routes.includes("provider('/payment_check'"));
  assert.ok(routes.includes('verified.success !== true || verified.paid !== true || verified.amount !== order.cents'));
});
