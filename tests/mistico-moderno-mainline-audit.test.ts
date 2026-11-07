import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { shouldPlayProtocolSessionBackground } from '../src/lib/protocolSessionAudioPolicy';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('Místico Moderno uses its official board in a dedicated night card', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const board = read('public/brand/mistico-moderno/prancha-oficial.svg');
  const layouts = read('src/config/layouts.ts');
  assert.ok(modal.includes("const MISTICO_MODERNO_OFFICIAL_BOARD = '/brand/mistico-moderno/prancha-oficial.svg'"));
  assert.ok(modal.includes('src={MISTICO_MODERNO_OFFICIAL_BOARD}'));
  assert.ok(modal.includes('bg-[#07111F]'));
  assert.ok(modal.includes('text-[#F4F1EB]'));
  assert.ok(board.includes('aria-label="Prancha oficial do Estilo 4'));
  assert.ok(board.includes('data:image/webp;base64,'));
  const payload = board.match(/data:image\\/webp;base64,([A-Za-z0-9+/=]+)"/)?.[1] ?? '';
  assert.ok(payload.length > 0 && payload.length % 4 === 0);
  const webp = Buffer.from(payload, 'base64');
  assert.equal(webp.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(webp.subarray(8, 12).toString('ascii'), 'WEBP');
  assert.ok(layouts.includes("swatches: ['#07111F', '#26355F', '#C89D52', '#6C3FA0']"));
});

test('the four-style chooser does not auto-open or auto-apply on login', () => {
  const app = read('src/App.tsx');
  const modal = read('src/components/LayoutChoiceModal.tsx');
  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false)'));
  assert.ok(app.includes('{layoutChoiceRequested && userProfile && ('));
  assert.ok(!app.includes('(!layoutConfirmedThisSession || layoutChoiceRequested)'));
  assert.ok(app.includes('onClick={() => setLayoutChoiceRequested(true)}'));
  assert.ok(app.includes('layoutConfirmedThisSession && isLayoutId(userProfile.visualLayout)'));
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(app.includes('setLayoutConfirmedThisSession(true)'));
  assert.ok(app.includes('delete document.documentElement.dataset.layout'));
});

test('Style 4 keeps the saved neural voice in Home, settings, player and Arcanjo', () => {
  const app = read('src/App.tsx');
  const home = read('src/components/TransformationHome.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const session = read('src/components/MeditationSession.tsx');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const patch = read('src/lib/misticoModernoOfficialVoicePatch.ts');
  assert.ok(app.includes("userProfile?.visualLayout === 'mistico-moderno'"));
  assert.ok(app.includes('usesNeuralVoiceCatalog = isEleganciaProfunda || isEssenciaLuminosa || isMisticoModerno'));
  assert.ok(home.includes('const isMisticoModerno = props.visualLayout === \'mistico-moderno\''));
  assert.ok(home.includes('const approvedVoiceId = isEleganciaProfunda || isMisticoModerno'));
  assert.ok(home.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(settings.includes("dataset.layout === 'mistico-moderno'"));
  assert.ok(settings.includes('requiresNeuralVoice = isEleganciaProfunda || isEssenciaLuminosa || isMisticoModerno'));
  assert.ok(settings.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(settings.includes('useEffect(() => {'));
  assert.ok(session.includes("activeLayout === 'mistico-moderno'"));
  assert.ok(session.includes('style4VoiceId'));
  assert.ok(session.includes('MISTICO_MODERNO_CANVAS_THEME'));
  assert.ok(arcanjo.includes("dataset.layout === 'mistico-moderno'"));
  assert.ok(arcanjo.includes('requireExplicitVoiceId: isEleganciaProfunda || isMisticoModerno'));
  assert.ok(arcanjo.includes('voiceId: isEleganciaProfunda || isMisticoModerno'));
  assert.ok(patch.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(patch.includes('requireExplicitVoiceId: true'));
  assert.ok(!patch.includes('OFFICIAL_PROTOCOL_VOICE_ID'));
  assert.ok(!patch.includes("voiceId === 'Rachel'"));
});

test('Solfeggio ownership and the Diary remain controlled', () => {
  const app = read('src/App.tsx');
  const main = read('src/main.tsx');
  const diary = read('src/mistico-moderno-daily-diary-audit.css');
  const journal = read('src/mistico-moderno-journal-audit.css');
  assert.equal(shouldPlayProtocolSessionBackground('playing', '528hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', '432hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', 'waves'), true);
  assert.ok(main.includes("import './lib/arcanjoAudioOwnershipPatch';"));
  assert.ok(app.includes('const [showDailyDiaryModal, setShowDailyDiaryModal] = useState<boolean>(false)'));
  assert.ok(app.includes('const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false)'));
  assert.ok(diary.includes('[class*="bg-emerald-50"]'));
  assert.ok(diary.includes('rgba(23,107,91,.16)'));
  assert.ok(journal.includes('rgba(23, 107, 91, .32)'));
  assert.ok(!journal.includes('#A9E2CF'));
});

test('all Style 4 CSS modules stay scoped to the selected layout', () => {
  const main = read('src/main.tsx');
  const imports = [...main.matchAll(/import '\.\/(mistico-moderno-[^']+\.css)';/g)].map(match => match[1]);
  assert.ok(imports.length >= 23, `Expected the 22 existing modules plus Arcanjo; found ${imports.length}.`);
  for (const filename of imports) {
    const css = read(`src/${filename}`).replace(/\\/\\*[\\s\\S]*?\\*\\//g, '');
    const selectors = [...css.matchAll(/([^{}]+)\\{/g)]
      .map(match => match[1].trim().replace(/\\s+/g, ' '))
      .filter(selector => selector && !selector.startsWith('@') && !/^(from|to|\\d+%)/.test(selector));
    const unscoped = selectors.filter(selector => !selector.includes('data-layout="mistico-moderno"'));
    assert.deepEqual(unscoped, [], `${filename} contains a selector outside the Style 4 scope.`);
  }
});

test('Diary and Arcanjo are not left with a bright inherited surface', () => {
  const diary = read('src/mistico-moderno-daily-diary-audit.css');
  const arcanjo = read('src/mistico-moderno-arcanjo-audit.css');
  assert.ok(diary.includes('html[data-layout="mistico-moderno"] #daily-diary-modal'));
  assert.ok(arcanjo.includes(':root[data-layout="mistico-moderno"] #arcanjo-protocol-view'));
  assert.ok(arcanjo.includes('#07111F'));
  assert.ok(arcanjo.includes('#C89D52'));
});

test('payments keep InfinitePay checkout and no manual PIX key', () => {
  const specific = read('src/components/SpecificTreatmentModal.tsx');
  const numerology = read('src/components/NumerologyModal.tsx');
  const routes = read('src/lib/paymentRoutes.ts');
  const app = read('src/App.tsx');
  assert.ok(specific.includes('/api/payment/create-checkout'));
  assert.ok(numerology.includes('/api/payment/create-checkout'));
  assert.ok(!specific.includes('handleCopyPix'));
  assert.ok(!numerology.includes('handleCopyPix'));
  assert.ok(!specific.includes('evertonpiceni@gmail.com'));
  assert.ok(!numerology.includes('evertonpiceni@gmail.com'));
  assert.ok(routes.includes('https://api.infinitepay.io/invoices/public/checkout'));
  assert.ok(app.includes('/api/payment/confirm'));
});
