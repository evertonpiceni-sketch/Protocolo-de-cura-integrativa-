import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('o seletor usa a prancha oficial do Estilo 2 e exige confirmação explícita', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const board = read('public/brand/elegancia-profunda/prancha-oficial.svg');
  const app = read('src/App.tsx');
  assert.ok(modal.includes('/brand/elegancia-profunda/prancha-oficial.svg'));
  assert.ok(board.includes('width="240" height="180"'));
  assert.ok(board.includes('data:image/webp;base64,'));
  const payload = board.match(/data:image\/webp;base64,([A-Za-z0-9+/=]+)"/)?.[1] ?? '';
  assert.ok(payload.length > 0 && payload.length % 4 === 0, 'A prévia oficial deve conter base64 completo.');
  const webp = Buffer.from(payload, 'base64');
  assert.equal(webp.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(webp.subarray(8, 12).toString('ascii'), 'WEBP');
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false)'));
  assert.ok(app.includes('{(!layoutConfirmedThisSession || layoutChoiceRequested) && ('));
});

test('o modal de prática individual mantém foco acessível também no Estilo 2', () => {
  const modal = read('src/components/SpecificTreatmentModal.tsx');
  assert.ok(modal.includes('useDialogFocus(isOpen, dialogRef, onClose)'));
  assert.ok(!modal.includes("dataset.layout === 'natural-sereno'"));
});

