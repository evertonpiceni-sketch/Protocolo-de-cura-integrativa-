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
