import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno final palette guard loads after every Style 4 layer and before neutral preselection', () => {
  const main = read('src/main.tsx');
  const finalLayer = main.indexOf("import './mistico-moderno-final-palette-guard.css';");
  const onboarding = main.indexOf("import './mistico-moderno-onboarding-audit.css';");
  const neutral = main.indexOf("import './prestyle-neutral.css';");

  assert.ok(onboarding >= 0, 'Onboarding audit layer must remain imported.');
  assert.ok(finalLayer > onboarding, 'The final palette guard must follow all Style 4 audit layers.');
  assert.ok(neutral > finalLayer, 'The neutral preselection shell must remain after the confirmed-theme layers.');
});

test('Místico Moderno remaps shared green UI utilities to violet, indigo and gold without styling natural image assets', () => {
  const guard = read('src/mistico-moderno-final-palette-guard.css');
  const svg = read('public/brand/chakra-body.svg');

  assert.match(guard, /:root\[data-layout="mistico-moderno"\]/);
  assert.match(guard, /text-emerald-/);
  assert.match(guard, /text-green-/);
  assert.match(guard, /bg-emerald-50/);
  assert.match(guard, /bg-emerald-600/);
  assert.match(guard, /border-emerald-/);
  assert.match(guard, /shadow-emerald/);
  assert.match(guard, /ring-emerald/);
  assert.match(guard, /from-emerald-/);
  assert.match(guard, /#meditation-session/);
  assert.match(guard, /#arcanjo-protocol-backdrop/);
  assert.match(guard, /#achievements-modal > div/);
  assert.match(guard, /#specific-treatment-modal > div/);
  assert.match(guard, /#hooponopono-modal > div/);
  assert.match(guard, /#mobile-install-modal > div/);
  assert.match(guard, /aria-label="Celebração de progresso"/);
  assert.doesNotMatch(guard, /(^|\n)\s*(?:img|svg|picture)\b/i,
    'The palette guard must not recolor photographic or natural image assets.');
  assert.match(svg, /id="natural-foliage" fill="#123D39"/,
    'Natural foliage remains part of the approved neutral body illustration.');
});

test('the full-page Místico Moderno atmosphere no longer contains a detached green wash', () => {
  const theme = read('src/approved-theme.css');
  const style4 = theme.match(/:root\[data-layout="mistico-moderno"\]\{([\s\S]*?)\n\}/)?.[1] ?? '';

  assert.match(style4, /--layout-accent-soft:rgba\(108,63,160,\.16\)/,
    'The approved indigo-violet surface keeps its restrained violet accent.');
  assert.match(style4, /--layout-indigo:#2E3B73/);
  assert.match(style4, /--layout-gold:#D4AF37/);
  assert.match(style4, /--layout-text:#F4F1EB/);
  assert.doesNotMatch(style4, /rgba\(30,107,90/i,
    'Emerald must not become a detached atmospheric wash.');
});
