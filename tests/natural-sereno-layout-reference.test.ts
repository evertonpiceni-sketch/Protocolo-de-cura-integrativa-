import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('card Natural Sereno usa a prancha oficial inteira, sem recortar a referência', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const start = modal.indexOf('if (isNaturalSereno)');
  const end = modal.indexOf("if (layout.id === 'elegancia-profunda')", start);
  assert.ok(start >= 0 && end > start, 'Prévia Natural Sereno não encontrada');
  const preview = modal.slice(start, end);

  assert.ok(modal.includes('1001196520.png'));
  assert.ok(modal.includes('file_00000000317c820ebaad657dc3680de5'));
  assert.ok(modal.includes('docs/visual-qa/natural-sereno/reference.jpg'));
  const referenceStart = preview.indexOf('src={NATURAL_SERENO_OFFICIAL_BOARD}');
  const referenceEnd = preview.indexOf('/>', referenceStart);
  assert.ok(referenceStart >= 0 && referenceEnd > referenceStart, 'Imagem da prancha oficial não encontrada');
  const referenceImage = preview.slice(referenceStart, referenceEnd);
  assert.match(referenceImage, /h-14 w-16[\s\S]*object-contain/);
  assert.doesNotMatch(referenceImage, /object-cover|object-top/);
  assert.ok(preview.includes('Prancha oficial de referência. Decisões posteriores prevalecem.'));
});

test('seletor começa sem estilo marcado e só aplica após confirmação explícita', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  assert.match(modal, /useState<LayoutId \| null>\(null\)/);
  assert.match(modal, /if \(!selectedLayout \|\| isSaving\) return;/);
  assert.match(modal, /onClick=\{confirmSelection\}/);
});
