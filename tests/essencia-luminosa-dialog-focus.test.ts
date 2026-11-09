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
    'useDialogFocus(isOpen && isEssenciaLuminosa, dialogRef, onClose)',
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

test('os diálogos do Estilo 3 mantêm foco gerenciado sem remover o suporte existente do Natural Sereno', () => {
  for (const [path, markers] of focusGuards) {
    const source = read(path);
    assert.ok(source.includes('useDialogFocus('), `${path}: hook de foco ausente`);
    for (const marker of markers) {
      assert.ok(source.includes(marker), `${path}: marcador de foco ausente: ${marker}`);
    }
  }
});

test('o acolhimento usa a marca oficial discreta e não a imagem legada inexistente', () => {
  const welcome = read('src/components/WelcomeModal.tsx');
  const css = read('src/essencia-luminosa-approved-overrides.css');
  assert.ok(welcome.includes('APPROVED_LOGO_DATA_URI'));
  assert.ok(welcome.includes('ep-brand-signature'));
  assert.ok(!welcome.includes('/cura_integrada_brand_portal.png'));
  assert.ok(css.includes('.ep-brand-signature-wrap{opacity:1!important;'));
  assert.ok(css.includes('img[alt*="logo" i]{opacity:.30!important;'));
  assert.ok(css.includes('img[alt*="logo" i]{opacity:.26!important;'));
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


test('o detalhe do dia não herda índigo, verde esmeralda ou âmbar saturado no Estilo 3', () => {
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


test('a celebração não deixa o botão emerald ou o ícone rose escaparem no Estilo 3', () => {
  const css = read('src/essencia-luminosa-milestone-audit.css');
  assert.ok(css.includes('[aria-label="Celebração de progresso"] button.bg-emerald-600'));
  assert.ok(css.includes('[aria-label="Celebração de progresso"] button.bg-emerald-600:hover'));
  assert.ok(css.includes('[aria-label="Celebração de progresso"] [class*="text-rose-"]'));
});


test('as animações CSS do player e dos diálogos respeitam prefers-reduced-motion', () => {
  const player = read('src/components/session/MinimalPlayerControls.tsx');
  const session = read('src/components/MeditationSession.tsx');
  const dailyTip = read('src/components/DailyTipModal.tsx');
  const milestone = read('src/components/MilestoneCelebrationModal.tsx');
  assert.ok(player.includes('motion-reduce:animate-none'));
  assert.ok(session.includes('motion-reduce:animate-none'));
  assert.ok(dailyTip.includes('motion-reduce:animate-none'));
  assert.ok((milestone.match(/motion-reduce:animate-none/g) || []).length >= 3);
});
