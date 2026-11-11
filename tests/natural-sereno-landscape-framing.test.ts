import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('a prévia Natural Sereno enquadra o nascer do sol e mantém a prancha oficial como referência', () => {
  const chooser = read('src/components/LayoutChoiceModal.tsx');

  assert.ok(chooser.includes("style={{ objectPosition: 'center 35%' }}"));
  assert.ok(chooser.includes('NATURAL_SERENO_OFFICIAL_BOARD'));
  assert.ok(chooser.includes('Prancha oficial de referência. Decisões posteriores prevalecem.'));
  assert.ok(existsSync(new URL('../docs/visual-qa/natural-sereno/reference.jpg', import.meta.url)));
  assert.ok(existsSync(new URL('../public/brand/natural-sereno/vale-amanhecer.webp', import.meta.url)));
});

test('o hero ajusta o enquadramento da paisagem separadamente para desktop e mobile', () => {
  const homeModel = read('src/lib/naturalSerenoHomeApprovedModel.ts');

  assert.ok(homeModel.includes('var(--ns-valley) center 52% / cover no-repeat !important;'));
  assert.ok(homeModel.includes('background-position: center, center 48% !important;'));
  assert.doesNotMatch(homeModel, /center 35%|center 38%/);
  assert.ok(homeModel.includes('@media (max-width: 767px)'));

  const approvedHomeCss = read('src/natural-sereno-home-latest-approved.css');
  assert.ok(approvedHomeCss.includes('background-position: center 52% !important;'));
  assert.ok(approvedHomeCss.includes('background-position: center 48% !important;'));
});

test('o player mantém a cachoeira visível no desktop e preserva o enquadramento mobile', () => {
  const player = read('src/components/MeditationSession.tsx');
  const overrides = read('src/natural-sereno-approved-overrides.css');

  assert.ok(player.includes('/brand/natural-sereno/cachoeira.webp'));
  assert.ok(overrides.includes('object-position: center 16%;'));
  assert.ok(overrides.includes('object-position: center 52%;'));
  assert.ok(overrides.includes('@media (max-width: 640px)'));
  assert.ok(overrides.includes('@media (min-width: 641px)'));
  assert.ok(existsSync(new URL('../public/brand/natural-sereno/cachoeira.webp', import.meta.url)));
});
