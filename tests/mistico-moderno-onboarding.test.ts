import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno gives the shared welcome flow its approved night identity', () => {
  const main = read('src/main.tsx');
  const css = read('src/mistico-moderno-onboarding-audit.css');
  const style3Css = read('src/essencia-luminosa-onboarding-audit.css');
  const component = read('src/components/OnboardingFlow.tsx');
  const importLine = "import './mistico-moderno-onboarding-audit.css';";

  assert.ok(main.includes(importLine));
  assert.ok(main.indexOf(importLine) > main.indexOf("import './mistico-moderno-final-audit.css';"));
  assert.ok(main.indexOf(importLine) < main.indexOf("import './prestyle-neutral.css';"));

  assert.match(css, /:root\[data-layout="mistico-moderno"\] \.ep-care-onboarding/);
  assert.match(css, /#071525/);
  assert.match(css, /#0A2742/);
  assert.match(css, /#141F30/);
  assert.match(css, /rgba\(46,59,115/);
  assert.match(css, /rgba\(108,63,160/);
  assert.match(css, /#D4AF37/);
  assert.match(css, /#E2B96B/);
  assert.match(css, /#F4F1EB/);

  const declarations = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/[^{}]+\{/g, '')
    .replace(/[{}]/g, '');
  assert.doesNotMatch(declarations, /#FBF8F2|#F8F4EC|#F5EFE4|#073426|#031B13|#5C5248|#8F631E/,
    'Legacy colors may be mentioned only as selector targets, never as rendered Style 4 values.');

  const selectors = [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{/g)]
    .map(match => match[1].trim())
    .filter(selector => selector && !selector.startsWith('@'));
  assert.ok(selectors.length >= 10);
  assert.ok(selectors.every(selector => selector.includes(':root[data-layout="mistico-moderno"]')));

  assert.match(css, /opacity:\s*\.30/);
  assert.match(css, /opacity:\s*\.26/);
  assert.match(css, /button\[aria-pressed="true"\]/);
  assert.match(css, /button\[aria-pressed="false"\]/);
  assert.match(css, /prefers-reduced-motion/);

  assert.match(style3Css, /:root\[data-layout="essencia-luminosa"\]/);
  assert.doesNotMatch(style3Css, /data-layout="mistico-moderno"/);

  assert.match(component, /step === 1/);
  assert.match(component, /step === 6/);
  assert.match(component, /useReducedMotion/);
  assert.match(component, /APPROVED_LOGO_DATA_URI/);
});
