import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('o patch dinâmico da Home usa somente o dourado refinado nas legendas do Natural Sereno', () => {
  const flow = read('src/lib/naturalSerenoHomeJourneyStateFix.ts');
  const styleStart = flow.indexOf('style.textContent = `');
  const styleEnd = flow.indexOf('`;\n  document.head.appendChild(style)', styleStart);
  assert.ok(styleStart >= 0 && styleEnd > styleStart, 'Bloco de estilos dinâmicos da Home não encontrado');

  const dynamicStyles = flow.slice(styleStart, styleEnd);
  assert.equal((dynamicStyles.match(/color: #A87E37;/g) || []).length, 3);
  assert.doesNotMatch(dynamicStyles, /#8F631E|#B88736|#D4AF37/);
  assert.ok(dynamicStyles.includes('.ep-home-protocol-choice small'));
  assert.ok(dynamicStyles.includes('.ep-home-protocol-choice button span'));
  assert.ok(dynamicStyles.includes('.ep-home-recommended-label'));
  assert.ok(flow.includes('document.head.appendChild(style)'));
  assert.ok(flow.includes('function applyFlowState()'));
  assert.ok(flow.includes('addFlowStyles();'));
});
