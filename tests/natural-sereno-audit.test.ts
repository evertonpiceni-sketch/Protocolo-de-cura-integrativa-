import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('o seletor mostra a prancha oficial e usa preferência apenas como pré-seleção', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const app = read('src/App.tsx');
  const board = 'docs/visual-qa/natural-sereno/reference.jpg';

  assert.ok(fs.existsSync(board));
  assert.ok(fs.statSync(board).size > 10000);
  assert.ok(modal.includes('docs/visual-qa/natural-sereno/reference.jpg'));
  assert.ok(modal.includes('initialLayout?: LayoutId | null'));
  assert.ok(modal.includes('useState<LayoutId | null>(initialLayout ?? null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(modal.includes('O estilo só será aplicado depois da sua confirmação.'));
  assert.ok(app.includes('layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false)'));
  assert.ok(app.includes('layoutChoiceInitialSelection ?? (isLayoutId(userProfile.visualLayout) ? userProfile.visualLayout : null)'));
  assert.ok(app.includes('setLayoutChoiceInitialSelection(layout.id); setLayoutChoiceRequested(true)'));
  assert.ok(app.includes('delete document.documentElement.dataset.layout'));
});

test('Natural Sereno usa a voz neural aprovada e não recorre à voz robótica do dispositivo', () => {
  const app = read('src/App.tsx');
  const home = read('src/components/TransformationHome.tsx');
  const session = read('src/components/MeditationSession.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const patch = read('src/lib/naturalSerenoOfficialVoicePatch.ts');
  const audio = read('src/lib/audio.ts');

  assert.ok(audio.includes("export const OFFICIAL_PROTOCOL_VOICE_ID = 'mJqP14JQFEK0PojR5lfV'"));
  assert.ok(app.includes('const usesNeuralVoiceCatalog = isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa;'));
  assert.ok(home.includes("props.visualLayout === 'natural-sereno'"));
  assert.ok(home.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(session.includes("voiceId: activeLayout === 'natural-sereno'\n        ? savedVoiceId"));
  assert.ok(settings.includes('const requiresNeuralVoice = isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa;'));
  assert.ok(settings.includes('(isNaturalSereno || isEssenciaLuminosa) && !isElevenLabsVoiceId(savedVoiceId)'));
  assert.ok(settings.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(patch.includes('!isElevenLabsVoiceId(voiceId) ? OFFICIAL_PROTOCOL_VOICE_ID : voiceId'));
  assert.ok(patch.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(patch.includes('requireExplicitVoiceId: true'));
});

test('Solfeggio mantém posse exclusiva do áudio durante Arcanjo', () => {
  const app = read('src/App.tsx');
  const main = read('src/main.tsx');
  assert.ok((app.match(/!showArcanjoView/g) || []).length >= 2);
  assert.ok(app.includes('showArcanjoView,'));
  assert.ok(main.includes("import './lib/arcanjoAudioOwnershipPatch'"));
});

test('Diário, player e paisagens mantêm as correções restritas ao Natural Sereno', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #daily-diary-modal'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #meditation-session.ep-session'));
  assert.ok(css.includes('background-position: center, center 48%'));
  assert.ok(css.includes('@media (min-width: 900px)'));
  assert.ok(css.includes('opacity:.30!important'));
  assert.ok(css.includes('opacity:.26!important'));
});

test('Prática Individual e Numerologia usam checkout InfinitePay sem PIX manual', () => {
  const routes = read('src/lib/paymentRoutes.ts');
  const specific = read('src/components/SpecificTreatmentModal.tsx');
  const numerology = read('src/components/NumerologyModal.tsx');
  assert.ok(routes.includes('https://api.infinitepay.io/invoices/public/checkout'));
  assert.ok(routes.includes("router.post('/payment/create-checkout'"));
  assert.ok(specific.includes('/api/payment/create-checkout'));
  assert.ok(numerology.includes('/api/payment/create-checkout'));
  assert.ok(!specific.includes('handleCopyPix'));
  assert.ok(!specific.includes('navigator.clipboard.writeText'));
  assert.ok(!numerology.includes('handleCopyPix'));
  assert.ok(!numerology.includes('navigator.clipboard.writeText'));
});
