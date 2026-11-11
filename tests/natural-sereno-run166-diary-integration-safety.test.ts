import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const source = readFileSync('src/lib/personalCareIntegration.ts', 'utf8');
const dynamicStyles = source.match(/style\.textContent = `([\s\S]*?)`;/)?.[1] || '';

test('o cartão semanal só recebe paleta depois da escolha explícita e segue os tokens do estilo ativo', () => {
  assert.ok(dynamicStyles.includes(':root[data-layout] #ep-weekly-diary-analysis'));
  assert.ok(dynamicStyles.includes('var(--layout-card)'));
  assert.ok(dynamicStyles.includes('var(--layout-canvas-alt)'));
  assert.ok(dynamicStyles.includes('var(--layout-gold)'));
  assert.ok(dynamicStyles.includes('var(--layout-text)'));
  assert.ok(dynamicStyles.includes('var(--layout-border-card)'));
  assert.doesNotMatch(dynamicStyles, /^\s*#ep-weekly-diary-analysis/m);
  assert.doesNotMatch(dynamicStyles, /#(?:B88736|8F631E|26372a|71511c|2A2420)/i);
});

test('o selo de cursos em preparação é exclusivo do Natural Sereno', () => {
  assert.ok(dynamicStyles.includes(':root[data-layout="natural-sereno"] .ep-courses-locked'));
  assert.ok(dynamicStyles.includes(':root[data-layout="natural-sereno"] .ep-courses-locked::after'));
  assert.doesNotMatch(dynamicStyles, /^\s*\.ep-courses-locked/m);
});

test('a atualização do cartão semanal é idempotente e não realimenta o MutationObserver', () => {
  assert.ok(source.includes('const markup = `'));
  assert.ok(source.includes('if (card.innerHTML !== markup) card.innerHTML = markup;'));
  assert.ok(!source.includes('card.innerHTML = `'));
});

test('a análise semanal nunca lê a primeira conta quando não existe sessão ativa', () => {
  assert.ok(source.includes('return login ? accounts.find(item => item.login === login) : undefined;'));
  assert.ok(!source.includes('accounts[0]'));
  assert.ok(source.includes('if (!account) {\n    card?.remove();\n    return;\n  }'));
});

test('texto livre da anamnese continua escapado antes de ser inserido no cartão', () => {
  assert.ok(source.includes('${escapeDiaryAnalysisText(initialText)}'));
  assert.ok(!source.includes('${initialText}</p></div>'));
});
