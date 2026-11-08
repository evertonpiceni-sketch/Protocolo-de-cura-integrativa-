import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('Elegância Profunda harmoniza os acentos dos modais de Mapa e Numerologia', () => {
  const css = read('src/elegancia-profunda-maps-audit.css');
  const main = read('src/main.tsx');

  assert.ok(main.includes("import './elegancia-profunda-maps-audit.css';"));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"]'));
  assert.ok(css.includes('[class*="bg-amber-50"]'));
  assert.ok(css.includes('[class*="text-emerald-"]'));
  const numerology = read('src/components/NumerologyModal.tsx');
  assert.ok(numerology.includes('text-rose-700'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] #numerology-modal [class*="text-rose-"]'));
  assert.ok(css.includes('var(--layout-gold-light)'));
  assert.ok(css.includes('var(--layout-accent)'));
  assert.ok(css.includes('#astral-map-modal a[class~="bg-emerald-700"]'));
  assert.ok(!css.includes('data-layout="essencia-luminosa"'));
  assert.ok(!css.includes('data-layout="natural-sereno"'));
  assert.ok(!css.includes('data-layout="mistico-moderno"'));
});

test('o acesso à Numerologia Completa descreve o benefício confirmado sem preço vazio ou PRO genérico', () => {
  const modal = read('src/components/NumerologyModal.tsx');

  assert.ok(modal.includes('const isFullUnlocked = Boolean(userProfile.numerologyPurchased);'));
  assert.ok(modal.includes('O acesso completo depende do benefício de Numerologia estar registrado e confirmado na sua conta.'));
  assert.ok(!modal.includes('<strong></strong>'));
  assert.ok(!modal.includes('entitlement PRO confirmado pelo servidor'));
  assert.ok(modal.includes('Ver Planos PRO'));
});

test('checkout compartilhado recebe acabamento próprio da Elegância Profunda', () => {
  const css = read('src/elegancia-profunda-modal-audit.css');
  const main = read('src/main.tsx');
  const checkout = read('src/components/ProUpgradeModal.tsx');

  assert.ok(main.includes("import './elegancia-profunda-modal-audit.css';"));
  assert.ok(checkout.includes('id="plans-modal"'));
  assert.ok(checkout.includes('id="plan-benefit-choice"'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] #plans-modal > div'));
  assert.ok(css.includes('#plans-modal #plan-benefit-choice'));
  assert.ok(css.includes('#plans-modal [data-benefit-choice]'));
  assert.ok(css.includes('[data-benefit-choice][aria-pressed="true"]'));
  assert.ok(css.includes('#plans-modal article > button:last-child'));
  assert.ok(!css.includes('data-layout="essencia-luminosa"'));
  assert.ok(!css.includes('data-layout="natural-sereno"'));
  assert.ok(!css.includes('data-layout="mistico-moderno"'));
});
