import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Natural Sereno usa a silhueta neutra na Reintegração, sem a prancha corporal legada', () => {
  const visual = read('src/components/ReintegrationPresenceVisual.tsx');
  const journey = read('src/components/PersonalJourney21.tsx');
  const neutral = read('src/components/NeutralBodyLightProgress.tsx');
  const css = read('src/natural-sereno-approved-overrides.css');

  assert.match(visual, /neutral\?: boolean/);
  assert.match(visual, /if \(neutral\)[\s\S]*?<NeutralBodyLightProgress/);
  assert.match(visual, /showRoots=\{day === 1\}/);
  assert.match(visual, /focusPosition = day === 1 \? 8 \+ stageProgress \* 0\.84/);
  assert.match(journey, /neutral=\{isNaturalSereno\} active=\{playing\}/);
  assert.equal((journey.match(/neutral=\{isNaturalSereno\} active=\{playing\}/g) || []).length, 2);
  assert.match(journey, /runningBackdropUrl = isNaturalSereno \? '\/brand\/natural-sereno\/cachoeira\.webp' : dayArtworkUrl/);
  assert.ok(journey.indexOf('const isNaturalSereno') < journey.indexOf('const runningBackdropUrl'), 'A condição deve ser declarada antes de ser utilizada');
  assert.match(journey, /url\('\$\{runningBackdropUrl\}'\)/);
  assert.match(neutral, /showRoots\?: boolean/);
  assert.match(neutral, /M50 104 C49 109 45 113 40 118/);
  assert.match(css, /:root\[data-layout="natural-sereno"\] \.reintegration-neutral-body-visual/);
  assert.match(css, /aspect-ratio: 4 \/ 5 !important/);
  assert.doesNotMatch(visual.slice(visual.indexOf('if (neutral)'), visual.indexOf('const revealed')), /reintegracao-presenca-arte\.png|reintegration-presence-frame/);
});

test('as artes antigas permanecem fora do caminho Natural Sereno e os outros estilos não recebem este override', () => {
  const visual = read('src/components/ReintegrationPresenceVisual.tsx');
  const css = read('src/natural-sereno-approved-overrides.css');
  assert.ok(visual.includes('data-visual-fallback="approved-human"'));
  const block = css.slice(css.lastIndexOf('/* RUN 176 — Reintegração Natural Sereno'));
  assert.match(block, /^\n\/\* RUN 176[\s\S]*?:root\[data-layout="natural-sereno"\]/);
  assert.doesNotMatch(block, /data-layout="(?:elegancia-profunda|essencia-luminosa|mistico-moderno)"/);
});
