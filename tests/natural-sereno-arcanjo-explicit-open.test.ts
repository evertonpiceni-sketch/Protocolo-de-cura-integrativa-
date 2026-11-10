import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Arcanjo não abre automaticamente apenas porque a assinatura é arcanjo_7d', () => {
  const app = read('src/App.tsx');

  assert.ok(app.includes("const [showArcanjoView, setShowArcanjoView] = useState<boolean>(false);"));
  assert.ok(app.includes(') : showArcanjoView ? ('));
  assert.doesNotMatch(app, /showArcanjoView\\s*\\|\\|\\s*userProfile\\.subscriptionPlan\\s*===\\s*['"]arcanjo_7d['"]/);
  assert.doesNotMatch(app, /userProfile\\.subscriptionPlan\\s*===\\s*['"]arcanjo_7d['"]\\s*\\?/);

  const openHandlerStart = app.indexOf('const handleOpenProtocol = () => {');
  const openHandlerEnd = app.indexOf('};', openHandlerStart);
  assert.ok(openHandlerStart >= 0 && openHandlerEnd > openHandlerStart);
  assert.ok(app.slice(openHandlerStart, openHandlerEnd).includes('setShowArcanjoView(true)'));
});
