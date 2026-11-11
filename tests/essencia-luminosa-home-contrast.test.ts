import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('a afirmação do dia mantém contraste legível na Essência Luminosa', () => {
  const source = fs.readFileSync('src/components/TransformationHome.tsx', 'utf8');
  assert.ok(
    source.includes("isEssenciaLuminosa ? 'text-[#5C5248]' : 'text-[#f2e7c6]'"),
    'o Estilo 3 deve usar grafite quente sobre a superfície marfim; os outros estilos preservam o tratamento anterior'
  );
  assert.ok(source.includes('bg-[#F5EFE4] p-4 text-base italic leading-7'));
});
