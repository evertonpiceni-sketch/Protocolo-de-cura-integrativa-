import assert from 'node:assert/strict';
import test from 'node:test';
import '../src/lib/reintegrationPublicNarrationPatch';
import { REINTEGRATION_DAYS } from '../src/data/reintegrationJourneyPublic';

const PRIVATE_CUE_TIMES = new Set([200, 900, 1080, 1170]);
const PRIVATE_TERMS = /Golden Light Source|Original Reiki Platinum|Haku Superluminal|HSZSN|Soul Shakti|Rama|Harth|Shanti|Kriya|Zonar|Halu|Gnosa|Iava/i;

test('Reintegração keeps 21 distinct public days', () => {
  assert.equal(REINTEGRATION_DAYS.length, 21);
  assert.equal(new Set(REINTEGRATION_DAYS.map(day => day.title)).size, 21);
});

test('private programming cue slots are silent in the public meditation', () => {
  for (const day of REINTEGRATION_DAYS) {
    for (const cue of day.audioCues) {
      assert.equal(PRIVATE_CUE_TIMES.has(cue.at), false, `Dia ${day.day}: private cue remained at ${cue.at}s`);
    }
  }
});

test('public spoken cues do not expose private system and symbol names', () => {
  for (const day of REINTEGRATION_DAYS) {
    const spoken = day.audioCues.map(cue => cue.text).join(' ');
    assert.equal(PRIVATE_TERMS.test(spoken), false, `Dia ${day.day}: private energetic terminology leaked into public narration`);
  }
});
