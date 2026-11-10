import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('protocolo do Arcanjo só abre após ação explícita, não apenas pelo plano', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');

  assert.ok(app.includes(') : showArcanjoView ? ('));
  assert.ok(!app.includes("showArcanjoView || userProfile.subscriptionPlan === 'arcanjo_7d'"));
  assert.ok(app.includes("onOpenArcanjo={() => userProfile.plan === 'pro' ? setShowArcanjoView(true) : setShowProModal(true)}"));
});
