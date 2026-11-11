import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno harmonizes every JournalLog mood state without changing other layouts', () => {
  const main = read('src/main.tsx');
  const journal = read('src/components/JournalLog.tsx');
  const css = read('src/mistico-moderno-journal-audit.css');

  assert.match(main, /import '\.\/mistico-moderno-journal-audit\.css';/);
  assert.match(journal, /border-rose-200 bg-rose-50 text-rose-700/);
  assert.match(journal, /border-amber-200 bg-amber-50 text-amber-700/);
  assert.match(journal, /border-emerald-200 bg-emerald-50 text-emerald-700/);

  const requiredScopedRules = [
    ':root[data-layout="mistico-moderno"] #journal-dashboard-view [class*="border-rose-200"][class*="bg-rose-50"]',
    ':root[data-layout="mistico-moderno"] #journal-dashboard-view [class*="text-rose-700"]',
    ':root[data-layout="mistico-moderno"] #journal-dashboard-view [class*="border-amber-200"][class*="bg-amber-50"]',
    ':root[data-layout="mistico-moderno"] #journal-dashboard-view [class*="text-amber-700"]',
    ':root[data-layout="mistico-moderno"] #journal-dashboard-view [class*="border-emerald-200"][class*="bg-emerald-50"]'
  ];

  for (const selector of requiredScopedRules) {
    assert.ok(css.includes(selector), `Missing Style 4 scoped mood treatment: ${selector}`);
  }

  const uncommented = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const selectors = [...uncommented.matchAll(/([^{}]+)\{/g)]
    .map(match => match[1].trim().replace(/\s+/g, ' '))
    .filter(selector => selector && !selector.startsWith('@') && !/^(from|to|\d+%)/.test(selector));

  const unscoped = selectors.filter(selector => !selector.includes(':root[data-layout="mistico-moderno"]'));
  assert.deepEqual(unscoped, [], 'Journal audit CSS must not affect any other visual style.');
});
