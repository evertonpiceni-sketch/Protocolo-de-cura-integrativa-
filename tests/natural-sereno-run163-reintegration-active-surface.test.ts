import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const marker = '/* RUN 163 — Reintegração estática: remover resíduos de ouro antigo no Natural Sereno.';

test('RUN 163 cobre as superfícies ativas da Reintegração que ainda usavam o ouro antigo', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  const css = read('src/natural-sereno-approved-overrides.css');
  const start = css.lastIndexOf(marker);
  const block = css.slice(start);

  assert.ok(start >= 0);
  assert.ok(journey.includes('className="ep-reintegration-luminous'));
  assert.ok(journey.includes('className="ep-reintegration-player-voice-card'));
  assert.ok(journey.includes('className="ep-reintegration-progress-fill'));
  assert.ok(journey.includes('className="ep-reintegration-acceptance'));
  assert.ok(journey.includes('className="ep-reintegration-details'));
  assert.ok(journey.includes('className="ep-reintegration-script-card'));

  for (const selector of [
    '.ep-reintegration-luminous',
    '.ep-reintegration-player-voice-card',
    '.ep-reintegration-progress-fill',
    '.ep-reintegration-acceptance input[type="checkbox"]',
    '.ep-reintegration-details',
    '.ep-reintegration-footer',
    '.ep-reintegration-script-card'
  ]) {
    assert.ok(block.includes(selector), `Superfície sem correção: ${selector}`);
  }
  assert.ok(block.includes('color: #A87E37 !important;'));
  assert.ok(block.includes('background: linear-gradient(90deg,#A87E37,#E2B96B) !important;'));
  assert.ok(block.includes('accent-color: #C89D52 !important;'));
});

test('RUN 163 permanece estritamente isolada no Natural Sereno', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const start = css.lastIndexOf(marker);
  const block = css.slice(start);
  const selectors = block.split('\\n').map(line => line.trim()).filter(line => line.startsWith(':root'));

  assert.ok(start >= 0);
  assert.ok(selectors.length >= 10);
  assert.ok(selectors.every(selector => selector.startsWith(':root[data-layout="natural-sereno"]')));
  assert.doesNotMatch(block, /data-layout="(?:elegancia-profunda|essencia-luminosa|mistico-moderno)"/);
});

test('a Reintegração mantém a assinatura discreta e a silhueta neutra aprovadas', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  const visual = read('src/components/ReintegrationPresenceVisual.tsx');
  const neutralBody = read('src/components/NeutralBodyLightProgress.tsx');

  assert.ok(journey.includes('className="h-full w-full object-contain opacity-30"'));
  assert.ok(visual.includes('data-visual-fallback="approved-human"'));
  assert.ok(neutralBody.includes('Silhueta corporal neutra com um único percurso de luz.'));
  assert.ok(neutralBody.includes('sem chakras, mandalas ou marcadores coloridos'));
});
