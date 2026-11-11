import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno official board SVG does not upscale its embedded WebP', () => {
  const card = read('public/brand/mistico-moderno/prancha-oficial-card.svg');

  assert.match(card, /<svg[^>]*width="320" height="240" viewBox="0 0 320 240"/);
  assert.match(card, /<image width="320" height="240" href="data:image\/webp;base64,/);
  assert.match(card, /preserveAspectRatio="xMidYMid meet"/);
  assert.doesNotMatch(card, /<svg[^>]*width="384" height="288"/);
});
