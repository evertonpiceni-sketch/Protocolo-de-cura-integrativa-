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
  assert.ok(app.includes('useState(false)'));
  assert.ok(app.includes('A persisted preference is not consent to apply a theme in this session.'));
});
