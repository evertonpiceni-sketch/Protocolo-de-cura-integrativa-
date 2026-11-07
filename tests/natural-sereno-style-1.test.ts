import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('o seletor Natural Sereno exige escolha explícita entre os quatro estilos', () => {
  const app = read('src/App.tsx');
  const chooser = read('src/components/LayoutChoiceModal.tsx');
  const layouts = read('src/config/layouts.ts');
  const entry = read('src/main.tsx');

  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false);'));
  assert.ok(app.includes('(!layoutConfirmedThisSession || layoutChoiceRequested)'));
  for (const label of ['Natural Sereno', 'Elegância Profunda', 'Essência Luminosa', 'Místico Moderno']) {
    assert.ok(layouts.includes(label), label);
  }
  assert.ok(entry.includes('The React LayoutChoiceModal in App.tsx is the single authoritative chooser.'));
  assert.ok(!entry.includes('legacyLayoutChooser'));
});

test('o player Natural Sereno usa creme, café e dourado, mantendo a paisagem e a animação', () => {
  const mobile = read('src/natural-sereno-mobile-fixes.css');
  const start = mobile.indexOf(':root[data-layout="natural-sereno"] #meditation-session[data-session-phase="playing"] .ep-session-backdrop {');
  const end = mobile.indexOf('\n@media', start);
  assert.ok(start >= 0 && end > start);
  const player = mobile.slice(start, end);
  assert.ok(!player.includes('rgba(3,26,19'));
  assert.ok(!player.includes('rgba(5,38,28'));
  assert.ok(player.includes('rgba(250,247,242'));

  const approved = read('src/natural-sereno-approved-overrides.css');
  assert.ok(approved.includes('.ep-session-backdrop::before'));
  assert.ok(approved.includes('rgba(250,247,242,.34)'));
  assert.ok(approved.includes('canvas {\n  opacity: .38 !important;'));
  assert.ok(mobile.includes('ns-journey-presence'));
});

test('a animação do canvas usa a paleta aprovada do Natural Sereno', () => {
  const session = read('src/components/MeditationSession.tsx');
  const canvas = read('src/components/session/SacredEnergyCanvas.tsx');
  assert.ok(session.includes('const NATURAL_SERENO_CANVAS_THEME = {'));
  assert.ok(session.includes("glow: '#C89D52'"));
  assert.ok(session.includes("accent: '#6B7A4B'"));
  assert.ok(session.includes('colorTheme={isNaturalSereno ? NATURAL_SERENO_CANVAS_THEME'));
  assert.ok(canvas.includes('Natural Sereno, Elegância Profunda and Essência Luminosa pass explicit palettes'));
});

test('a voz neural do Natural Sereno não cai silenciosamente para SpeechSynthesis', () => {
  const entry = read('src/main.tsx');
  const voicePatch = read('src/lib/naturalSerenoOfficialVoicePatch.ts');
  const audio = read('src/lib/audio.ts');
  assert.ok(entry.includes("import './lib/naturalSerenoOfficialVoicePatch';"));
  assert.ok(voicePatch.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(voicePatch.includes('isElevenLabsVoiceId'));
  assert.ok(audio.includes('OFFICIAL_PROTOCOL_VOICE_ID'));
});

test('Diário e pagamento continuam escopados e sem chave PIX manual', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const specific = read('src/components/SpecificTreatmentModal.tsx');
  const numerology = read('src/components/NumerologyModal.tsx');
  const routes = read('src/lib/paymentRoutes.ts');

  assert.ok(css.includes('#daily-diary-modal'));
  assert.ok(css.includes('#specific-treatment-modal'));
  assert.ok(specific.includes('/api/payment/create-checkout'));
  assert.ok(numerology.includes('/api/payment/create-checkout'));
  assert.ok(!specific.includes('handleCopyPix'));
  assert.ok(!numerology.includes('handleCopyPix'));
  assert.ok(!specific.includes('evertonpiceni@gmail.com'));
  assert.ok(!numerology.includes('evertonpiceni@gmail.com'));
  assert.ok(routes.includes('https://api.infinitepay.io/invoices/public/checkout'));
});


