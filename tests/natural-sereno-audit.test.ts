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
  assert.equal((main.match(/import '\.\/natural-sereno-approved-overrides\.css'/g) || []).length, 1);
  assert.ok(css.includes(':root[data-layout="natural-sereno"] :is(#astral-map-modal,#numerology-modal) div[class*="bg-[#073b2b]"]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #herbal-baths-modal button[class*="bg-[#073b2b]"]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #hooponopono-modal [role="tab"][aria-selected="true"]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #admin-panel-modal :is(button,a)[class*="bg-emerald"]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] :is(#settings-view,#audio-settings-modal,#mobile-install-modal,#achievements-modal,#journal-dashboard-view) button[class~="bg-[#B88736]"]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #daily-diary-modal :is(div,span)[class*="bg-[#B88736]/"]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #admin-panel-modal button[type="submit"]'));
  assert.ok(css.includes('#specific-treatment-modal div[class*="bg-gradient"]:not(.pointer-events-none):not(.absolute)'));
  assert.ok(css.includes('#specific-treatment-modal .relative > .absolute[class*="bg-gradient-to-t"]'));
  assert.ok(css.includes('rgba(250,247,242,.90)'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] [data-ns-pix-card]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #anamnesis-modal > div'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #anamnesis-modal :is(button,a)[class*="bg-emerald-"]'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #anamnesis-modal .ep-anamnesis-progress-fill'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #anamnesis-modal .ep-anamnesis-frequency'));
  assert.ok(css.includes("url('/brand/natural-sereno/acolhimento.webp')"));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] .ns-app .ns-gold {\n  border-radius: 18px !important;'));
  assert.ok(!css.includes('#profile-setup-view.ep-auth-prestyle'), 'cadastro e login permanecem neutros até a escolha explícita do estilo');
  assert.ok(!css.includes('#profile-setup-view.ep-auth-style-one'));
});

test('o logo permanece como assinatura discreta e o Diário conserva superfícies claras', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const diary = read('src/components/DailyDiaryModal.tsx');

  assert.ok(css.includes('#main-header .ep-brand-signature { opacity:.30!important'));
  assert.ok(css.includes('#main-header .ep-brand-signature { opacity:.26!important'));
  assert.ok(diary.includes('id="daily-diary-modal"'));
  const app = read('src/App.tsx');
  assert.ok(app.includes('onSaveEntry={handleSaveDiaryDay}'));
  assert.ok(app.includes('saveProgress(updatedProgress)'), 'a anotação do Diário é persistida no progresso e sincronizada');
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
  assert.ok(app.includes('voiceId={userProfile.voiceId}'), 'o player recebe a voz neural salva no perfil');
  assert.ok(session.includes('const selectedVoiceId = voiceId?.trim();'));
  assert.ok(session.includes('const savedVoiceId = isElevenLabsVoiceId(selectedVoiceId) ? selectedVoiceId : OFFICIAL_PROTOCOL_VOICE_ID;'));
  const audio = read('src/lib/audio.ts');
  const streamStart = audio.indexOf('public async playProtocolStageStream(');
  const streamEnd = audio.indexOf('\n  public ', streamStart + 1);
  const protocolStream = audio.slice(streamStart, streamEnd > streamStart ? streamEnd : undefined);
  assert.ok(protocolStream.includes("fetch('/api/tts/stream'"));
  assert.ok(protocolStream.includes('if (errorData.fallbackToSpeechSynthesis)'));
  assert.ok(!protocolStream.includes('speechSynthesis.speak'), 'o player não troca silenciosamente para voz robótica do navegador');
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
  assert.ok(session.includes('const NATURAL_SERENO_CANVAS_THEME = {'));
  assert.ok(session.includes('colorTheme={isNaturalSereno ? NATURAL_SERENO_CANVAS_THEME'));
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
  assert.ok(routes.includes("productType === 'numerology_full'"));
  assert.ok(routes.includes('numerologyPurchased: true'));
  assert.ok(routes.includes("provider('/payment_check'"));
  assert.ok(routes.includes('verified.success !== true || verified.paid !== true || verified.amount !== order.cents'));
});


