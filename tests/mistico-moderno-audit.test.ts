import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS, resolveMisticoModernoOfficialVoiceId } from '../src/config/voiceAliases';
import { shouldPlayProtocolSessionBackground } from '../src/lib/protocolSessionAudioPolicy';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('o seletor mostra a prancha oficial do Estilo 4 como referência visual, sem substituir decisões posteriores', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const board = 'public/brand/mistico-moderno/prancha-oficial.svg';
  assert.ok(fs.existsSync(board));
  assert.ok(fs.statSync(board).size > 5000, 'a prancha deve conter a referência visual, não um placeholder');
  assert.ok(modal.includes('/brand/mistico-moderno/prancha-oficial.svg'));
  assert.ok(modal.includes('Prancha visual oficial. Conteúdos e fluxos seguem as decisões aprovadas posteriores.'));
  assert.ok(modal.includes("const isMysticCard = layout.id === 'mistico-moderno'"));
  assert.ok(modal.includes("isMysticCard ? 'bg-[#0A0F18]' : 'bg-white/85'"));
});

test('os quatro estilos continuam exigindo escolha explícita antes da aplicação', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const app = read('src/App.tsx');
  const main = read('src/main.tsx');
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(modal.includes('O estilo só será aplicado depois da sua confirmação.'));
  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false)'));
  assert.ok(app.includes('{(!layoutConfirmedThisSession || layoutChoiceRequested) && ('));
  assert.ok(app.includes('setLayoutConfirmedThisSession(true)'));
  assert.ok(app.includes('layoutConfirmedThisSession && isLayoutId(userProfile.visualLayout) ? userProfile.visualLayout : undefined'));
  assert.ok(main.includes("./lib/misticoModernoOfficialVoicePatch"));
  assert.ok(main.includes("./mistico-moderno-arcanjo-audit.css"));
  assert.ok(!main.includes('layoutSettingsExplicitConfirmationPatch'));
  assert.ok(!main.includes('requiredLayoutChoiceEntryPatch'));
});

test('o alias oficial do Estilo 4 rejeita vozes legadas e exige um ID configurado válido', () => {
  assert.equal(MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS, 'mistico-moderno-oficial');
  assert.equal(resolveMisticoModernoOfficialVoiceId('configured-voice-id-123'), 'configured-voice-id-123');
  assert.equal(resolveMisticoModernoOfficialVoiceId('Rachel'), null);
  assert.equal(resolveMisticoModernoOfficialVoiceId('Marcus'), null);
  assert.equal(resolveMisticoModernoOfficialVoiceId('Marianne'), null);
  assert.equal(resolveMisticoModernoOfficialVoiceId('21m00Tcm4TlvDq8ikWAM'), null);
  assert.equal(resolveMisticoModernoOfficialVoiceId(''), null);
  assert.equal(resolveMisticoModernoOfficialVoiceId('short'), null);
});