test('a entrada ativa usa OnboardingFlow e recebe tratamento visual isolado do Estilo 2', () => {
  const app = read('src/App.tsx');
  const onboarding = read('src/components/OnboardingFlow.tsx');
  const css = read('src/elegancia-profunda-approved-overrides.css');
  assert.ok(app.includes("import('./components/OnboardingFlow')"));
  assert.ok(app.includes('<OnboardingFlow'));
  assert.ok(onboarding.includes('ep-care-onboarding'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] .ep-care-onboarding'));
  assert.ok(css.includes('--ep-scene:none'));
  assert.ok(!css.includes('var(--ep-scene)'));
});

test('o logo permanece assinatura transparente sem opacidade dupla', () => {
  const css = read('src/elegancia-profunda-approved-overrides.css');
  assert.match(css, /\.ep-brand-signature-wrap \{\s*opacity:1!important;\s*background:transparent!important;/);
  assert.match(css, /\.ep-brand-signature\s*,[\s\S]*?opacity:\.30\s*!important/);
  assert.match(css, /#main-header div:has\(> \.ep-brand-signature\)[^\n]*background:transparent!important/);
});

test('os presets Solfeggio continuam usando o oscilador exato e não dependem de mapas MP3 legados', () => {
  const app = read('src/App.tsx');
  const integrity = read('src/lib/audioIntegrityPatch.ts');
  const tone = read('src/lib/solfeggioTone.ts');
  assert.ok(!app.includes('BG_TRACKS'));
  assert.ok(integrity.includes('solfeggioTone.start(Number(match[1])'));
  assert.ok(tone.includes('oscillator.frequency.setValueAtTime(frequency'));
});

test('o pagamento continua no checkout InfinitePay sem cópia manual de PIX', () => {
  const routes = read('src/lib/paymentRoutes.ts');
  const specific = read('src/components/SpecificTreatmentModal.tsx');
  const numerology = read('src/components/NumerologyModal.tsx');
  assert.ok(routes.includes('https://api.infinitepay.io/invoices/public/checkout'));
  assert.ok(routes.includes("router.post('/payment/create-checkout'"));
  assert.ok(routes.includes("provider('/payment_check'"));
  assert.ok(!specific.includes('handleCopyPix'));
  assert.ok(!specific.includes('navigator.clipboard.writeText'));
  assert.ok(!numerology.includes('handleCopyPix'));
  assert.ok(!numerology.includes('navigator.clipboard.writeText'));
});

test('o player respeita o contexto de dia do Estilo 2 sem herdar a cena da Reintegração', () => {
  const session = read('src/components/MeditationSession.tsx');
  const css = read('src/elegancia-profunda-approved-overrides.css');
  assert.ok(session.includes("['natural-sereno', 'elegancia-profunda', 'essencia-luminosa'].includes(activeLayout || '') ? dayNumber : undefined"));
  assert.ok(css.includes('--ep-scene:none'));
  assert.ok(!css.includes('var(--ep-scene)'));
  assert.ok(css.includes('#meditation-session .ep-session-backdrop > div:last-child'));
});

test('a narração do Estilo 2 usa IDs ElevenLabs válidos e não cai na voz do dispositivo', () => {
  const voiceSelection = read('src/lib/voiceSelection.ts');
  const audio = read('src/lib/audio.ts');
  const app = read('src/App.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const home = read('src/components/TransformationHome.tsx');
  const session = read('src/components/MeditationSession.tsx');
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  const hooponopono = read('src/components/HooponoponoModal.tsx');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const systemic = read('src/components/SystemicQuestionsModal.tsx');
  const archangelPrayer = read('src/components/ArchangelMichaelPrayerModal.tsx');
  assert.ok(voiceSelection.includes('/^[A-Za-z0-9]{20}$/'));
  assert.ok(audio.includes('fallbackToSpeechSynthesis?: boolean'));
  assert.ok(audio.includes('failWithoutNativeVoice'));
  assert.ok(app.includes('Voz neural (ElevenLabs)'));
  assert.ok(settings.includes('Voz neural (ElevenLabs)'));
  assert.ok(home.includes('const requiresNeuralVoice = isEleganciaProfunda || isEssenciaLuminosa;'));
  assert.ok(home.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(session.includes("activeLayout === 'elegancia-profunda' && !style2VoiceId"));
  assert.ok(anamnesis.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(hooponopono.includes('fallbackToSpeechSynthesis: !isEleganciaProfunda'));
  assert.ok(arcanjo.includes('requireExplicitVoiceId: isEleganciaProfunda'));
  assert.ok(audio.includes('requireExplicitVoiceId?: boolean'));
  assert.ok(audio.includes('if (options.requireExplicitVoiceId && !isElevenLabsVoiceId(options.voiceId))'));
  assert.ok(systemic.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(archangelPrayer.includes('fallbackToSpeechSynthesis: !isEleganciaProfunda'));
  assert.ok(app.includes('userProfile={userProfile || undefined}'));
  assert.ok(app.includes('voiceId={userProfile?.voiceId}'));
});

test('o acolhimento inicial do Estilo 2 mantém contraste marfim sobre verde profundo', () => {
  const css = read('src/elegancia-profunda-approved-overrides.css');
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] .ep-welcome-audio.ep-home-hero'));
  assert.ok(css.includes('color:var(--layout-text)!important'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] .ep-voice-error'));
});
test('as telas de Anamnese e oração usam a paleta específica do Estilo 2', () => {
  const anamnesisCss = read('src/elegancia-profunda-anamnesis-audit.css');
  const prayerCss = read('src/elegancia-profunda-prayer-audit.css');
  const headerCss = read('src/elegancia-profunda-header-final-audit.css');
  const main = read('src/main.tsx');
  assert.ok(anamnesisCss.includes('.ep-anamnesis-progress-fill'));
  assert.ok(anamnesisCss.includes('linear-gradient(90deg,#A87E37'));
  assert.ok(prayerCss.includes('.ep-archangel-prayer'));
  assert.ok(prayerCss.includes('315C85'));
  assert.ok(headerCss.includes('#header-profile-avatar'));
  assert.ok(main.includes("import './elegancia-profunda-anamnesis-audit.css'"));
  assert.ok(main.includes("import './elegancia-profunda-prayer-audit.css'"));
});



test('o Estilo 2 não substitui silenciosamente a voz neural escolhida por uma voz padrão', () => {
  const home = read('src/components/TransformationHome.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  assert.ok(home.includes("const approvedVoiceId = isEleganciaProfunda\n    ? (isElevenLabsVoiceId(savedVoiceId) ? savedVoiceId : '')"));
  assert.ok(home.includes("isEssenciaLuminosa\n      ? (isElevenLabsVoiceId(savedVoiceId) ? savedVoiceId : OFFICIAL_PROTOCOL_VOICE_ID)"));
  assert.ok(settings.includes('if (requiresNeuralVoice && !isElevenLabsVoiceId(voiceId))'));
});

test('a Reintegração mantém o áudio neural dedicado aprovado e não recupera voz nativa', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  const api = read('api/index.ts');
  assert.ok(journey.includes("fetch('/api/reintegration-tts'"));
  assert.ok(api.includes('const REINTEGRATION_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";'));
  assert.ok(!journey.includes('speechSynthesis'));
  assert.ok(journey.includes('Voz neural dedicada'));
});

test('a Reintegração recebe o tratamento isolado do Estilo 2 e mantém a assinatura transparente', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  const css = read('src/elegancia-profunda-approved-overrides.css');
  const visual = read('src/components/ReintegrationPresenceVisual.tsx');
  assert.ok(journey.includes('data-ep-reintegration="true"'));
  assert.ok(journey.includes('ep-reintegration-logo'));
  assert.ok(journey.includes('opacity-30'));
  assert.ok(!journey.includes('bg-[#F8F4EC]/35 opacity-30 shadow-'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] [data-ep-reintegration="true"]'));
  assert.ok(css.includes('.ep-reintegration-running-glow'));
  assert.ok(css.includes('rgba(3,20,14'));
  assert.ok(visual.includes('data-visual-fallback="approved-human"'));
  assert.ok(journey.includes('data-journey-days="21"'));
});


test('o canvas do Estilo 2 usa verde profundo e dourado, sem herdar a paleta da Essência Luminosa', () => {
  const session = read('src/components/MeditationSession.tsx');
  const canvas = read('src/components/session/SacredEnergyCanvas.tsx');
  assert.ok(session.includes("const ELEGANCIA_PROFUNDA_CANVAS_THEME = {"));
  assert.ok(session.includes("glow: '#D4AF37'"));
  assert.ok(session.includes("accent: '#2E6B4F'"));
  assert.ok(session.includes("colorTheme={isEleganciaProfunda ? ELEGANCIA_PROFUNDA_CANVAS_THEME"));
  assert.ok(canvas.includes('goldSoft?: string;'));
  assert.ok(canvas.includes('sageSoft?: string;'));
  assert.ok(canvas.includes('goldSoft: colorTheme.goldSoft ||'));
  assert.ok(canvas.includes('sageSoft: colorTheme.sageSoft ||'));
});

test('a Reintegração libera e readquire o Wake Lock ao pausar, concluir ou voltar à aba', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  assert.ok(journey.includes('const releaseWakeLock = () =>'));
  assert.ok(journey.includes("lock?.addEventListener?.('release'"));
  assert.match(journey, /onEnded=\{\(\) => \{[\s\S]*?releaseWakeLock\(\);[\s\S]*?playbackState='none'/);
  assert.match(journey, /setActionHandler\('pause',[\s\S]*?releaseWakeLock\(\);/);
  assert.match(journey, /setActionHandler\('play',[\s\S]*?requestWakeLock\(\);/);
  assert.match(journey, /if \(playing\) \{[\s\S]*?releaseWakeLock\(\);/);
});

test('o onboarding antigo permanece inativo e o fluxo ativo continua sendo OnboardingFlow', () => {
  const app = read('src/App.tsx');
  const main = read('src/main.tsx');
  assert.ok(app.includes("import('./components/OnboardingFlow')"));
  assert.ok(!app.includes("import('./components/WelcomeModal')"));
  assert.ok(!main.includes("elegancia-profunda-welcome-audit.css"));
});

test('o Media Session não volta para pausado depois que a trilha termina', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  assert.ok(journey.includes('const endedRef = useRef(false);'));
  assert.ok(journey.includes("navigator.mediaSession.playbackState = endedRef.current ? 'none' : playing ? 'playing' : 'paused';"));
  assert.match(journey, /onEnded=\{\(\) => \{ endedRef\.current=true;[\s\S]*?playbackState='none'/);
});


test('o player do Estilo 2 mantém todas as fases em verde profundo, champagne e marfim', () => {
  const theme = read('src/approved-theme.css');
  const main = read('src/main.tsx');
  const playerCss = read('src/elegancia-profunda-player-audit.css');
  const session = read('src/components/MeditationSession.tsx');
  const checkin = read('src/components/session/SessionCheckInModal.tsx');
  const drawer = read('src/components/session/SecondaryScriptDrawer.tsx');
  assert.ok(theme.includes('--layout-text-soft:var(--layout-text-secondary)'));
  assert.ok(main.includes("import './elegancia-profunda-player-audit.css'"));
  assert.ok(main.indexOf('elegancia-profunda-player-audit.css') > main.indexOf('elegancia-profunda-dashboard-audit.css'));
  assert.ok(playerCss.includes('#meditation-session > header'));
  assert.ok(playerCss.includes('.ep-acceptance-portal'));
  assert.ok(playerCss.includes('.ep-session-checkin'));
  assert.ok(playerCss.includes('[aria-label="Roteiro da sessão"]'));
  assert.ok(playerCss.includes('[aria-label="Sessão concluída"]'));
  assert.ok(playerCss.includes('.ep-session-access-gate'));
  assert.ok(session.includes('ep-session-access-gate'));
  assert.ok(checkin.includes('ep-session-checkin'));
  assert.ok(checkin.includes('aria-pressed={mood === val}'));
  assert.ok(checkin.includes('aria-pressed={isSelected}'));
  assert.ok(drawer.includes('aria-label="Roteiro da sessão"'));
});


test('o toast global não herda indigo/roxo no Estilo 2 e mantém contraste legível', () => {
  const app = read('src/App.tsx');
  const css = read('src/elegancia-profunda-approved-overrides.css');
  assert.ok(app.includes('className="ep-app-toast fixed'));
  assert.ok(app.includes('role="status"'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] .ep-app-toast'));
  assert.ok(css.includes('background:linear-gradient(145deg,#132A1F 0%,#0B1712 100%)!important'));
  assert.ok(css.includes('color:#F4F1EB!important'));
  assert.ok(css.includes('color:#C8D6CD!important'));
});

test('a Reintegração carrega as 21 artes diárias com nomes zero-padded', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  assert.match(journey, /const dayArtworkUrl = `\/brand\/days\/dia-\$\{String\(day\)\.padStart\(2,\s*'0'\)\}\.png`;/);
  assert.ok(journey.includes("url('${dayArtworkUrl}')"));
  for (let day = 1; day <= 21; day += 1) {
    const asset = `public/brand/days/dia-${String(day).padStart(2, '0')}.png`;
    assert.ok(fs.existsSync(asset), `Arte diária ausente: ${asset}`);
  }
});


test('o player do Estilo 2 substitui o véu claro herdado por vinheta verde profunda', () => {
  const session = read('src/components/MeditationSession.tsx');
  const playerCss = read('src/elegancia-profunda-player-audit.css');
  assert.ok(session.includes('ep-session-light-overlay'));
  assert.ok(playerCss.includes(':root[data-layout="elegancia-profunda"] #meditation-session .ep-session-light-overlay'));
  assert.ok(playerCss.includes('rgba(7,19,14,.72)'));
});


test('o destaque de ciclo recomendado usa champagne e bronze no Estilo 2', () => {
  const treatmentModal = read('src/components/SpecificTreatmentModal.tsx');
  const modalCss = read('src/elegancia-profunda-modal-audit.css');
  assert.ok(treatmentModal.includes('ep-treatment-recommended-badge'));
  assert.ok(modalCss.includes(':root[data-layout="elegancia-profunda"] #specific-treatment-modal .ep-treatment-recommended-badge'));
  assert.ok(modalCss.includes('#E5CFA0'));
  assert.ok(modalCss.includes('#9B7446'));
});
