import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('a Reintegração usa silhueta neutra em todas as quatro atmosferas', () => {
  const visual = read('src/components/ReintegrationPresenceVisual.tsx');
  const journey = read('src/components/PersonalJourney21.tsx');
  const videoStudio = read('src/components/VideoStudioLightModal.tsx');
  const neutral = read('src/components/NeutralBodyLightProgress.tsx');
  const css = read('src/index.css');

  assert.ok(visual.includes('NeutralBodyLightProgress'));
  assert.ok(visual.includes('showRoots={day === 1}'));
  assert.doesNotMatch(visual, /neutral\\?: boolean|if \\(neutral\\)|reintegracao-presenca-arte\\.png|reintegration-presence-frame|data-visual-fallback/);
  assert.equal((journey.match(/<ReintegrationPresenceVisual day=\\{day\\} elapsedSeconds=\\{elapsedSeconds\\} active=\\{playing\\} \\/>/g) || []).length, 2);
  assert.doesNotMatch(journey, /neutral=\\{isNaturalSereno\\}/);
  assert.ok(videoStudio.includes('<ReintegrationPresenceVisual day={day} elapsedSeconds={0}/>'));
  assert.ok(neutral.includes('Silhueta corporal neutra com um único percurso de luz.'));
  assert.ok(neutral.includes('sem chakras, mandalas ou marcadores coloridos'));
  assert.ok(neutral.includes('var(--layout-gold, #C89D52)'));
  assert.ok(css.includes('.visual-studio-human-frame .ep-neutral-body-progress--canvas'));
  assert.doesNotMatch(css, /\\.reintegration-presence-visual \\{[^}]*#132b2a/);
});

test('a neutralidade do corpo não troca as paisagens aprovadas de cada atmosfera', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  const visual = read('src/components/ReintegrationPresenceVisual.tsx');

  assert.ok(journey.includes("runningBackdropUrl = isNaturalSereno ? '/brand/natural-sereno/cachoeira.webp' : dayArtworkUrl"));
  assert.ok(journey.includes("const isEleganciaProfunda = typeof document !== 'undefined' && document.documentElement.dataset.layout === 'elegancia-profunda'"));
  assert.doesNotMatch(visual, /dataset\\.layout|data-layout/);
});
