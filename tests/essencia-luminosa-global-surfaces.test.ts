import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const app = fs.readFileSync('src/App.tsx', 'utf8');
const css = fs.readFileSync('src/essencia-luminosa-approved-overrides.css', 'utf8');

test('o contato flutuante usa sálvia e champagne somente na Essência Luminosa', () => {
  assert.ok(app.includes('id="floating-whatsapp-btn"'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #floating-whatsapp-btn {'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #floating-whatsapp-btn:hover {'));
  assert.ok(css.includes('var(--layout-accent-soft)'));
  assert.ok(css.includes('var(--layout-gold-soft)'));
  assert.ok(css.includes('fill: color-mix(in srgb, var(--layout-accent-soft) 54%, var(--layout-card)) !important;'));
});

test('a aparência selecionada nas Configurações tem destaque champagne distinto das opções não selecionadas', () => {
  assert.ok(app.includes('className={`ep-layout-choice min-h-24'));
  assert.ok(app.includes('aria-pressed={selected}'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #settings-view .ep-layout-choice[aria-pressed="true"]'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #settings-view .ep-layout-choice[aria-pressed="false"]'));
  assert.ok(css.includes('background: linear-gradient(145deg, color-mix(in srgb, var(--layout-gold-soft) 42%, var(--layout-card)), var(--layout-card)) !important;'));
});
