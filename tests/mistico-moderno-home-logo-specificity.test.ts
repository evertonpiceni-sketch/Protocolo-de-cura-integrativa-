import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno keeps the Home and welcome signature transparent and subtle', () => {
  const style4 = read('src/mistico-moderno-final-audit.css');
  const imports = read('src/main.tsx');

  assert.match(style4, /:root\[data-layout="mistico-moderno"\] \.ep-home-hero \.ep-brand-signature-wrap/);
  assert.match(style4, /:root\[data-layout="mistico-moderno"\] \.ep-welcome-audio \.ep-brand-signature-wrap/);
  assert.match(style4, /opacity:\s*1\s*!important/);
  assert.match(style4, /\.ep-home-hero \.ep-brand-signature[\s\S]*?opacity:\s*\.30\s*!important/);
  assert.match(style4, /@media\s*\(max-width:\s*767px\)[\s\S]*?\.ep-home-hero \.ep-brand-signature[\s\S]*?opacity:\s*\.26\s*!important/);

  assert.ok(
    imports.indexOf("import './approved-theme.css';") < imports.indexOf("import './mistico-moderno-final-audit.css';"),
    'The Style 4 override must load after the shared theme layer.'
  );
});
