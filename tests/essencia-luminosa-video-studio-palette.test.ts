import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('Estúdio de Vídeos neutraliza controles verde/amarelo somente na Essência Luminosa', () => {
  const component = read('src/components/VideoStudioLightModal.tsx');
  const css = read('src/essencia-luminosa-approved-overrides.css');

  // Registra as classes legadas presentes no componente compartilhado.
  assert.ok(component.includes("bg-[#174B37]"));
  assert.ok(component.includes("text-[#FFFAE7]"));
  assert.ok(component.includes("text-[#41503A]"));
  assert.ok(component.includes("border-[#5E7153]"));

  const scope = ':root[data-layout="essencia-luminosa"] #video-studio-modal';
  assert.ok(css.includes(scope + ' button[aria-pressed="true"]'));
  assert.ok(css.includes(scope + ' button[aria-pressed="true"] :is(span, svg)'));
  assert.ok(css.includes(scope + ' [class*="text-[#41503A]"]'));
  assert.ok(css.includes(scope + ' [class*="text-[#586454]"]'));
  assert.ok(css.includes(scope + ' [class*="border-[#5E7153]"]'));
  assert.ok(css.includes(scope + ' [class*="bg-[#5E7153]"]'));

  assert.ok(css.includes('background: linear-gradient(135deg, var(--layout-gold-soft), var(--layout-gold)) !important;'));
  assert.ok(css.includes('color: var(--layout-text) !important;'));
  assert.ok(css.includes('color: var(--layout-text-secondary) !important;'));
  assert.ok(css.includes('color-mix(in srgb, var(--layout-accent-soft) 72%, var(--layout-card)) !important;'));

  const run157 = css.slice(css.indexOf('/* RUN 157 — o Estúdio de Vídeos'));
  assert.ok(run157.includes(scope));
  assert.ok(!run157.includes('data-layout="natural-sereno"'));
  assert.ok(!run157.includes('data-layout="elegancia-profunda"'));
  assert.ok(!run157.includes('data-layout="mistico-moderno"'));
});
