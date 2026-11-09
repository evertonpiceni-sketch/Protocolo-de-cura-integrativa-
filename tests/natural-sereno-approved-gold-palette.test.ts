import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const naturalSerenoCss = [
  'src/natural-sereno.css',
  'src/natural-sereno-refinement.css',
  'src/natural-sereno-mobile-fixes.css',
  'src/natural-sereno-final-audit.css',
  'src/natural-sereno-home-latest-approved.css',
  'src/natural-sereno-milestone-audit.css',
  'src/natural-sereno-journal-dashboard-audit.css',
  'src/natural-sereno-contact-audit.css',
  'src/natural-sereno-home-surface-audit.css',
  'src/natural-sereno-guides-semantic-audit.css',
  'src/natural-sereno-legacy-green-audit.css',
  'src/natural-sereno-approved-overrides.css'
];

test('as doze camadas Natural Sereno não mantêm ouro antigo, amarelo saturado ou verde-floresta em declarações ativas', () => {
  for (const path of naturalSerenoCss) {
    const source = read(path).replace(/\/\*[\s\S]*?\*\//g, '');
    const declarations = [...source.matchAll(/\{([^{}]*)\}/g)].map(match => match[1]).join('\n');
    assert.doesNotMatch(
      declarations,
      /#B88736\b|#8F631E\b|rgba\(\s*184\s*,\s*135\s*,\s*54|rgba\(\s*182\s*,\s*139\s*,\s*54|#E4C573\b|#E5C66F\b|#FACC15\b|#EAB308\b|#CA8A04\b|#2D4A3E\b|#073B2B\b/i,
      `${path} ainda contém um token visual antigo em uma declaração ativa.`
    );
  }
});

test('a camada final mantém os dourados refinados e o texto café nos CTAs premium', () => {
  const approved = read('src/natural-sereno-approved-overrides.css');
  assert.ok(approved.includes('#E2B96B'));
  assert.ok(approved.includes('#C89D52'));
  assert.ok(approved.includes('#A87E37'));
  assert.ok(approved.includes('color:#2A2421'));
});
