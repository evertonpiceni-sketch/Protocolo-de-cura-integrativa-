import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('ações globais de saída usam a superfície clara somente na Essência Luminosa', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  const overrides = fs.readFileSync('src/essencia-luminosa-approved-overrides.css', 'utf8');
  const header = fs.readFileSync('src/essencia-luminosa-header-semantic-audit.css', 'utf8');

  assert.ok(app.includes('id="header-btn-logout"'));
  assert.ok(app.includes('id="bottom-btn-logout"'));
  assert.ok(header.includes(':root[data-layout="essencia-luminosa"] #main-header #header-btn-logout'));
  assert.ok(overrides.includes(':root[data-layout="essencia-luminosa"] #bottom-btn-logout'));
  assert.ok(overrides.includes(':root[data-layout="essencia-luminosa"] #settings-view button.bg-rose-600'));
  assert.ok(overrides.includes('var(--layout-card), var(--layout-canvas-alt)'));
  assert.ok(overrides.includes('color: var(--layout-text-secondary) !important;'));
});