test('os três caminhos de reprodução do Místico Moderno usam a voz do servidor sem fallback do navegador', () => {
  const patch = read('src/lib/misticoModernoOfficialVoicePatch.ts');
  const audio = read('src/lib/audio.ts');
  const server = read('server.ts');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const home = read('src/components/TransformationHome.tsx');
  const session = read('src/components/MeditationSession.tsx');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  for (const path of ['speakWithElevenLabsOrFallback', 'playGuidedMeditation', 'playProtocolStageStream']) {
    assert.ok(patch.includes(path), `patch não intercepta ${path}`);
  }
  assert.ok(patch.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(patch.includes('MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS'));
  assert.ok(audio.includes('isMisticoModernoAlias'));
  assert.ok(audio.includes("document.documentElement.dataset.layout === 'mistico-moderno'"));
  assert.ok(server.includes('resolveMisticoModernoOfficialVoiceId(process.env.ELEVENLABS_VOICE_ID)'));
  assert.ok(server.includes('misticoModernoVoiceConfigured'));
  assert.ok(server.includes('fallbackToSpeechSynthesis: !isMisticoVoice'));
  assert.ok(settings.includes('status.misticoModernoVoiceConfigured === true'));
  assert.ok(settings.includes('fallbackToSpeechSynthesis: !requiresOfficialServerVoice'));
  assert.ok(home.includes('const narrationVoiceId = isMisticoModerno') && home.includes('? MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS'));
  assert.ok(home.includes('fallbackToSpeechSynthesis: !requiresOfficialServerVoice'));
  assert.ok(session.includes('MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS'));
  assert.ok(arcanjo.includes('MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS'));
  assert.ok(arcanjo.includes('isEleganciaProfunda || isMisticoModerno'));
});

test('a configuração de voz no servidor é reportada sem expor o ID ou a chave', () => {
  const server = read('server.ts');
  const settings = read('src/components/AudioSettingsModal.tsx');
  assert.ok(server.includes('misticoModernoVoiceConfigured = hasKey && !!resolveMisticoModernoOfficialVoiceId'));
  assert.ok(settings.includes("fetch('/api/elevenlabs/status')"));
  assert.ok(settings.includes('Voz oficial do Místico Moderno'));
  assert.ok(settings.includes('não utiliza as vozes instaladas no navegador'));
});

test('o player usa a voz oficial e uma paleta própria de índigo, violeta e dourado', () => {
  const session = read('src/components/MeditationSession.tsx');
  const canvas = read('src/components/session/SacredEnergyCanvas.tsx');
  const css = read('src/mistico-moderno-session-audit.css');
  assert.ok(session.includes('MISTICO_MODERNO_CANVAS_THEME'));
  assert.ok(session.includes('MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS'));
  assert.ok(session.includes('colorTheme={isMisticoModerno ? MISTICO_MODERNO_CANVAS_THEME'));
  assert.ok(canvas.includes('particleGold?: string'));
  assert.ok(canvas.includes('particleAccent?: string'));
  assert.ok(canvas.includes('palette.particleGold'));
  assert.ok(canvas.includes('palette.particleAccent'));
  assert.ok(css.includes("url('/brand/human-chakra-model.jpg')"));
  assert.ok(css.includes('position:absolute!important'));
  assert.ok(!css.includes('mix-blend-mode:screen'));
});

test('a animação respeita movimento reduzido e preserva o relógio real do áudio', () => {
  const canvas = read('src/components/session/SacredEnergyCanvas.tsx');
  const session = read('src/components/MeditationSession.tsx');
  assert.match(canvas, /prefers-reduced-motion/);
  assert.ok(session.includes('onProgress: (curr, dur) =>'));
  assert.ok(session.includes('setCurrentTime(Number.isFinite(normalizedCurrent) ? normalizedCurrent : 0)'));
  assert.ok(session.includes('setDuration(Number.isFinite(dur) && dur > 0 ? dur : 0)'));
});

test('Arcanjo/Solfeggio tem superfície noturna própria e não cai na voz robótica', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const css = read('src/mistico-moderno-arcanjo-audit.css');
  const main = read('src/main.tsx');
  assert.ok(arcanjo.includes('id="arcanjo-protocol-view"'));
  assert.ok(arcanjo.includes('id="arcanjo-protocol-backdrop"'));
  assert.ok(arcanjo.includes('id="arcanjo-chakra-stage"'));
  assert.ok(arcanjo.includes('id="arcanjo-chakra-caption"'));
  assert.ok(arcanjo.includes('audioEngine.startSynth(`${config.freq}hz`)'));
  assert.ok(arcanjo.includes('A voz oficial do Místico Moderno está indisponível no servidor'));
  assert.ok(css.includes(':root[data-layout="mistico-moderno"] #arcanjo-protocol-view'));
  assert.ok(css.includes(':root[data-layout="mistico-moderno"] #arcanjo-chakra-stage'));
  assert.ok(css.includes('prefers-reduced-motion: reduce'));
  assert.ok(main.includes("./mistico-moderno-arcanjo-audit.css"));
});

test('Solfeggio global não recomeça durante narração; Arcanjo mantém seu próprio oscilador', () => {
  const app = read('src/App.tsx');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  assert.equal(shouldPlayProtocolSessionBackground('playing', '528hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', '432hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', '963hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', 'waves'), true);
  assert.equal(shouldPlayProtocolSessionBackground('portal', 'waves'), false);
  assert.ok(app.includes('activeSessionDay === null'));
  assert.ok(app.includes('!showArcanjoView'));
  assert.ok(arcanjo.includes('audioEngine.startSynth'));
  assert.ok(arcanjo.includes('audioEngine.stopSynth()'));
});

