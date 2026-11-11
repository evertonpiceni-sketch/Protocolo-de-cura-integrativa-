import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('assinatura oficial do Natural Sereno mantém opacidade aprovada de 30% em desktop e mobile', () => {
  const css = read('src/natural-sereno-approved-overrides.css');

  assert.doesNotMatch(css, /opacity\\s*:\\s*\\.26\\b/);
  assert.ok(css.includes('opacity:.30!important;'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #main-header .ep-brand-signature'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] .ep-care-onboarding-card .ep-brand-signature'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] :is(.approved-brand,[data-approved-brand],.ep-brand-signature,.ns-welcome-brand)'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #auth-loading-view img'));
});
