import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('o acolhimento mobile do Natural Sereno mantém a fotografia real sobre base creme', () => {
  const home = read('src/components/NaturalSerenoHome.tsx');
  const transformation = read('src/components/TransformationHome.tsx');
  const css = read('src/natural-sereno-approved-overrides.css');
  const mobile = read('src/natural-sereno-mobile-fixes.css');

  assert.match(transformation, /props\.visualLayout === 'natural-sereno'[\s\S]*?<NaturalSerenoHome/);
  assert.match(home, /className="ns-app ns-welcome" data-ns-screen="welcome"/);

  const run119 = css.slice(css.lastIndexOf('/* RUN 119 — acolhimento mobile.'));
  assert.ok(run119.includes('@media (max-width: 899px)'));
  assert.ok(run119.includes('background: #FAF7F2 !important;'));
  assert.ok(run119.includes("url('/brand/natural-sereno/acolhimento.webp')"));
  assert.ok(run119.includes('rgba(250,247,242,.72)'));
  assert.ok(run119.includes('rgba(250,247,242,.86)'));
  assert.ok(run119.includes('color: #2A2421 !important;'));
  assert.ok(run119.includes('color: #6B625B !important;'));
  assert.ok(run119.includes('background: rgba(250,247,242,.94) !important;'));
  assert.doesNotMatch(run119, /var\(--ns-waterfall\)|rgba\(42,36,33,\.58\)|rgba\(42,36,33,\.72\)/);

  // The desktop-specific composition already uses the same acolhimento image.
  assert.match(mobile, /@media \(min-width: 900px\)[\s\S]*?\.ns-welcome::before[\s\S]*?acolhimento\.webp/);
});
