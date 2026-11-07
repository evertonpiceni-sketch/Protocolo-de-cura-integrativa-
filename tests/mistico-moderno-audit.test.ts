import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('o seletor mostra a prancha oficial do Místico Moderno e exige escolha explícita', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const board = read('public/brand/mistico-moderno/prancha-oficial.svg');
  const app = read('src/App.tsx');
  const layouts = read('src/config/layouts.ts');

  assert.ok(modal.includes('/brand/mistico-moderno/prancha-oficial.svg'));
  assert.ok(board.includes('data:image/webp;base64,'));
  const payload = board.match(/data:image\/webp;base64,([A-Za-z0-9+/=]+)"/)?.[1] ?? '';
  assert.ok(payload.length > 0 && payload.length % 4 === 0);
  const webp = Buffer.from(payload, 'base64');
  assert.equal(webp.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(webp.subarray(8, 12).toString('ascii'), 'WEBP');

  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(layouts.includes("swatches: ['#07111F', '#26355F', '#0D3B35', '#6C3FA0']"));
  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false)'));
  assert.ok(app.includes('{(!layoutConfirmedThisSession || layoutChoiceRequested) && ('));
  assert.ok(app.includes('setLayoutConfirmedThisSession(false)'));
  assert.ok(app.includes('setLayoutChoiceRequested(false)'));
  assert.ok(app.includes("document.documentElement.removeAttribute('data-layout')"));
});

test('os tokens do Místico Moderno usam azul noturno, índigo, esmeralda, violeta e ouro âmbar', () => {
  const theme = read('src/approved-theme.css');
  const start = theme.indexOf(':root[data-layout="mistico-moderno"]{');
  const end = start >= 0 ? theme.indexOf('\n}', start) : -1;
  const block = start >= 0 && end > start ? theme.slice(start, end) : '';

  assert.ok(block.includes('--layout-canvas:#07111F;'));
  assert.ok(block.includes('--layout-indigo:#26355F;'));
  assert.ok(block.includes('--layout-emerald:#176B5B;'));
  assert.ok(block.includes('--layout-violet:#6C3FA0;'));
  assert.ok(block.includes('--layout-gold:#C89D52;'));
  assert.ok(block.includes('--layout-gold-light:#E2B96B;'));
  assert.ok(block.includes('--layout-gold-dark:#A87E37;'));
  assert.ok(block.includes('--layout-text:#F4F1EB;'));
  assert.ok(!block.includes('#D4AF37'));
  assert.ok(!block.includes('#F2D06B'));
  assert.ok(!block.includes('#A47D1C'));
});

