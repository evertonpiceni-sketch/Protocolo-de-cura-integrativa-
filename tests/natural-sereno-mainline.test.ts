import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('seletor dos quatro estilos exige escolha explícita e usa a prancha Natural Sereno', () => {
  const app = read('src/App.tsx');
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const layouts = read('src/config/layouts.ts');
  for (const id of ['natural-sereno', 'elegancia-profunda', 'essencia-luminosa', 'mistico-moderno']) {
    assert.ok(layouts.includes(id), `estilo oficial ausente: ${id}`);
  }
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(modal.includes('../../docs/visual-qa/natural-sereno/reference.jpg'));
  assert.ok(modal.includes("isNaturalSereno ? 'rounded-[18px]' : 'rounded-full'"));
  assert.ok(modal.includes("selectedLayout === 'natural-sereno' ? 'rounded-[18px]' : 'rounded-full'"));
  assert.ok(modal.includes('confirmButtonTone'));
  assert.ok(app.includes('(!layoutConfirmedThisSession || layoutChoiceRequested)'));
  assert.ok(app.includes('document.documentElement.dataset.layout = selected.id'));
  assert.ok(fs.existsSync('docs/visual-qa/natural-sereno/reference.jpg'));
});

test('Natural Sereno não herda chapas verde-floresta ou amarelo saturado', () => {
  const model = read('src/lib/naturalSerenoHomeApprovedModel.ts');
  const css = read('src/natural-sereno-approved-overrides.css');
  const home = read('src/natural-sereno-home-surface-audit.css');
  for (const discarded of ['background: #073b2b', 'rgba(7,59,43', '#fff9e8', '#f7e5aa', '#ead394', '#052f22']) {
    assert.ok(!model.includes(discarded), `herança visual antiga ainda presente: ${discarded}`);
  }
  assert.ok(model.includes('#FAF7F2'));
  assert.ok(model.includes('#C89D52'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"]'));
  assert.ok(css.includes('#astral-map-modal'));
  assert.ok(css.includes('#daily-diary-modal'));
  assert.ok(css.includes('#anamnesis-modal'));
  assert.ok(css.includes('#6F7B55'));
  assert.ok(home.includes('.ns-home-content'));
  assert.ok(home.includes('.ep-home-continue'));
  assert.ok(home.includes('var(--ns-valley)'));
  assert.ok(home.includes('background-position:center 52%'));
  assert.ok(home.includes('background-position:center 54%'));
  assert.ok(!/\n\s*\.ns-app\s*\{/.test(css), 'não pode haver override global da aplicação');
});

test('logo, Diário, voz e player preservam as decisões aprovadas', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const app = read('src/App.tsx');
  const session = read('src/components/MeditationSession.tsx');
  const diary = read('src/components/DailyDiaryModal.tsx');
  assert.ok(css.includes('opacity:.30!important'));
  assert.ok(css.includes('opacity:.26!important'));
  assert.ok(app.includes('onSaveEntry={handleSaveDiaryDay}'));
  assert.ok(app.includes('voiceId={userProfile.voiceId}'));
  assert.ok(diary.includes('id="daily-diary-modal"'));
  assert.ok(session.includes('const NATURAL_SERENO_CANVAS_THEME = {'));
  assert.ok(session.includes('colorTheme={isNaturalSereno ? NATURAL_SERENO_CANVAS_THEME'));
  assert.ok(session.includes('shouldPlayProtocolSessionBackground(sessionPhase, bgMusicType)'));
});

test('pagamento mantém apenas produtos atuais e checkout InfinitePay fail-closed', () => {
  const routes = read('src/lib/paymentRoutes.ts');
  const catalog = read('src/lib/paymentCatalog.ts');
  assert.ok(routes.includes("https://api.checkout.infinitepay.io"));
  assert.ok(routes.includes("options: { single_payment: true }"));
  assert.ok(routes.includes("headers['X-Api-Key'] = key"));
  assert.ok(routes.includes("if (!apiKey()) return res.status(503)"));
  assert.ok(routes.includes('acquireCheckoutCreationLock(PAYMENT_DATABASE_WRITE_LOCK_SCOPE)'));
  assert.ok(!routes.includes('`standard:${req.userId}:${productType}`'));
  assert.ok(routes.includes('checkoutRecoveryAttempts'));
  assert.ok(routes.includes('order.checkoutPayload?.handle || handle()'));
  assert.ok(routes.includes("paymentQuote(planId, couponCode || '')"));
  assert.ok(routes.includes('specificTreatmentQuote(durationDays, code)'));
  assert.ok(!routes.includes('numerology_full'));
  assert.ok(routes.includes("planId === 'semestral' || planId === 'anual'"));
  assert.ok(routes.includes("order.benefitChoice === 'numerology'"));
  assert.ok(routes.includes('numerologyPurchased: true'));
  assert.ok(!catalog.includes('numerology_full'));
  assert.ok(catalog.includes('jornada_7d'));
  assert.ok(catalog.includes('jornada_21d'));
  assert.ok(catalog.includes('5990'));
  assert.ok(catalog.includes('9990'));
});


test('a última camada neutraliza botões antigos e o véu verde do player no Natural Sereno', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  assert.ok(css.includes('.ns-app .ns-gold'));
  assert.ok(css.includes('--ns-modal-forest: #2A2421'));
  assert.ok(css.includes('--ns-destination-forest: #2A2421'));
  assert.ok(css.includes('--admin-forest: #2A2421'));
  assert.ok(css.includes('#meditation-session.ep-session[data-session-phase="playing"] .ep-session-backdrop::before'));
  assert.ok(css.includes('#meditation-session.ep-session[data-session-phase="playing"] > footer'));
  assert.ok(css.includes('.ns-play-toggle'));
  assert.ok(css.includes('.ep-protocol-progress'));
  assert.ok(!css.includes('rgba(3,26,19'));
});


test('Natural Sereno bloqueia Solfeggio durante a prévia neural sem bloquear ambiência não tonal', () => {
  const settings = read('src/components/AudioSettingsModal.tsx');
  const policy = read('src/lib/protocolSessionAudioPolicy.ts');

  assert.ok(settings.includes('const isNaturalSerenoSolfeggioBlocked = isNaturalSereno && isTestingVoice && isSolfeggioFrequency(track.id);'));
  assert.ok(settings.includes('const isTrackBlockedDuringVoicePreview = (isEssenciaLuminosa && isTestingVoice) || isStyle2SolfeggioBlocked || isNaturalSerenoSolfeggioBlocked;'));
  assert.ok(settings.includes('disabled={isTrackBlockedDuringVoicePreview}'));
  assert.ok(settings.includes('if (isTrackBlockedDuringVoicePreview) return;'));
  assert.ok(policy.includes('export function isSolfeggioFrequency(bgMusicType: string): boolean'));
});

test('Arcanjo no Natural Sereno usa superfícies marfim/café sem recolorir os chakras', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #arcanjo-protocol-view .ep-forest-panel'));
  assert.ok(css.includes('background:linear-gradient(145deg,#FFFDF8,#F3E8D5)!important'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #arcanjo-protocol-view [class*="bg-[#021b13]"]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #arcanjo-protocol-view [class*="from-[#021b13]"]'));
  assert.ok(arcanjo.includes('config.corSecundaria'));
  assert.ok(arcanjo.includes('background:`radial-gradient(circle,${config.corSecundaria}cc'));
  assert.ok(!/^\s*#arcanjo-protocol-view/m.test(css), 'A correção deve permanecer exclusiva do Natural Sereno.');
});


test('o acesso permanece neutro até a escolha explícita e o Natural Sereno não vaza para a pré-seleção', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const base = read('src/natural-sereno.css');
  const refinement = read('src/natural-sereno-refinement.css');
  const profile = read('src/components/ProfileSetup.tsx');
  const theme = read('src/approved-theme.css');
  const main = read('src/main.tsx');

  assert.ok(profile.includes('className="ep-auth-prestyle min-h-dvh'));
  assert.ok(!profile.includes('ep-auth-style-one'));
  assert.ok(theme.includes('#profile-setup-view.ep-auth-prestyle'));
  assert.ok(!theme.includes('#profile-setup-view.ep-auth-prestyle .ep-auth-nature-bg{background-image:url'));
  assert.ok(!base.includes('#profile-setup-view.ep-auth-style-one'));
  assert.ok(!css.includes('#profile-setup-view.ep-auth-style-one'));
  assert.ok(!refinement.includes('#profile-setup-view.ep-auth-style-one'));
  assert.ok(css.includes('.ns-app :is(button,a).ns-gold'));
  assert.ok(css.includes('.ns-welcome-brand'));
  assert.ok(css.includes('.ep-care-onboarding-card .ep-brand-signature'));
  assert.ok(main.indexOf("import './natural-sereno-approved-overrides.css';") > main.indexOf("import './natural-sereno.css';"));
});

test('tokens compartilhados do Natural Sereno usam marfim, café, dourado refinado e sálvia', () => {
  const theme = read('src/approved-theme.css');
  const start = theme.indexOf(':root[data-layout="natural-sereno"]{');
  const end = theme.indexOf('\\n}', start);
  assert.ok(start >= 0 && end > start, 'bloco de tokens exclusivo do Natural Sereno ausente');
  const tokens = theme.slice(start, end);
  for (const approved of [
    '--layout-canvas:#FAF7F2;',
    '--layout-canvas-alt:#E8E0D5;',
    '--layout-accent:#6F7B55;',
    '--layout-accent-light:#8A9670;',
    '--layout-gold:#C89D52;',
    '--layout-gold-light:#E2B96B;',
    '--layout-gold-dark:#A87E37;',
    '--layout-text:#2A2421;',
    '--layout-text-secondary:#6B625B;',
    '--layout-text-muted:#85786C;'
  ]) {
    assert.ok(tokens.includes(approved), `token Natural Sereno divergente: ${approved}`);
  }
  assert.ok(!tokens.includes('#2D4A3E'), 'não pode reintroduzir verde-floresta como acento estrutural');
  assert.ok(!tokens.includes('#202D24'), 'o texto estrutural deve permanecer café, não verde');
});
