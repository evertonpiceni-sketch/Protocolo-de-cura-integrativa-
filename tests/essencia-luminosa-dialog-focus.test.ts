import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

const focusGuards: Array<[string, string[]]> = [
  ['src/components/AnamnesisModal.tsx', [
    'const managedDialogFocus = naturalSereno || isEssenciaLuminosa;',
    'useDialogFocus(isOpen && managedDialogFocus'
  ]],
  ['src/components/CoursesModal.tsx', [
    "useDialogFocus(isOpen && ['natural-sereno', 'essencia-luminosa']"
  ]],
  ['src/components/DashboardCura.tsx', [
    "useDialogFocus(['natural-sereno', 'essencia-luminosa']"
  ]],
  ['src/components/ContactModal.tsx', [
    "useDialogFocus(isOpen && ['natural-sereno', 'essencia-luminosa']"
  ]],
  ['src/components/PromoVideoModal.tsx', [
    "useDialogFocus(isOpen && ['natural-sereno', 'essencia-luminosa']"
  ]],
  ['src/components/ProReportCertificateModal.tsx', [
    "useDialogFocus(isOpen && ['natural-sereno', 'essencia-luminosa']"
  ]],
  ['src/components/AdminPanelModal.tsx', [
    "useDialogFocus(isOpen && ['natural-sereno', 'essencia-luminosa']"
  ]],
  ['src/components/DailyTipModal.tsx', [
    'useDialogFocus(isEssenciaLuminosa, dialogRef, onClose)',
    'ref={dialogRef}'
  ]],
  ['src/components/WelcomeModal.tsx', [
    'useDialogFocus(isOpen && isEssenciaLuminosa, dialogRef, handleClose)',
    'ref={dialogRef}'
  ]],
  ['src/components/MilestoneCelebrationModal.tsx', [
    'useDialogFocus(isOpen && isEssenciaLuminosa, dialogRef, onClose)',
    'ref={dialogRef}'
  ]],
  ['src/components/MeditationSession.tsx', [
    "useDialogFocus(isEssenciaLuminosa && userPlan === 'free' && dayNumber > 7",
    "useDialogFocus(isEssenciaLuminosa && sessionPhase === 'completed'",
    'ref={accessGateDialogRef}',
    'ref={completedDialogRef}'
  ]],
  ['src/App.tsx', [
    'useDialogFocus(selectedDayDetail !== null && isEssenciaLuminosa',
    'ref={dayDetailDialogRef}'
  ]]
];

test('todos os diálogos compartilhados mantêm foco gerenciado na Essência Luminosa', () => {
  for (const [path, markers] of focusGuards) {
    const source = read(path);
    assert.ok(source.includes('useDialogFocus('), `${path}: hook de foco ausente`);
    for (const marker of markers) {
      assert.ok(source.includes(marker), `${path}: marcador de foco ausente: ${marker}`);
    }
  }
});

test('o acolhimento usa a marca oficial discreta e não a imagem legada', () => {
  const welcome = read('src/components/WelcomeModal.tsx');
  assert.ok(welcome.includes('APPROVED_LOGO_DATA_URI'));
  assert.ok(welcome.includes('ep-brand-signature'));
  assert.ok(!welcome.includes('/cura_integrada_brand_portal.png'));
});

test('o seletor mantém escolha explícita e a prancha oficial do Estilo 3', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const app = read('src/App.tsx');
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(modal.includes('/brand/essencia-luminosa/prancha-oficial.webp'));
  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false);'));
  assert.ok(app.includes('A persisted preference is not consent to apply a theme in this session.'));
});