test('Home e Comunidade preservam paisagens reais com véu creme e recorte responsivo', () => {
  const home = read('src/natural-sereno-home-surface-audit.css');
  const appCss = read('src/natural-sereno.css');
  const entry = read('src/main.tsx');

  assert.ok(home.includes('var(--ns-valley)'));
  assert.ok(home.includes('@media (min-width:768px)'));
  assert.ok(home.includes('@media (max-width:767px)'));
  assert.ok(home.includes('rgba(250,247,242,.96)'));
  assert.ok(appCss.includes('.ns-app[data-ns-screen="community"] { color: #2A2421; background: var(--ns-waterfall)'));
  assert.ok(appCss.includes('.ns-app[data-ns-screen="community"]::before { background: rgba(250,247,242,.88);'));
  assert.ok(entry.includes("import './natural-sereno-home-surface-audit.css';"));
});

test('logo e superfícies secundárias mantêm a assinatura discreta e os acentos dourado/sálvia', () => {
  const approved = read('src/natural-sereno-approved-overrides.css');
  assert.ok(approved.includes('#auth-loading-view img[alt="Everton Piceni"] { opacity:.24!important;'));
  for (const selector of ['#numerology-modal', '#astral-map-modal', '#hooponopono-modal', '#mobile-install-modal', '#achievements-modal']) {
    assert.ok(approved.includes(selector), selector);
  }
});


test('Natural Sereno preserves the Maiara choice without Marianne or browser fallback', () => {
  const app = read('src/App.tsx');
  const session = read('src/components/MeditationSession.tsx');
  const voicePatch = read('src/lib/naturalSerenoOfficialVoicePatch.ts');
  const voiceSelection = read('src/lib/voiceSelection.ts');

  assert.ok(app.includes('isNaturalSerenoVoiceId(savedNeuralVoiceId)'));
  assert.ok(session.includes("activeLayout === 'natural-sereno' && !naturalSerenoVoiceId"));
  assert.ok(voicePatch.includes('requireExplicitVoiceId: true'));
  assert.ok(voicePatch.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(voicePatch.includes('isNaturalSerenoVoiceId'));
  assert.ok(!voicePatch.includes('OFFICIAL_PROTOCOL_VOICE_ID'));
  assert.ok(voiceSelection.includes('mJqP14JQFEK0PojR5lfV'));
});

test('Natural Sereno welcome uses a real landscape, a light surface and a subtle logo', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  assert.ok(css.includes("url('/brand/natural-sereno/acolhimento.webp')"));
  assert.ok(css.includes('background-color: #FAF7F2 !important;'));
  assert.ok(css.includes('.ns-welcome-brand {\n  opacity: .28 !important;'));
  assert.ok(css.includes('#admin-panel-modal :is(button,a)[class*="bg-emerald"]'));
  assert.ok(css.includes('.ns-app .ns-gold {\n  border-radius: 18px !important;'));
});


test('a prévia feminina do cadastro não usa Rachel nem síntese do navegador', () => {
  const setup = read('src/components/ProfileSetup.tsx');
  assert.ok(setup.includes('Maiara — voz feminina brasileira'));
  assert.ok(setup.includes('Configurar após entrar'));
  assert.ok(!setup.includes("voiceId: 'Rachel'"));
  assert.ok(!setup.includes('SpeechSynthesisUtterance'));
  assert.ok(!setup.includes('speechSynthesis.speak'));
  assert.ok(setup.includes('voicePreviewMessage'));
});

test('a Home Natural Sereno não substitui Maiara por Marianne', () => {
  const home = read('src/components/TransformationHome.tsx');
  assert.ok(home.includes('isNaturalSerenoVoiceId(savedVoiceId)'));
  assert.ok(home.includes("? (isNaturalSerenoVoiceId(savedVoiceId) ? savedVoiceId : '')"));
});