test('o modelo legado da Home conserva a lógica, mas não mantém superfícies verde-floresta ou amarelo saturado', () => {
  const model = read('src/lib/naturalSerenoHomeApprovedModel.ts');
  assert.ok(model.includes('function applyHomeModel()'));
  assert.ok(model.includes('function addQuickLinks('));
  for (const discarded of ['background: #073b2b', 'rgba(7,59,43', '#fff9e8', '#f7e5aa', '#ead394', '#052f22', 'rgba(3,31,22', 'rgba(246,223,154']) {
    assert.ok(!model.includes(discarded), `herança visual antiga ainda presente: ${discarded}`);
  }
  assert.ok(model.includes('#FAF7F2'));
  assert.ok(model.includes('#C89D52'));
  assert.ok(model.includes('rgba(67,52,39,.12)'));
  assert.ok(model.includes('rgba(200,157,82,.34)'));
});

test('as camadas aprovadas de marcos, guias, contato e diário estão carregadas antes do override final', () => {
  const main = read('src/main.tsx');
  const milestone = read('src/natural-sereno-milestone-audit.css');
  const guides = read('src/natural-sereno-guides-semantic-audit.css');
  const contact = read('src/natural-sereno-contact-audit.css');
  const journal = read('src/natural-sereno-journal-dashboard-audit.css');
  for (const stylesheet of [
    'natural-sereno-milestone-audit.css',
    'natural-sereno-guides-semantic-audit.css',
    'natural-sereno-contact-audit.css',
    'natural-sereno-journal-dashboard-audit.css',
    'natural-sereno-approved-overrides.css'
  ]) assert.ok(main.includes(`import './${stylesheet}'`), `camada ausente: ${stylesheet}`);
  assert.ok(milestone.includes('[aria-label="Celebração de progresso"] a.bg-emerald-600'));
  assert.ok(guides.includes('#herbal-baths-modal'));
  assert.ok(contact.includes('#contact-us-modal'));
  assert.ok(journal.includes('#journal-dashboard-view'));
});

test('a recuperação do checkout Numerologia repete o mesmo pedido sem criar nova cobrança', () => {
  const routes = read('src/lib/paymentRoutes.ts');
  assert.ok(routes.includes('candidate.checkoutUrl === saved.checkoutUrl'));
  assert.ok((routes.match(/candidate\.checkoutPayload\?\.options\?\.single_payment === true/g) || []).length >= 2, 'cache e reutilização só aceitam links de pagamento único');
  assert.ok(routes.includes('checkoutPayload?: InfinitePayCheckoutPayload'));
  assert.ok(routes.includes('options: { single_payment: true }'));
  assert.ok(routes.includes("headers['X-Api-Key'] = key"));
  assert.ok(routes.includes("if (!apiKey()) return res.status(503)"));
  assert.ok(routes.includes('createCheckoutUrl(preparingOrder.checkoutPayload)'));
  assert.ok(routes.includes('preparingOrder.checkoutPayload.order_nsu !== preparingOrder.id'));
  assert.ok(routes.includes('candidate.checkoutPayload?.options?.single_payment === true'));
  assert.ok(routes.includes('candidate.checkoutPayload?.options?.single_payment !== true'));
  assert.ok(routes.includes('reused: true, recovered: true'));
  assert.ok(routes.includes("productType !== 'numerology_full'"));
  assert.ok(routes.includes("https://api.checkout.infinitepay.io"));
  assert.ok(!routes.includes('NUMEROLOGY_PENDING_CHECKOUT_STALE_MS'));
  assert.ok(!routes.includes('staleOrder.failedAt = failedAt'));
});