test('o detalhe do dia usa superfícies marfim, champagne e sálvia no Estilo 3', () => {
  const app = read('src/App.tsx');
  const css = read('src/essencia-luminosa-approved-overrides.css');
  assert.ok(app.includes('id="day-detail-modal"'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #day-detail-modal'));
  assert.ok(css.includes('#day-detail-modal [class*="bg-indigo-"]'));
  assert.ok(css.includes('#day-detail-modal [class*="bg-emerald-"]'));
  assert.ok(css.includes('#day-detail-modal [class*="text-emerald-"]'));
  assert.ok(css.includes('#day-detail-modal [class*="text-amber-"]'));
  assert.ok(css.includes('#day-detail-modal button[class*="bg-[#B88736]"]'));
});

test('a celebração neutraliza o rosa residual e mantém o CTA externo em sálvia', () => {
  const component = read('src/components/MilestoneCelebrationModal.tsx');
  const css = read('src/essencia-luminosa-milestone-audit.css');
  assert.ok(component.includes('a.bg-emerald-600') || component.includes('bg-emerald-600'));
  assert.ok(css.includes('[aria-label="Celebração de progresso"] a.bg-emerald-600'));
  assert.ok(css.includes('[aria-label="Celebração de progresso"] a.bg-emerald-600:hover'));
  assert.ok(css.includes('[aria-label="Celebração de progresso"] [class*="text-rose-"]'));
  assert.ok(css.includes('color: var(--layout-accent)'));
});

test('player, sessão e diálogos respeitam prefers-reduced-motion', () => {
  const player = read('src/components/session/MinimalPlayerControls.tsx');
  const session = read('src/components/MeditationSession.tsx');
  const dailyTip = read('src/components/DailyTipModal.tsx');
  const milestone = read('src/components/MilestoneCelebrationModal.tsx');
  assert.ok(player.includes('motion-reduce:animate-none'));
  assert.ok(session.includes('motion-reduce:animate-none'));
  assert.ok(dailyTip.includes('motion-reduce:animate-none'));
  assert.ok((milestone.match(/motion-reduce:animate-none/g) || []).length >= 3);
});

test('a voz oficial e a propriedade do áudio do Arcanjo permanecem protegidas no Estilo 3', () => {
  const main = read('src/main.tsx');
  const voicePatch = read('src/lib/essenciaLuminosaOfficialVoicePatch.ts');
  const arcanjoOwnership = read('src/lib/arcanjoAudioOwnershipPatch.ts');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  assert.ok(main.includes("import './lib/essenciaLuminosaOfficialVoicePatch'"));
  assert.ok(main.includes("import './lib/arcanjoAudioOwnershipPatch'"));
  assert.ok(voicePatch.includes('OFFICIAL_PROTOCOL_VOICE_ID'));
  assert.ok(voicePatch.includes('preferElevenLabs: true'));
  assert.ok(voicePatch.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(arcanjoOwnership.includes("window.addEventListener('OPEN_PROTOCOL_DAY'"));
  assert.ok(arcanjoOwnership.includes('audioEngine.stopBG()'));
  assert.ok(arcanjo.includes('requireExplicitVoiceId: isEleganciaProfunda || isEssenciaLuminosa'));
});

test('as oito frequências Solfeggio e o bloqueio durante prévia neural continuam ativos', () => {
  const policy = read('src/lib/protocolSessionAudioPolicy.ts');
  const settings = read('src/components/AudioSettingsModal.tsx');
  for (const hz of ['396', '417', '432', '528', '639', '741', '852', '963']) {
    assert.ok(policy.includes(hz), `frequência ${hz} Hz ausente da política`);
    assert.ok(settings.includes(`'${hz}hz'`) || settings.includes(`"${hz}hz"`), `frequência ${hz} Hz ausente dos ajustes`);
  }
  assert.ok(settings.includes('shouldBlockTrackDuringNeuralVoicePreview'));
  assert.ok(policy.includes('!isSolfeggioFrequency(type)'));
});

test('Diário e histórico continuam ligados às camadas semânticas do Estilo 3', () => {
  const main = read('src/main.tsx');
  const diary = read('src/components/DailyDiaryModal.tsx');
  assert.ok(main.includes('essencia-luminosa-daily-diary-semantic-audit.css'));
  assert.ok(main.includes('essencia-luminosa-journal-dashboard-audit.css'));
  assert.ok(diary.includes('useDialogFocus'));
});

test('InfinitePay exige confirmação do valor exato e preserva as escolhas comerciais vigentes', () => {
  const routes = read('src/lib/paymentRoutes.ts');
  const catalog = read('src/lib/paymentCatalog.ts');
  const tests = read('tests/payment.test.ts');
  assert.ok(routes.includes('verified.amount !== order.cents'));
  assert.ok(routes.includes("['astral_map', 'numerology'].includes(benefitChoice)"));
  assert.ok(routes.includes("req.body?.couponCode !== 'VIP7'"));
  assert.ok(catalog.includes('PROMO15'));
  assert.ok(catalog.includes('PROMO20'));
  assert.ok(catalog.includes('7: 5990'));
  assert.ok(catalog.includes('21: 9990'));
  assert.ok(tests.includes("call('webhooks/payment'"));
  assert.ok(tests.includes("call('payment/confirm'"));
});


test('o logo do acolhimento permanece transparente e discreto em desktop e celular', () => {
  const css = read('src/essencia-luminosa-welcome-audit.css');
  assert.ok(css.includes('#welcome-modal .ep-brand-signature-wrap'));
  assert.ok(css.includes('opacity: .30'));
  assert.ok(css.includes('opacity: .26'));
  assert.ok(css.includes('background: transparent'));
});

test('o inventário das 24 folhas CSS mantém a âncora de escopo do Estilo 3', () => {
  const files = fs.readdirSync('src').filter(name =>
    name.startsWith('essencia-luminosa-') && name.endsWith('.css')
  );
  assert.equal(files.length, 24, 'inventário de folhas CSS do Estilo 3 mudou; revisar a cobertura');
  for (const file of files) {
    const css = read('src/' + file);
    assert.ok(
      css.includes('data-layout="essencia-luminosa"') || css.includes("data-layout='essencia-luminosa'"),
      file + ': âncora de escopo do Estilo 3 ausente'
    );
  }
});
