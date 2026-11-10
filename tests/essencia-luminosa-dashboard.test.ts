import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('../src/components/DashboardCura.tsx', import.meta.url), 'utf8');

test('Essência Luminosa keeps dashboard headings and progress readable on light surfaces', () => {
  assert.match(source, /isEssenciaLuminosa \? 'text-\[#2A2420\]' : 'text-white'/);
  assert.match(source, /isEssenciaLuminosa \? 'text-\[#A87E37\]' : 'text-\[#E4C573\]'/);
  assert.match(source, /linear-gradient\(90deg, #C6A46A, #A87E37\)/);
});

test('Essência Luminosa dashboard uses its light premium surfaces and non-pill primary CTA', () => {
  assert.match(source, /border-\[#E5DAC6\] shadow-\[0_18px_48px_rgba\(112,91,58,\.10\)\]/);
  assert.match(source, /rounded-2xl bg-gradient-to-r from-\[#C6A46A\] to-\[#A87E37\]/);
  assert.match(source, /bg-\[#F7F3E8\] text-\[#A87E37\]/);
});

test('chakra-specific colors remain semantic and shared styles remain conditional', () => {
  assert.match(source, /color: '#22c55e'/);
  assert.match(source, /color: '#facc15'/);
  assert.match(source, /isEssenciaLuminosa \? `linear-gradient\(135deg, \$\{chakra\.color\}, #A87E37\)` : `linear-gradient\(135deg, \$\{chakra\.color\}, #09090E\)`/);
});