test('o Estilo 4 mantém Marianne — Meditação e não usa voz nativa como substituta', () => {
  const settings = read('src/components/AudioSettingsModal.tsx');
  const voicePatch = read('src/lib/misticoModernoOfficialVoicePatch.ts');
  const audio = read('src/lib/audio.ts');

  assert.ok(audio.includes('mJqP14JQFEK0PojR5lfV'));
  assert.ok(settings.includes("dataset.layout === 'mistico-moderno'"));
  assert.ok(settings.includes('Marianne — Meditação'));
  assert.ok(settings.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(settings.includes('preferElevenLabs: requiresNeuralVoice'));
  assert.ok(settings.includes("voiceId: isMisticoModerno ? (userProfile.voiceId ?? '') : voiceId"));
  assert.ok(settings.includes('const testVoiceId = isMisticoModerno ? OFFICIAL_PROTOCOL_VOICE_ID : voiceId'));

  assert.ok(voicePatch.includes('voiceId: OFFICIAL_PROTOCOL_VOICE_ID'));
  assert.ok(voicePatch.includes('preferElevenLabs: true'));
  assert.ok(voicePatch.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(voicePatch.includes('requireExplicitVoiceId: true'));
});

test('o Arcanjo/Solfeggio usa o tema noturno e bloqueia fallback robótico no Estilo 4', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const css = read('src/mistico-moderno-arcanjo-audit.css');
  const main = read('src/main.tsx');

  assert.ok(arcanjo.includes('id="arcanjo-protocol-view"'));
  assert.ok(arcanjo.includes('if (isEleganciaProfunda || isMisticoModerno)'));
  assert.ok(arcanjo.includes('voiceId: isMisticoModerno'));
  assert.ok(arcanjo.includes('requireExplicitVoiceId: isEleganciaProfunda || isMisticoModerno'));
  assert.ok(arcanjo.includes('Marianne — Meditação'));
  assert.ok(css.includes(':root[data-layout="mistico-moderno"] #arcanjo-protocol-view'));
  assert.ok(css.includes('#07111F'));
  assert.ok(css.includes('#C89D52'));
  assert.ok(main.includes("import './mistico-moderno-arcanjo-audit.css'"));
});

test('o player usa paleta própria e intensidade luminosa reduzida no Místico Moderno', () => {
  const session = read('src/components/MeditationSession.tsx');
  const canvas = read('src/components/session/SacredEnergyCanvas.tsx');
  const css = read('src/mistico-moderno-session-audit.css');

  assert.ok(session.includes('MISTICO_MODERNO_CANVAS_THEME'));
  assert.ok(session.includes('colorTheme={isMisticoModerno ? MISTICO_MODERNO_CANVAS_THEME'));
  assert.ok(session.includes("accent: '#176B5B'"));
  assert.ok(canvas.includes('Místico Moderno pass explicit palettes'));
  assert.ok(css.includes('opacity:.62'));
});

test('Solfeggio mantém frequências exatas e o protocolo assume a propriedade do áudio', () => {
  const tone = read('src/lib/solfeggioTone.ts');
  const integrity = read('src/lib/audioIntegrityPatch.ts');
  const policy = read('src/lib/protocolSessionAudioPolicy.ts');
  const ownership = read('src/lib/arcanjoAudioOwnershipPatch.ts');
  const app = read('src/App.tsx');

  assert.ok(tone.includes('new Set([396, 417, 432, 528, 639, 741, 852, 963])'));
  assert.ok(integrity.includes('/^(396|417|432|528|639|741|852|963)hz$/i'));
  assert.ok(policy.includes('shouldPlayProtocolSessionBackground'));
  assert.ok(ownership.includes('audioEngine.stopBG()'));
  assert.ok(app.includes('!showArcanjoView'));
});

test('Diário e histórico permanecem isolados no Místico Moderno', () => {
  const main = read('src/main.tsx');
  const daily = read('src/components/DailyDiaryModal.tsx');
  const journal = read('src/components/JournalLog.tsx');
  const dailyCss = read('src/mistico-moderno-daily-diary-audit.css');
  const journalCss = read('src/mistico-moderno-journal-audit.css');

  assert.ok(daily.includes('id="daily-diary-modal"'));
  assert.ok(journal.includes('id="journal-dashboard-view"'));
  assert.ok(main.includes("import './mistico-moderno-daily-diary-audit.css'"));
  assert.ok(main.includes("import './mistico-moderno-journal-audit.css'"));
  assert.ok(dailyCss.includes('html[data-layout="mistico-moderno"] #daily-diary-modal'));
  assert.ok(journalCss.includes(':root[data-layout="mistico-moderno"] #journal-dashboard-view'));
});

test('pagamentos continuam no checkout InfinitePay sem chave PIX manual', () => {
  const specific = read('src/components/SpecificTreatmentModal.tsx');
  const numerology = read('src/components/NumerologyModal.tsx');
  const paymentRoutes = read('src/lib/paymentRoutes.ts');
  const paymentTests = read('tests/payment.test.ts');

  assert.ok(specific.includes('/api/payment/create-checkout'));
  assert.ok(specific.includes('PIX pelo checkout seguro da InfinitePay'));
  assert.ok(!/handleCopyPix|pixKey|chavePix/.test(specific));
  assert.ok(numerology.includes('/api/payment/create-checkout'));
  assert.ok(numerology.includes('Nenhuma chave PIX manual é exibida'));
  assert.ok(paymentRoutes.includes('https://api.infinitepay.io/invoices/public/checkout'));
  assert.ok(paymentRoutes.includes("checkout.infinitepay.io"));
  assert.ok(paymentRoutes.includes("req.body?.couponCode !== 'VIP7'"));
  assert.ok(paymentTests.includes('PROMO15'));
  assert.ok(paymentTests.includes('PROMO20'));
});

test('as camadas antigas de confirmação não são importadas e o logo continua discreto', () => {
  const main = read('src/main.tsx');
  const headerCss = read('src/mistico-moderno-header-audit.css');
  const approvedCss = read('src/mistico-moderno-approved-overrides.css');
  const app = read('src/App.tsx');

  assert.ok(!main.includes('layoutSettingsExplicitConfirmationPatch'));
  assert.ok(app.includes("import('./components/OnboardingFlow')"));
  assert.ok(headerCss.includes('.ep-brand-signature'));
  assert.ok(headerCss.includes('opacity:.28'));
  assert.ok(approvedCss.includes('data-layout="mistico-moderno"'));
});
