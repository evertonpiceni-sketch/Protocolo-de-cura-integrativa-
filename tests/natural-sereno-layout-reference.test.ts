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
  assert.ok(referenceImage.includes('h-14 w-16'));
  assert.ok(referenceImage.includes('object-contain'));
  assert.ok(!referenceImage.includes('object-cover') && !referenceImage.includes('object-top'));
  assert.ok(preview.includes('Prancha oficial de referência. Decisões posteriores prevalecem.'));
});

test('seletor começa sem estilo marcado e só aplica após confirmação explícita', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('if (!selectedLayout || isSaving) return;'));
  assert.ok(modal.includes('onClick={confirmSelection}'));
});

test('Natural Sereno usa o dourado aprovado nos seletores inicial e de aparência', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const app = read('src/App.tsx');

  assert.ok(modal.includes("const isNaturalSerenoCard = layout.id === 'natural-sereno';"));
  assert.ok(modal.includes("'border-[#C89D52] ring-2 ring-[#C89D52]/20 shadow-lg'"));
  assert.ok(modal.includes("'focus-visible:ring-[#C89D52]/35'"));
  assert.ok(modal.includes('focus-visible:ring-[#C89D52]/40'));

  assert.ok(app.includes("const isNaturalSerenoChoice = layout.id === 'natural-sereno';"));
  assert.ok(app.includes("'border-[#C89D52] bg-[#C89D52]/8 shadow-sm'"));
  assert.ok(app.includes("'focus-visible:ring-[#C89D52]/35'"));
});

test('a barra do navegador só acompanha o estilo depois da confirmação explícita', () => {
  const app = read('src/App.tsx');
  const effectStart = app.indexOf('// Keep browser chrome neutral until the visitor explicitly confirms');
  const effectEnd = app.indexOf('}, [userProfile?.visualLayout, layoutConfirmedThisSession]);', effectStart);
  assert.ok(effectStart >= 0 && effectEnd > effectStart, 'Efeito de theme-color não encontrado');
  const effect = app.slice(effectStart, effectEnd);
  assert.ok(effect.includes('const selected = layoutConfirmedThisSession'));
  assert.ok(effect.includes("const themeColor = selected?.swatches[0] ?? '#F8F4EC';"));
  assert.ok(effect.includes("metaThemeColor.setAttribute('content', themeColor);"));
});

test('o atributo data-layout permanece neutro até a confirmação explícita do estilo', () => {
  const app = read('src/App.tsx');
  const effectStart = app.indexOf('// Never activate a visual theme before the user explicitly confirms a choice.');
  const effectEnd = app.indexOf('}, [userProfile?.visualLayout, layoutConfirmedThisSession]);', effectStart);
  assert.ok(effectStart >= 0 && effectEnd > effectStart, 'Efeito de aplicação do tema não encontrado');
  const effect = app.slice(effectStart, effectEnd);

  assert.ok(effect.includes('const selected = layoutConfirmedThisSession ? OFFICIAL_LAYOUTS.find'));
  assert.ok(effect.includes('if (!selected) {'));
  assert.ok(effect.includes('delete document.documentElement.dataset.layout;'));
  assert.ok(effect.includes('document.documentElement.dataset.layout = selected.id;'));
});
