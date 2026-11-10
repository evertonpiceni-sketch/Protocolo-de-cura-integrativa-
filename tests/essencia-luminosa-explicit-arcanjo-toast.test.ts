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

test('o toast da Essência Luminosa usa superfície clara e ouro suave', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');

  assert.ok(app.includes("'bg-[#FFFFF8] border border-[#E5DAC6]"));
  assert.ok(app.includes("'text-[#A87E37]'"));
  assert.ok(app.includes("'bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950"));
});
