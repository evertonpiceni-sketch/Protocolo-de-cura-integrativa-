import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('RUN 159 — histórico do Diário usa acentos suaves no Natural Sereno', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const diary = read('src/components/JournalLog.tsx');
  const start = css.lastIndexOf('/* RUN 159 — Diário de histórico');
  assert.ok(start >= 0, 'bloco de correção do Diário ausente');
  const block = css.slice(start);

  assert.ok(block.includes(':root[data-layout="natural-sereno"] #journal-dashboard-view'));
  assert.ok(block.includes('color: #A87E37 !important;'));
  assert.ok(block.includes('background: #F7F0EC !important;'));
  assert.ok(block.includes('background: #F5EFE5 !important;'));
  assert.ok(block.includes('background: #F0F2EB !important;'));
  assert.ok(block.includes('color: #5E6948 !important;'));
  assert.doesNotMatch(block, /#8F631E|#B88736|emerald-500/i);

  const selectors = [...block.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{/g)]
    .map(match => match[1].trim())
    .flatMap(selector => selector.split(',').map(part => part.trim()));
  assert.ok(selectors.length >= 4);
  assert.ok(selectors.every(selector => selector.startsWith(':root[data-layout="natural-sereno"] #journal-dashboard-view')));

  // Keep the semantic mood categories and their labels intact.
  assert.ok(diary.includes('border-rose-200 bg-rose-50 text-rose-700'));
  assert.ok(diary.includes('border-amber-200 bg-amber-50 text-amber-700'));
  assert.ok(diary.includes('border-emerald-200 bg-emerald-50 text-emerald-700'));
  assert.ok(diary.includes('moodLabel(finalMood)'));
});
