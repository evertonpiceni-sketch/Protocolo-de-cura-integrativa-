import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno uses a night fade on the anamnesis result image', () => {
  const home = read('src/components/TransformationHome.tsx');
  const style4 = read('src/mistico-moderno-final-audit.css');

  assert.match(home, /ep-chakra-result-overlay absolute inset-0 bg-gradient-to-t from-\[#FFFFFF\]/);
  assert.match(style4, /:root\[data-layout="mistico-moderno"\] \.ep-home \.ep-chakra-result-overlay/);
  assert.match(style4, /linear-gradient\(\s*to top,\s*rgba\(10, 15, 24, 0\.92\)/);
  assert.match(style4, /rgba\(10, 15, 24, 0\.34\) 48%/);
});
