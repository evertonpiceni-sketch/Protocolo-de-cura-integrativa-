import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno keeps emerald inside natural imagery and uses the approved gold canvas accent', () => {
  const chooser = read('src/components/LayoutChoiceModal.tsx');
  const layouts = read('src/config/layouts.ts');
  const canvas = read('src/components/session/SacredEnergyCanvas.tsx');
  const meditation = read('src/components/MeditationSession.tsx');
  const boardCard = read('public/brand/mistico-moderno/prancha-oficial-card.svg');

  const style4Swatches = chooser.match(/layout\.id === 'mistico-moderno'\s*\?\s*\[([^\]]+)\]/)?.[1] ?? '';
  assert.notEqual(style4Swatches, '', 'The Style 4 card must expose its explicit palette swatches.');
  assert.doesNotMatch(style4Swatches, /#1E6B5A|#2E6B4F|#A6B49B/i,
    'Detached green swatches are not allowed in the Místico Moderno interface.');
  assert.match(style4Swatches, /#0A2742/);
  assert.match(style4Swatches, /#6C3FA0/);
  assert.match(style4Swatches, /#D4AF37/);

  assert.match(layouts, /esmeralda somente na vegetação natural integrada \(nunca como acento independente de interface\)/);
  assert.doesNotMatch(canvas, /emeraldLine|São Rafael Emerald/);
  assert.match(canvas, /ctx\.strokeStyle = palette\?\.goldLine/);

  const style4Theme = meditation.match(/const MISTICO_MODERNO_CANVAS_THEME = \{([\s\S]*?)\n\};/)?.[1] ?? '';
  assert.match(style4Theme, /accent: '#5264A4'/);
  assert.match(style4Theme, /goldLine: 'rgba\(212,175,55,0\.38\)'/);
  assert.doesNotMatch(style4Theme, /#1E6B5A|#2E6B4F|#A6B49B|emeraldLine/i);

  assert.match(boardCard, /data-source-file="1001196522.png"/);
  assert.match(boardCard, /data-source-width="1536" data-source-height="1152"/);
  const home = read('src/components/TransformationHome.tsx');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const neutralBody = read('public/brand/chakra-body.svg');
  assert.ok(home.includes('alt="Silhueta neutra em meditação diante de uma paisagem noturna"'));
  assert.ok(arcanjo.includes("alt={isMisticoModerno ? 'Silhueta neutra em meditação diante de uma paisagem noturna'"));
  assert.ok(neutralBody.includes('<title id="title">Silhueta neutra em meditação</title>'));
  assert.ok(neutralBody.includes('A vegetação esmeralda aparece apenas nas bordas da natureza.'));

});
