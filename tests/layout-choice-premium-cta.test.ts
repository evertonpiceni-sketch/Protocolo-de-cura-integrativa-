import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('o seletor mantém escolha explícita e CTA premium específico da Essência Luminosa', () => {
  const source = fs.readFileSync('src/components/LayoutChoiceModal.tsx', 'utf8');
  const layouts = fs.readFileSync('src/config/layouts.ts', 'utf8');
  const tick = String.fromCharCode(96);

  assert.ok(source.includes('useState<LayoutId | null>(null)'), 'Nenhum estilo começa pré-selecionado.');
  assert.ok(source.includes("const confirmButtonShape = selectedLayout === 'essencia-luminosa' ? 'rounded-2xl' : 'rounded-full';"));
  assert.ok(source.includes('className={' + tick + 'min-h-12 w-full max-w-sm $' + '{confirmButtonShape}'));
  assert.ok(source.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(source.includes('onClick={confirmSelection}'));

  for (const id of ['natural-sereno', 'elegancia-profunda', 'essencia-luminosa', 'mistico-moderno']) {
    assert.ok(layouts.includes("id: '" + id + "'"), 'Estilo ausente do seletor: ' + id);
  }
});
