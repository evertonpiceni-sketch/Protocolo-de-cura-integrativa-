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
  const declarations = block.replace(/\/\*[\s\S]*?\*\//g, '').split(/\r?\n/)
    .filter(line => !line.includes('{') && !line.includes('}') && line.includes(':')).join('\n');
  const declarationBlocks = [...block.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/\{([^{}]*)\}/g)]
    .map(match => match[1]).join('\n');
  assert.doesNotMatch(declarationBlocks, /#8F631E|#B88736|emerald-500/i);

  const selectors = block.replace(/\/\*[\s\S]*?\*\//g, '').split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.endsWith('{') && !line.startsWith('@'));
  assert.ok(selectors.length >= 4);
  assert.ok(selectors.every(selector => selector.startsWith(':root[data-layout="natural-sereno"]')), selectors.join('\n'));

  // Keep the semantic mood categories and their labels intact.
  assert.ok(diary.includes('border-rose-200 bg-rose-50 text-rose-700'));
  assert.ok(diary.includes('border-amber-200 bg-amber-50 text-amber-700'));
  assert.ok(diary.includes('border-emerald-200 bg-emerald-50 text-emerald-700'));
  assert.ok(diary.includes('moodLabel(finalMood)'));

  // The larger "Como estou agora" panel was neutralized in the earlier scoped
  // override; protect it as well as the small semantic mood badges.
  const panelStart = css.indexOf('/* No Diário, o estado "Como estou agora"');
  const panelEnd = css.indexOf('/* Exportar mantém hierarquia premium', panelStart);
  assert.ok(panelStart >= 0 && panelEnd > panelStart, 'override do painel principal do histórico ausente.');
  const panel = css.slice(panelStart, panelEnd);
  assert.ok(panel.includes(':root[data-layout="natural-sereno"] #journal-dashboard-view section[class*="bg-emerald-50/65"]'));
  assert.ok(panel.includes('background: linear-gradient(145deg,#FFFDF8,#F5EFE4) !important;'));
  assert.ok(panel.includes('color: #6F7B55 !important;'));
  assert.ok(panel.includes('color: #2A2421 !important;'));
  assert.ok(panel.includes('border-color: rgba(111,123,85,.24) !important;'));
  assert.ok(diary.includes('bg-emerald-50/65'));
});
