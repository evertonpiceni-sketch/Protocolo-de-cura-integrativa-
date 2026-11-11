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
  const component = read('src/components/OnboardingFlow.tsx');
  const importLine = "import './mistico-moderno-onboarding-audit.css';";

  assert.ok(main.includes(importLine));
  assert.ok(main.indexOf(importLine) > main.indexOf("import './mistico-moderno-final-audit.css';"));
  assert.ok(main.indexOf(importLine) < main.indexOf("import './prestyle-neutral.css';"));

  assert.match(css, /:root\[data-layout="mistico-moderno"\] \.ep-care-onboarding/);
  assert.match(css, /#071525/);
  assert.match(css, /#0A2742/);
  assert.match(css, /#141F30/);
  assert.match(css, /#2E3B73|rgba\(46,59,115/);
  assert.match(css, /#6C3FA0|rgba\(108,63,160/);
  assert.match(css, /#D4AF37/);
  assert.match(css, /#E2B96B/);
  assert.match(css, /#F4F1EB/);
  assert.doesNotMatch(css, /#FBF8F2|#F8F4EC|#F5EFE4|#073426|#031B13|#5C5248|#8F631E/);

  assert.match(css, /opacity:\s*\.30/);
  assert.match(css, /opacity:\s*\.26/);
  assert.match(css, /button\[aria-pressed="true"\]/);
  assert.match(css, /button\[aria-pressed="false"\]/);
  assert.match(css, /prefers-reduced-motion/);

  assert.match(component, /step === 1/);
  assert.match(component, /step === 6/);
  assert.match(component, /useReducedMotion/);
  assert.match(component, /APPROVED_LOGO_DATA_URI/);
});
