import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('a Reintegração usa a silhueta neutra aprovada em todas as quatro atmosferas', () => {
  const visual = read('src/components/ReintegrationPresenceVisual.tsx');
  const journey = read('src/components/PersonalJourney21.tsx');
  const studio = read('src/components/VideoStudioLightModal.tsx');
  const neutral = read('src/components/NeutralBodyLightProgress.tsx');
  const theme = read('src/approved-theme.css');

  assert.ok(visual.includes('NeutralBodyLightProgress'));
  assert.ok(visual.includes('showRoots={day === 1}'));
  assert.doesNotMatch(visual, /neutral\\?: boolean|if \\(neutral\\)|reintegracao-presenca-arte\\.png|reintegration-presence-frame|data-visual-fallback/);
  assert.equal((journey.match(/<ReintegrationPresenceVisual day=\\{day\\} elapsedSeconds=\\{elapsedSeconds\\} active=\\{playing\\} \\/>/g) || []).length, 2);
  assert.doesNotMatch(journey, /neutral=\\{isNaturalSereno\\}/);
  assert.ok(studio.includes('<ReintegrationPresenceVisual day={day} elapsedSeconds={0}/>'));
  assert.ok(neutral.includes('Silhueta corporal neutra com um único percurso de luz.'));
  assert.ok(neutral.includes('sem chakras, mandalas ou marcadores coloridos'));
  assert.ok(neutral.includes('var(--layout-gold, #C89D52)'));

  for (const layout of ['natural-sereno', 'elegancia-profunda', 'essencia-luminosa', 'mistico-moderno']) {
    assert.ok(theme.includes(`:root[data-layout="${layout}"]`), `Tema ausente: ${layout}`);
  }
});

test('a troca do corpo não troca as paisagens e o canvas do estúdio permanece responsivo', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  const css = read('src/index.css');

  assert.ok(journey.includes("runningBackdropUrl = isNaturalSereno ? '/brand/natural-sereno/cachoeira.webp' : dayArtworkUrl"));
  assert.ok(css.includes('.visual-studio-human-frame .ep-neutral-body-progress--canvas'));
  assert.ok(css.includes('max-height: 90% !important;'));
  assert.doesNotMatch(css, /\\.reintegration-presence-visual \\{[^}]*#132b2a/);
  assert.ok(css.includes('.ep-neutral-body-progress__light-path'));
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'));
});
