import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno usa a prancha oficial no card do seletor', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const board = readFileSync(resolve(root, 'public/brand/mistico-moderno/prancha-oficial.webp'));

  assert.match(modal, /MISTICO_MODERNO_OFFICIAL_BOARD = '\/brand\/mistico-moderno\/prancha-oficial\.webp'/);
  assert.match(modal, /if \(isMisticoModerno\)/);
  assert.match(modal, /bg-\[#0A0F18\]/);
  assert.match(modal, /text-\[#F4F1EB\]/);
  assert.match(modal, /object-contain p-1/);

  assert.equal(board.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(board.subarray(8, 12).toString('ascii'), 'WEBP');
  assert.ok(board.length > 10000 && board.length < 30000);
});

test('o seletor não aplica nenhum estilo antes da escolha e confirmação explícitas', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  assert.match(modal, /useState<LayoutId \| null>\(null\)/);
  assert.match(modal, /disabled=\{!selectedLayout \|\| isSaving\}/);
  assert.match(modal, /await onSelect\(selectedLayout\)/);
  assert.match(modal, /O estilo só será aplicado depois da sua confirmação/);
});