test('Diário e Journal não abrem automaticamente', () => {
  const app = read('src/App.tsx');
  assert.ok(app.includes('const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false)'));
  assert.ok(app.includes('const [showDailyDiaryModal, setShowDailyDiaryModal] = useState<boolean>(false)'));
  assert.equal((app.match(/setShowDailyDiaryModal\(true\)/g) || []).length, 1);
  assert.equal((app.match(/setIsJournalOpen\(true\)/g) || []).length, 1);
  assert.ok(app.includes('{showDailyDiaryModal && userProfile && ('));
  assert.ok(app.includes('onOpenJournal={() => setIsJournalOpen(true)}'));
});

test('a assinatura oficial é transparente, sem badge claro e sem opacidade divergente', () => {
  const approved = read('src/mistico-moderno-approved-overrides.css');
  const header = read('src/mistico-moderno-header-audit.css');
  const modal = read('src/mistico-moderno-modal-audit.css');
  const courses = read('src/mistico-moderno-courses-audit.css');
  const contact = read('src/components/ContactModal.tsx');
  const courseComponent = read('src/components/CoursesModal.tsx');
  assert.ok(approved.includes('opacity:.30!important'));
  assert.ok(approved.includes('background:transparent!important'));
  assert.ok(approved.includes('border-color:transparent!important'));
  assert.ok(header.includes('opacity:.30!important'));
  assert.ok(header.includes('opacity:.26!important'));
  assert.ok(modal.includes('opacity:.30!important'));
  assert.ok(courses.includes('opacity: .30 !important'));
  assert.ok(contact.includes('ep-brand-signature-wrap'));
  assert.ok(contact.includes('ep-brand-signature w-full'));
  assert.ok(courseComponent.includes('ep-brand-signature-wrap'));
  assert.ok(courseComponent.includes('ep-brand-signature w-full'));
  const logoRules = [approved, header, modal, courses].map(css => (css.match(/[^}]*\.ep-brand-signature[^}]*\}/g) || []).join('\n')).join('\n');
  assert.doesNotMatch(logoRules, /opacity:\s*\.(28|38|34)\s*!important/);
});

test('as folhas do Estilo 4 permanecem escopadas e o logout usa a paleta noturna', () => {
  const files = [
    'src/mistico-moderno-approved-overrides.css',
    'src/mistico-moderno-header-audit.css',
    'src/mistico-moderno-modal-audit.css',
    'src/mistico-moderno-courses-audit.css',
    'src/mistico-moderno-dashboard-audit.css',
    'src/mistico-moderno-session-audit.css',
    'src/mistico-moderno-arcanjo-audit.css'
  ];
  for (const path of files) {
    const css = read(path);
    assert.ok(css.includes(':root[data-layout="mistico-moderno"]'), `${path} sem escopo do Estilo 4`);
    assert.doesNotMatch(css, /:root\[data-layout="(?:natural-sereno|elegancia-profunda|essencia-luminosa)"\]/);
  }
  assert.ok(read('src/mistico-moderno-header-audit.css').includes('#header-btn-logout'));
  assert.ok(read('src/mistico-moderno-arcanjo-audit.css').includes('#arcanjo-btn-logout'));
});

test('pagamentos permanecem no checkout InfinitePay e preservam preços/cupons aprovados', () => {
  const catalog = read('src/lib/paymentCatalog.ts');
  const routes = read('src/lib/paymentRoutes.ts');
  assert.ok(catalog.includes('jornada_7d: { cents: 5990, days: 7'));
  assert.ok(catalog.includes('jornada_21d: { cents: 9990, days: 21'));
  assert.ok(catalog.includes("['PROMO15', 'PROMO20']"));
  assert.ok(routes.includes('https://api.infinitepay.io/invoices/public/checkout'));
  assert.ok(routes.includes('process.env.INFINITEPAY_HANDLE'));
  assert.ok(routes.includes('process.env.PUBLIC_APP_URL'));
  assert.ok(routes.includes('checkout.infinitepay.io'));
  assert.ok(routes.includes("req.body?.couponCode !== 'VIP7'"));
  assert.ok(!/manualPix|pixKey|chavePix/i.test(routes));
});
