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


test('a prévia Natural Sereno usa CTA retangular premium, não formato de pílula', () => {
  const source = fs.readFileSync('src/components/LayoutChoiceModal.tsx', 'utf8');
  const start = source.indexOf('if (isNaturalSereno)');
  const end = source.indexOf("if (layout.id === 'elegancia-profunda')", start);
  assert.ok(start >= 0 && end > start, 'prévia Natural Sereno não encontrada.');
  const preview = source.slice(start, end);
  const ctaStart = preview.indexOf('<span className="shrink-0');
  const ctaEnd = preview.indexOf('>', ctaStart);
  assert.ok(ctaStart >= 0 && ctaEnd > ctaStart, 'CTA da prévia Natural Sereno não encontrado.');
  const ctaClass = preview.slice(ctaStart, ctaEnd);

  assert.ok(ctaClass.includes('rounded-xl'), 'CTA da prévia deve ter cantos premium de 12px.');
  assert.ok(!ctaClass.includes('rounded-full') && !ctaClass.includes('rounded-[18px]'), 'CTA da prévia não deve ser uma pílula.');
  assert.ok(ctaClass.includes('border-[#A87E37]'));
  assert.ok(ctaClass.includes('text-[#2A2421]'));
  assert.ok(preview.includes('bg-gradient-to-b from-[#E2B96B] to-[#C89D52]'));
});
