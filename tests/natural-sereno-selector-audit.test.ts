import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('CTA do seletor usa 18px no estado neutro e no Natural Sereno sem alterar os outros estilos', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  assert.ok(
    modal.includes("const confirmButtonRadius = !selectedLayout || selectedLayout === 'natural-sereno' ? 'rounded-[18px]' : 'rounded-full';")
  );
  assert.ok(modal.includes('${confirmButtonRadius} ${confirmButtonTone}'));
  assert.ok(
    modal.includes('O estado neutro e o Natural Sereno usam CTA premium de 18px; os outros estilos preservam seu acabamento aprovado.')
  );
});
