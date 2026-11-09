import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const focusGuards = [
  ['src/components/AnamnesisModal.tsx', 'useDialogFocus(isOpen && managedDialogFocus', 'const managedDialogFocus = naturalSereno || isEssenciaLuminosa;'],
  ['src/components/CoursesModal.tsx', "useDialogFocus(isOpen && ['natural-sereno', 'essencia-luminosa']"],
  ['src/components/DashboardCura.tsx', "useDialogFocus(['natural-sereno', 'essencia-luminosa']"],
  ['src/components/ContactModal.tsx', "useDialogFocus(isOpen && ['natural-sereno', 'essencia-luminosa']"],
  ['src/components/PromoVideoModal.tsx', "useDialogFocus(isOpen && ['natural-sereno', 'essencia-luminosa']"],
  ['src/components/ProReportCertificateModal.tsx', "useDialogFocus(isOpen && ['natural-sereno', 'essencia-luminosa']"],
  ['src/components/AdminPanelModal.tsx', "useDialogFocus(isOpen && ['natural-sereno', 'essencia-luminosa']"]
];

test('os diálogos do Estilo 3 mantêm foco gerenciado sem alterar o fluxo do Natural Sereno', () => {
  for (const [path, expectedCall, expectedStyle3Guard] of focusGuards) {
    const source = fs.readFileSync(path, 'utf8');
    assert.ok(source.includes('useDialogFocus('), `${path}: hook de foco ausente`);
    assert.ok(source.includes(expectedCall), `${path}: chamada de foco não inclui Essência Luminosa`);
    if (expectedStyle3Guard) {
      assert.ok(source.includes(expectedStyle3Guard), `${path}: condição de foco do Estilo 3 ausente`);
    }
  }
});
