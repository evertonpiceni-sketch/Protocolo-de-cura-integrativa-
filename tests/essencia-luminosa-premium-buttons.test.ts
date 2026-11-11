import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('o CTA de voz da Essência Luminosa usa botão premium sem formato de pílula', () => {
  const home = fs.readFileSync('src/components/TransformationHome.tsx', 'utf8');
  assert.ok(home.includes("isEssenciaLuminosa ? 'rounded-2xl' : 'rounded-full'"));
  assert.ok(home.includes('Ouvir meu resultado'));
});

test('o formato anterior do CTA permanece intacto nos demais estilos', () => {
  const home = fs.readFileSync('src/components/TransformationHome.tsx', 'utf8');
  assert.ok(home.includes("isEssenciaLuminosa ? 'rounded-2xl' : 'rounded-full'"));
});


test('o CTA de confirmação do seletor usa acabamento premium no Estilo 3 sem alterar os outros estilos', () => {
  const selector = fs.readFileSync('src/components/LayoutChoiceModal.tsx', 'utf8');
  assert.ok(selector.includes("const confirmButtonShape = selectedLayout === 'essencia-luminosa' ? 'rounded-2xl' : 'rounded-full';"));
  assert.ok(selector.includes('${confirmButtonShape}'));
  assert.ok(selector.includes(": 'rounded-full'"), 'os outros estilos mantêm o formato aprovado');
});
