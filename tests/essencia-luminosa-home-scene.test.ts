import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const approved = fs.readFileSync('src/essencia-luminosa-approved-overrides.css', 'utf8');
const finalTheme = fs.readFileSync('src/essencia-luminosa-final-audit.css', 'utf8');
const main = fs.readFileSync('src/main.tsx', 'utf8');

test('a camada final mantém a fotografia costeira aprovada visível no hero da Essência Luminosa', () => {
  const surfaceStart = approved.indexOf(':root[data-layout="essencia-luminosa"] .ep-home>section:not(.ep-home-hero)');
  const surfaceEnd = approved.indexOf('}', surfaceStart);
  assert.ok(surfaceStart >= 0 && surfaceEnd > surfaceStart, 'as superfícies internas da Home devem continuar harmonizadas');
  const surfaceRule = approved.slice(surfaceStart, surfaceEnd);
  assert.ok(!surfaceRule.includes('.ep-home-hero'), 'o hero não pode ser coberto pelo fundo sólido das demais seções');
  assert.ok(finalTheme.includes("--ep-scene: url('https://images.unsplash.com/photo-1617359073337-ba0fa2b80df4?auto=format&fit=crop&w=1600&h=900&q=80')"));
  assert.ok(finalTheme.includes('var(--ep-scene) center 56%/cover no-repeat !important;'));
});

test('a ordem de importação mantém a camada de tema aprovado por último sem apagar a cena do hero', () => {
  assert.ok(main.indexOf("import './essencia-luminosa-final-audit.css';") < main.indexOf("import './essencia-luminosa-approved-overrides.css';"));
});
