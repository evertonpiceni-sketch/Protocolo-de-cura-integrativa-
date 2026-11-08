import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('o Diário do Dia não herda âmbar saturado, roxo, índigo ou slate no Estilo 2', () => {
  const component = read('src/components/DailyDiaryModal.tsx');
  const css = read('src/elegancia-profunda-daily-diary-audit.css');

  const remappedClasses = [
    'bg-amber-500/10',
    'bg-amber-50',
    'border-amber-200',
    'text-amber-300',
    'text-amber-400',
    'text-amber-700',
    'border-purple-500/20',
    'text-purple-400',
  ];

  for (const className of remappedClasses) {
    assert.ok(component.includes(className), `O componente deve manter rastreável a classe ${className}.`);
    assert.ok(css.includes(`[class~="${className}"]`), `A classe ${className} precisa ser remapeada no Estilo 2.`);
  }

  assert.ok(component.includes('hover:bg-slate-700'));
  const slateHoverRule = css.match(/button:hover\[class~="hover:bg-slate-700"\]\s*\{([^}]+)\}/)?.[1] ?? '';
  assert.ok(slateHoverRule.includes('background-color: color-mix(in srgb, var(--layout-gold) 14%, var(--layout-card)) !important;'));
  assert.ok(slateHoverRule.includes('color: var(--layout-text) !important;'));

  assert.ok(component.includes('focus:ring-indigo-400'));
  const textareaFocusRule = css.match(/#daily-diary-modal textarea:focus\s*\{([^}]+)\}/)?.[1] ?? '';
  assert.ok(textareaFocusRule.includes('box-shadow: 0 0 0 3px rgba(201, 164, 104, 0.14) !important;'));
  assert.ok(!textareaFocusRule.toLowerCase().includes('indigo'));

  assert.ok(css.includes('#daily-diary-modal textarea:focus'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] #daily-diary-modal'));
  assert.ok(!/^\s*#daily-diary-modal/m.test(css), 'Nenhum override do Diário pode escapar do escopo Elegância Profunda.');
});

test('os estados concluídos do Diário continuam em verde profundo sem emerald genérico', () => {
  const css = read('src/elegancia-profunda-daily-diary-audit.css');
  assert.ok(css.includes('background-color: rgba(31, 72, 59, 0.58)'));
  assert.ok(css.includes('color: #eadbc5'));
  assert.ok(css.includes('background-color: #8fae91'));
  assert.ok(css.includes('border-color: rgba(201, 164, 104, 0.34)'));
});
