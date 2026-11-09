import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('o seletor dos quatro estilos mantém CTA premium sem formato de pílula', () => {
  const source = fs.readFileSync('src/components/LayoutChoiceModal.tsx', 'utf8');
  const disabledMarker = 'disabled={!selectedLayout || isSaving}';
  const disabledIndex = source.indexOf(disabledMarker);
  const buttonStart = source.lastIndexOf('<button', disabledIndex);
  const buttonEnd = source.indexOf('\n          >', disabledIndex);
  const confirmButton = source.slice(buttonStart, buttonEnd);

  assert.ok(disabledIndex >= 0 && buttonStart >= 0 && buttonEnd > buttonStart, 'CTA de confirmação deve existir.');
  assert.ok(confirmButton.includes('onClick={confirmSelection}'));
  assert.ok(confirmButton.includes('rounded-xl'), 'CTA deve usar acabamento premium retangular.');
  assert.ok(!confirmButton.includes('rounded-full'), 'CTA não deve voltar ao formato de pílula.');
  assert.ok(confirmButton.includes('disabled={!selectedLayout || isSaving}'), 'Confirmação continua bloqueada antes da escolha explícita.');
});
