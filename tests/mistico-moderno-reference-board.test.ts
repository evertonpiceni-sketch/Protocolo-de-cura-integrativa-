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


test('Místico Moderno não herda a arte de fundo da Reintegração', () => {
  const theme = read('src/approved-theme.css');
  const style4Scene = theme.match(/:root\[data-layout="mistico-moderno"\]\s*\{[^}]*--ep-scene:[^}]*\}/)?.[0] ?? '';

  assert.ok(style4Scene, 'O bloco de cena do Estilo 4 deve existir.');
  assert.match(style4Scene, /--ep-scene:none;/);
  assert.ok(!style4Scene.includes('/brand/reintegracao-presenca-arte.png'));
  assert.match(style4Scene, /radial-gradient/);
});


test('a paleta-base do Estilo 4 permanece noturna, violeta, dourada e marfim', () => {
  const theme = read('src/approved-theme.css');
  const style4Tokens = theme.match(/:root\[data-layout="mistico-moderno"\]\s*\{[^}]*--layout-canvas:[^}]*\}/)?.[0] ?? '';

  assert.ok(style4Tokens, 'Os tokens-base do Estilo 4 devem existir.');
  assert.match(style4Tokens, /--layout-canvas:#0A0F18/);
  assert.match(style4Tokens, /--layout-canvas-alt:#141F30/);
  assert.match(style4Tokens, /--layout-accent:#6C3FA0/);
  assert.match(style4Tokens, /--layout-gold:#D4AF37/);
  assert.match(style4Tokens, /--layout-text:#F4F1EB/);
});
