import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno uses gold and indigo for every dashboard progress state while other layouts keep their chakra colors', () => {
  const dashboard = read('src/components/DashboardCura.tsx');

  assert.match(dashboard, /const markerColor = isMisticoModerno \? '#D4AF37' : chakra\.color;/);
  assert.match(dashboard, /const markerGlow = isMisticoModerno \? 'rgba\(212,175,55,\.46\)' : chakra\.glow;/);
  assert.match(dashboard, /const inactiveMarkerColor = isMisticoModerno \? '#2E3B73' : '#365849';/);
  assert.match(dashboard, /background: isCompleted \|\| isCurrent \? markerColor : inactiveMarkerColor/);
  assert.match(dashboard, /boxShadow: isCompleted \|\| isCurrent \? `0 0 18px 6px \$\{markerColor\}` : 'none'/);
  assert.match(dashboard, /const completedAccent = isMisticoModerno \? '#6C3FA0' : chakra\.color;/);
  assert.match(dashboard, /const currentAccent = isMisticoModerno \? '#D4AF37' : chakra\.color;/);
  assert.match(dashboard, /const currentGlow = isMisticoModerno \? 'rgba\(108,63,160,\.24\)' : chakra\.glow;/);
  assert.match(dashboard, /background: isMisticoModerno \? 'linear-gradient\(135deg, #A87E37, #E2B96B\)'/);
});

test('Místico Moderno dashboard backdrop keeps emerald confined to the natural body image, not as a floating green wash', () => {
  const svg = read('public/brand/chakra-body.svg');
  const dashboard = read('src/components/DashboardCura.tsx');
  const css = read('src/mistico-moderno-dashboard-audit.css');

  assert.match(dashboard, /const bodyImage = isMisticoModerno \? '\/brand\/chakra-body\.svg'/);
  assert.match(dashboard, /Figura neutra de costas em meditação/);
  assert.match(svg, /<title id="title">Silhueta neutra em meditação<\/title>/);
  assert.match(svg, /stop-color="#071525"/);
  assert.match(svg, /stop-color="#0A2742"/);
  assert.match(svg, /id="natural-foliage" fill="#123D39"/);
  assert.match(svg, /id="figure-cloak"/);
  assert.doesNotMatch(svg, /#174c38|#073326|#041d16|#0e5a3e/i,
    'The previous forest-green body treatment must not return.');
  assert.doesNotMatch(svg, /r="(238|300)"|stroke="#d9b95c"|Sahasrara|Ajna/i,
    'Large geometric chakra rings and embedded chakra labels must not return; progress markers are rendered by the dashboard.');
  assert.match(css, /filter: saturate\(\.90\) brightness\(\.98\) contrast\(1\.02\)/);
  assert.doesNotMatch(css, /rgba\(5,\s*150,\s*105/i,
    'Emerald is reserved for foliage integrated into the neutral body artwork, not a detached dashboard glow.');
  assert.match(css, /rgba\(212,\s*175,\s*55,\s*\.07\)/);
});

test('Místico Moderno energy-field accents stay indigo/violet and reserve emerald for natural imagery', () => {
  const session = read('src/components/MeditationSession.tsx');
  const canvas = read('src/components/session/SacredEnergyCanvas.tsx');
  const theme = session.match(/const MISTICO_MODERNO_CANVAS_THEME = \{([\s\S]*?)\n\};/)?.[1] ?? '';

  assert.match(theme, /accent: '#5264A4'/);
  assert.match(theme, /sageSoft: 'rgba\(46,59,115,0\.12\)'/);
  assert.match(theme, /sageGlow: 'rgba\(108,63,160,0\.20\)'/);
  assert.match(theme, /sageLine: 'rgba\(82,100,164,0\.40\)'/);
  assert.doesNotMatch(theme, /#1E6B5A|rgba\(30,107,90|emeraldLine/);
  assert.match(canvas, /case ProtocolStage\.ATERRAMENTO:[\s\S]*?palette\?\.sageGlow[\s\S]*?palette\?\.sageSoft[\s\S]*?palette\?\.sageLine/);
  assert.doesNotMatch(canvas, /Sage Green aura|Sage green radial glow/);
});
