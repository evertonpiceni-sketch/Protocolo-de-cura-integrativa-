import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno Arcanjo uses its night palette and gold/amber chakra illumination', () => {
  const source = read('src/components/ArcanjoProtocolView.tsx');
  const chakraBody = source.slice(source.indexOf('function ChakraBody'), source.indexOf('export default function ArcanjoProtocolView'));

  assert.match(chakraBody, /glowPrimary = isMisticoModerno \? '#D4AF37' : config\.cor/);
  assert.match(chakraBody, /glowSecondary = isMisticoModerno \? '#E2B96B' : config\.corSecundaria/);
  assert.match(chakraBody, /bg-\[#0A2742\]/);
  assert.match(chakraBody, /from-\[#080D16\] via-\[#141F30\]\/82/);
  assert.match(chakraBody, /isMisticoModerno \? 'text-\[#D4AF37\]' : 'text-\[#B88736\]'/);
  assert.match(chakraBody, /isMisticoModerno \? 'text-\[#BAC3D1\]' : 'text-\[#c8d9cd\]'/);
});

test('Místico Moderno Arcanjo progress, day markers and reading colors stay within the approved palette', () => {
  const source = read('src/components/ArcanjoProtocolView.tsx');

  assert.match(source, /const progressAccent = isMisticoModerno \? '#D4AF37' : '#c69b3d'/);
  assert.match(source, /const progressAccentLight = isMisticoModerno \? '#E2B96B' : config\.corSecundaria/);
  assert.match(source, /const progressGlow = isMisticoModerno \? '#D4AF37' : config\.cor/);
  assert.match(source, /linear-gradient\(90deg,\$\{progressAccent\},\$\{progressAccentLight\}\)/);
  assert.match(source, /color:isMisticoModerno \? '#E2B96B' : config\.corSecundaria/);
  assert.match(source, /isMisticoModerno \? \(done \? '#6C3FA0' : diaAtual===day \? '#D4AF37' : '#2E3B73'\)/);
  assert.match(source, /isMisticoModerno \? 'bg-\[#0A2742\] text-\[#F4F1EB\]' : 'bg-\[#F8F4EC\] text-\[#2A2420\]'/);
  assert.match(source, /isMisticoModerno \? 'text-\[#BAC3D1\]' : 'text-\[#d9e6dc\]'/);
  assert.match(source, /isMisticoModerno \? 'text-\[#BAC3D1\]' : 'text-\[#e6eee8\]'/);
});

test('other styles retain their existing Arcanjo chakra colors and forest treatment', () => {
  const source = read('src/components/ArcanjoProtocolView.tsx');

  assert.match(source, /isMisticoModerno \? '#D4AF37' : config\.cor/);
  assert.match(source, /isMisticoModerno \? '#E2B96B' : config\.corSecundaria/);
  assert.match(source, /diaAtual===day \\? 'border-\\[#D4AF37\\] bg-\\[#D4AF37\\]\\/12'/);
  assert.match(source, /diaAtual===day \\? 'border-\\[#B88736\\] bg-\\[#e5c66f\\]\\/12'/);
  assert.match(source, /done \\? 'border-\\[#6C3FA0\\]\\/45 bg-\\[#0A0F18\\]\\/30'/);
});
