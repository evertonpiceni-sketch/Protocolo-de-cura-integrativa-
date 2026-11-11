import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno uses the approved indigo tone for inactive chakra markers', () => {
  const dashboard = read('src/components/DashboardCura.tsx');

  assert.match(
    dashboard,
    /background: isCompleted \|\| chakra\.day === nextAvailableDay\s*\? chakra\.color\s*:\s*isMisticoModerno\s*\? '#2E3B73'\s*:\s*'#365849'/,
    'Only the Místico Moderno inactive marker must use indigo; other layouts retain their existing treatment.'
  );
});


test('Místico Moderno dashboard image follows the night palette and keeps nature green at the edges', () => {
  const svg = read('public/brand/chakra-body.svg');
  const dashboard = read('src/components/DashboardCura.tsx');
  const css = read('src/mistico-moderno-dashboard-audit.css');

  assert.match(dashboard, /const bodyImage = isMisticoModerno \? '\/brand\/chakra-body\.svg'/);
  assert.match(dashboard, /Figura neutra de costas em meditação/);
  assert.match(svg, /<title id="title">Silhueta neutra em meditação<\/title>/);
  assert.match(svg, /fill="#071525"/);
  assert.match(svg, /stop-color="#0A2742"/);
  assert.match(svg, /id="natural-foliage" fill="#123D39"/);
  assert.match(svg, /id="figure-cloak"/);
  assert.doesNotMatch(svg, /#174c38|#073326|#041d16|#0e5a3e/i,
    'The previous forest-green body treatment must not return.');
  assert.doesNotMatch(svg, /r="(238|300)"|stroke="#d9b95c"|Sahasrara|Ajna/i,
    'Large geometric chakra rings and embedded chakra labels must not return; progress markers are rendered by the dashboard.');
  assert.match(css, /filter: saturate\(\.90\) brightness\(\.98\) contrast\(1\.02\)/);
});
