import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('a compra do Arcanjo libera o acesso sem abrir o protocolo automaticamente', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');

  assert.ok(app.includes("if (plan === 'arcanjo_7d') {"));
  assert.ok(app.includes("title: 'Acesso liberado'"));
  assert.ok(app.includes('Você pode abri-lo quando desejar pela página inicial.'));
  assert.ok(!app.includes("if (plan === 'arcanjo_7d') setShowArcanjoView(true)"));
});

test('o toast da Essência Luminosa usa superfície clara e ouro suave sem mudar os outros estilos', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  const css = fs.readFileSync('src/essencia-luminosa-approved-overrides.css', 'utf8');

  assert.ok(app.includes('className="ep-app-toast fixed'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] .ep-app-toast'));
  assert.ok(css.includes('background: linear-gradient(145deg, var(--layout-card), var(--layout-canvas-alt)) !important;'));
  assert.ok(css.includes('color: var(--layout-gold-dark) !important;'));
});
