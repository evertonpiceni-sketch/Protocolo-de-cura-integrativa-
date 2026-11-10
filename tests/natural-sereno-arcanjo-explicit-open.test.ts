import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('Arcanjo não abre automaticamente apenas porque a assinatura é arcanjo_7d', () => {
  const app = read('src/App.tsx');

  assert.ok(app.includes("const [showArcanjoView, setShowArcanjoView] = useState<boolean>(false);"));
  assert.ok(app.includes(') : showArcanjoView ? ('));
  assert.doesNotMatch(app, /showArcanjoView\s*\|\|\s*userProfile\.subscriptionPlan\s*===\s*['"]arcanjo_7d['"]/);
  assert.doesNotMatch(app, /userProfile\.subscriptionPlan\s*===\s*['"]arcanjo_7d['"]\s*\?/);

  const openHandlerStart = app.indexOf('const handleOpenProtocol = () => {');
  const openHandlerEnd = app.indexOf('};', openHandlerStart);
  assert.ok(openHandlerStart >= 0 && openHandlerEnd > openHandlerStart);
  assert.ok(app.slice(openHandlerStart, openHandlerEnd).includes('setShowArcanjoView(true)'));
});

test('a confirmação de compra do Arcanjo libera o acesso sem abrir o protocolo automaticamente', () => {
  const app = read('src/App.tsx');
  const paidStart = app.indexOf("if (data.status === 'paid' && data.user?.profile) {");
  const paidEnd = app.indexOf("throw new Error('Aguardando confirmação segura do pagamento.');", paidStart);
  assert.ok(paidStart >= 0 && paidEnd > paidStart, 'ramo de pagamento confirmado não encontrado');

  const paidBranch = app.slice(paidStart, paidEnd);
  assert.ok(paidBranch.includes('closeProModal();'));
  assert.ok(paidBranch.includes('setInAppToast({'));
  assert.ok(paidBranch.includes('Acesso ao Arcanjo liberado'));
  assert.ok(paidBranch.includes('Abra o protocolo quando desejar'));
  assert.ok(!paidBranch.includes('setShowArcanjoView(true)'));

  // As duas aberturas restantes são intencionais: evento explícito e botão do painel.
  assert.equal(app.split('setShowArcanjoView(true)').length - 1, 2);
  assert.ok(app.includes("onOpenArcanjo={() => userProfile.plan === 'pro' ? setShowArcanjoView(true) : setShowProModal(true)}"));

  const naturalSerenoCss = read('src/natural-sereno-approved-overrides.css');
  assert.ok(naturalSerenoCss.includes(':root[data-layout="natural-sereno"] .ep-app-toast'));
});
