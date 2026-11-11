import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { escapeDiaryAnalysisText } from '../src/lib/personalCareIntegration';

test('diário semanal escapa texto livre da anamnese antes de inserir HTML', () => {
  const hostile = `<img src=x onerror="alert(1)"> & 'texto' "livre"`;
  assert.equal(
    escapeDiaryAnalysisText(hostile),
    '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;texto&#39; &quot;livre&quot;'
  );
});

test('o cartão semanal usa a saída escapada e não interpola texto livre diretamente', () => {
  const source = readFileSync('src/lib/personalCareIntegration.ts', 'utf8');
  assert.ok(source.includes('${escapeDiaryAnalysisText(initialText)}'));
  assert.ok(!source.includes('${initialText}</p></div>'));
});


test('o logo do cabeçalho permanece uma assinatura transparente no Natural Sereno', () => {
  const css = readFileSync('src/natural-sereno-approved-overrides.css', 'utf8');
  assert.match(
    css,
    /:root\[data-layout="natural-sereno"\] #main-header \.ep-brand-signature\s*\{\s*opacity:\s*\.30\s*!important;\s*mix-blend-mode:\s*normal\s*!important;/
  );
});

test('a análise semanal do Diário usa a paleta Natural Sereno sem chapas verdes ou ocre antigo', () => {
  const css = readFileSync('src/natural-sereno-approved-overrides.css', 'utf8');
  const marker = '/* RUN 165 — Diário: alinhar o fechamento semanal ao Natural Sereno e preservar texto de usuário como conteúdo. */';
  const start = css.lastIndexOf(marker);
  assert.ok(start >= 0);
  const block = css.slice(start);
  const selectors = block.split('\n').map(line => line.trim()).filter(line => line.startsWith(':root'));
  assert.ok(selectors.length >= 5);
  assert.ok(selectors.every(selector => selector.startsWith(':root[data-layout="natural-sereno"]')));
  assert.ok(block.includes('color: #2A2421 !important;'));
  assert.ok(block.includes('color: #A87E37 !important;'));
  assert.ok(block.includes('color: #6B625B !important;'));
  assert.ok(block.includes('background: linear-gradient(145deg,#FFFDF8 0%,#FAF7F2 58%,#F5EFE5 100%) !important;'));
  assert.doesNotMatch(block, /#(?:26372a|71511c|B88736|8F631E)/i);
  assert.doesNotMatch(block, /data-layout="(?:elegancia-profunda|essencia-luminosa|mistico-moderno)"/);
  assert.ok(block.includes('#plans-modal [data-universal-core-benefit="true"]'));
  assert.ok(block.includes('background: #FBF8F2 !important;'));
  assert.ok(block.includes('border-color: rgba(200,157,82,.26) !important;'));
});
