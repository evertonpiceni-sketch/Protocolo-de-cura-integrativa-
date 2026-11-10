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
  const selectorText = approved.slice(surfaceStart, approved.indexOf('{', surfaceStart));
  const selectors = selectorText.split(',').map(selector => selector.trim());
  assert.ok(!selectors.some(selector => selector.endsWith('.ep-home-hero')), 'o hero não pode ser alvo do fundo sólido das demais seções');
  assert.ok(finalTheme.includes("--ep-scene: url('https://images.unsplash.com/photo-1617359073337-ba0fa2b80df4?auto=format&fit=crop&w=1600&h=900&q=80')"));
  assert.ok(finalTheme.includes('var(--ep-scene) center 56%/cover no-repeat !important;'));
});

test('a ordem de importação mantém a camada de tema aprovado por último sem apagar a cena do hero', () => {
  assert.ok(main.indexOf("import './essencia-luminosa-final-audit.css';") < main.indexOf("import './essencia-luminosa-approved-overrides.css';"));
});

const approvedOverrides = fs.readFileSync('src/essencia-luminosa-approved-overrides.css', 'utf8');
const layoutChoice = fs.readFileSync('src/components/LayoutChoiceModal.tsx', 'utf8');
const app = fs.readFileSync('src/App.tsx', 'utf8');

test('a camada final não substitui a fotografia costeira nem duplica o tema do hero', () => {
  assert.doesNotMatch(approvedOverrides, /--ep-scene\\s*:/);
  assert.doesNotMatch(approvedOverrides, /--ep-home-scene-overlay/);
  assert.doesNotMatch(approvedOverrides, /photo-1745403322140-d0a3a8c4f974/);
  assert.match(finalTheme, /--ep-scene:\\s*url\\('https:\\/\\/images\\.unsplash\\.com\\/photo-1617359073337-ba0fa2b80df4/);
  assert.match(finalTheme, /\\.ep-home-hero,[\\s\\S]*?background:[\\s\\S]*?var\\(--ep-scene\\)/);
});

test('a prévia usa a prancha oficial e exige seleção antes de confirmar', () => {
  assert.ok(fs.existsSync('public/brand/essencia-luminosa/prancha-oficial.webp'));
  assert.ok(fs.statSync('public/brand/essencia-luminosa/prancha-oficial.webp').size > 0);
  assert.ok(layoutChoice.includes('/brand/essencia-luminosa/prancha-oficial.webp'));
  assert.match(layoutChoice, /useState<LayoutId \\| null>\\(null\\)/);
  assert.match(layoutChoice, /disabled=\\{!selectedLayout \\|\\| isSaving\\}/);
  assert.match(layoutChoice, /await onSelect\\(selectedLayout\\)/);
  assert.ok(app.includes('(!layoutConfirmedThisSession || layoutChoiceRequested)'));
});
