import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('Perguntas Sistêmicas usa sálvia/champagne nos estados de dia somente na Essência Luminosa', () => {
  const component = read('src/components/SystemicQuestionsModal.tsx');
  const css = read('src/essencia-luminosa-approved-overrides.css');
  const scope = ':root[data-layout="essencia-luminosa"] #systemic-questions-modal';

  assert.ok(component.includes("'bg-emerald-50 border border-emerald-200 text-emerald-700'"));
  assert.ok(component.includes("'bg-amber-50 border border-amber-200 text-amber-700'"));
  assert.ok(component.includes('bg-emerald-400'));
  assert.ok(component.includes('bg-emerald-500'));
  assert.ok(component.includes("bg-[#B88736] text-white ring-2"));
  assert.ok(css.includes(scope + ' button[class*="bg-[#B88736]"]'));
  assert.ok(css.includes(scope + ' button[class*="bg-[#B88736]"] :is(span, svg)'));
  assert.ok(css.includes('background: linear-gradient(135deg, var(--layout-gold-soft), var(--layout-gold)) !important;'));
  assert.ok(css.includes('color: var(--layout-text) !important;'));


  assert.ok(css.includes(scope + ' [class*="bg-emerald-50"]'));
  assert.ok(css.includes(scope + ' [class*="border-emerald-200"]'));
  assert.ok(css.includes(scope + ' [class*="bg-emerald-400"]'));
  assert.ok(css.includes(scope + ' [class*="bg-emerald-500"]'));
  assert.ok(css.includes(scope + ' [class*="bg-amber-50"]'));
  assert.ok(css.includes(scope + ' [class*="border-amber-200"]'));
  assert.ok(css.includes(scope + ' [class*="text-emerald-700"]'));
  assert.ok(css.includes(scope + ' [class*="text-amber-700"]'));
  assert.ok(css.includes('color: color-mix(in srgb, var(--layout-accent) 74%, var(--layout-text)) !important;'));
  assert.ok(css.includes('color: var(--layout-gold-dark) !important;'));
  assert.ok(css.includes('color-mix(in srgb, var(--layout-accent-soft) 68%, var(--layout-card))'));
  assert.ok(css.includes('color-mix(in srgb, var(--layout-gold-soft) 72%, var(--layout-card))'));

  const run158 = css.slice(css.indexOf('/* RUN 158'));
  assert.ok(run158.includes(scope));
  assert.ok(!run158.includes('data-layout="natural-sereno"'));
  assert.ok(!run158.includes('data-layout="elegancia-profunda"'));
  assert.ok(!run158.includes('data-layout="mistico-moderno"'));
});
