import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('as quatro prévias permanecem independentes e a prancha Natural Sereno não migra para outro estilo', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const layouts = read('src/config/layouts.ts');

  const naturalStart = modal.indexOf('if (isNaturalSereno)');
  const eleganceStart = modal.indexOf("if (layout.id === 'elegancia-profunda')", naturalStart);
  const essenceStart = modal.indexOf('if (isEssenciaLuminosa)', eleganceStart);
  assert.ok(naturalStart >= 0 && eleganceStart > naturalStart && essenceStart > eleganceStart);

  const naturalPreview = modal.slice(naturalStart, eleganceStart);
  const elegancePreview = modal.slice(eleganceStart, essenceStart);
  const essencePreview = modal.slice(essenceStart);

  assert.ok(modal.includes('1001196520.png'));
  assert.ok(modal.includes('file_00000000317c820ebaad657dc3680de5'));
  assert.ok(modal.includes('docs/visual-qa/natural-sereno/reference.jpg'));
  assert.ok(naturalPreview.includes('src={NATURAL_SERENO_OFFICIAL_BOARD}'));
  assert.ok(naturalPreview.includes('object-contain'));
  assert.ok(naturalPreview.includes('Prancha oficial de referência. Decisões posteriores prevalecem.'));
  assert.ok(naturalPreview.includes('/brand/natural-sereno/vale-amanhecer.webp'));

  assert.ok(elegancePreview.includes('/brand/elegancia-profunda/prancha-oficial.svg'));
  assert.ok(essencePreview.includes('/brand/essencia-luminosa/prancha-oficial.webp'));
  assert.doesNotMatch(elegancePreview + essencePreview, /NATURAL_SERENO_OFFICIAL_BOARD/);

  assert.ok(layouts.includes("id: 'mistico-moderno'"));
  assert.ok(modal.includes('layout.swatches'), 'Místico Moderno deve usar sua própria paleta na prévia');
  assert.ok(modal.includes('Cada estilo mantém sua própria prévia'));
});

test('a escolha continua explícita, sem pré-seleção automática', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const layouts = read('src/config/layouts.ts');

  for (const name of ['Natural Sereno', 'Elegância Profunda', 'Essência Luminosa', 'Místico Moderno']) {
    assert.ok(layouts.includes(`name: '${name}'`), `Estilo ausente no seletor: ${name}`);
  }

  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('if (!selectedLayout || isSaving) return;'));
  assert.ok(modal.includes('onClick={confirmSelection}'));
});
