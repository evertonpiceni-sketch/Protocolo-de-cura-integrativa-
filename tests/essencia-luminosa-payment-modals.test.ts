import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const css = fs.readFileSync('src/essencia-luminosa-approved-overrides.css', 'utf8');
const plans = fs.readFileSync('src/components/ProUpgradeModal.tsx', 'utf8');
const treatment = fs.readFileSync('src/components/SpecificTreatmentModal.tsx', 'utf8');
const catalog = fs.readFileSync('src/lib/paymentCatalog.ts', 'utf8');
const run173 = css.slice(css.lastIndexOf('/* RUN 173 —'));

test('Planos & Acessos uses the light champagne palette only in Essência Luminosa', () => {
  assert.ok(plans.includes('id="plans-modal"'));
  assert.ok(run173.includes(':root[data-layout="essencia-luminosa"] #plans-modal > div'));
  assert.ok(run173.includes('linear-gradient(180deg, var(--layout-canvas), var(--layout-canvas-alt))'));
  assert.ok(run173.includes('[class*="bg-[#073B2B]"]'));
  assert.ok(run173.includes('[class*="text-[#26372A]"]'));
  assert.ok(run173.includes('var(--layout-gold-gradient)'));
});

test('Prática Individual neutralizes inherited emerald, amber and indigo surfaces', () => {
  assert.ok(treatment.includes('id="specific-treatment-modal"'));
  assert.ok(run173.includes('#specific-treatment-modal [class*="bg-emerald-"]'));
  assert.ok(run173.includes('#specific-treatment-modal [class*="bg-amber-"]'));
  assert.ok(run173.includes('#specific-treatment-modal [class*="bg-indigo-"]'));
  assert.ok(run173.includes('#specific-treatment-modal button[class*="from-emerald-600"]'));
  assert.ok(run173.includes('.ep-treatment-recommended-badge'));
});

test('the RUN 173 selectors remain isolated to Style 3 and preserve the approved catalog', () => {
  const selectorLines = run173.split('\n').map(line => line.trim()).filter(line => line.endsWith('{'));
  assert.ok(selectorLines.length >= 25);
  assert.ok(selectorLines.every(line => line.startsWith(':root[data-layout="essencia-luminosa"]')));
  assert.ok(!run173.includes('data-layout="natural-sereno"'));
  assert.ok(!run173.includes('data-layout="elegancia-profunda"'));
  assert.ok(!run173.includes('data-layout="mistico-moderno"'));
  assert.ok(catalog.includes("jornada_7d: { cents: 2500, days: 7"));
  assert.ok(catalog.includes("jornada_21d: { cents: 5000, days: 21"));
  assert.ok(catalog.includes("7: 5990"));
  assert.ok(catalog.includes("21: 9990"));
});


const run174 = css.slice(css.lastIndexOf('/* RUN 174 —'));

test('RUN 174 removes residual green hover and saturated gold states from payment modals', () => {
  assert.ok(plans.includes('hover:bg-[#073B2B]/5'));
  assert.ok(treatment.includes('bg-[#B88736] text-white'));
  assert.ok(run174.includes('#plans-modal button[class*="hover:bg-[#073B2B]"]:hover'));
  assert.ok(run174.includes('#specific-treatment-modal button[class*="bg-[#B88736]"]'));
  assert.ok(run174.includes('#specific-treatment-modal [class*="text-[#B88736]"]'));
  assert.ok(run174.includes('#specific-treatment-modal > div > div.absolute[class*="bg-emerald-"]'));
  assert.ok(run174.includes('#specific-treatment-modal a[class*="hover:bg-emerald-"]:hover'));
  assert.ok(run174.includes('#specific-treatment-modal [class*="shadow-emerald-"]'));
});

test('RUN 174 remains fully scoped to Essência Luminosa', () => {
  const selectorLines = run174.split('\n').map(line => line.trim()).filter(line => line.endsWith('{'));
  assert.ok(selectorLines.length >= 7);
  assert.ok(selectorLines.every(line => line.startsWith(':root[data-layout="essencia-luminosa"]')));
  assert.ok(!run174.includes('data-layout="natural-sereno"'));
  assert.ok(!run174.includes('data-layout="elegancia-profunda"'));
  assert.ok(!run174.includes('data-layout="mistico-moderno"'));
});
