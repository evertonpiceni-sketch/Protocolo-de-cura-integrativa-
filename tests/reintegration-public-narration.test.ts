import assert from 'node:assert/strict';
import test from 'node:test';
import '../src/lib/reintegrationPublicNarrationPatch';
import { REINTEGRATION_DAYS } from '../src/data/reintegrationJourneyPublic';

const PRIVATE_TERMS = /\b(?:Golden Light Source|Original Reiki Platinum|Haku Superluminal|HSZSN|Soul Shakti|Rama|Harth|Shanti|Kriya|Zonar|Halu|Gnosa|Iava)\b/i;

test('Reintegração keeps 21 distinct public days', () => {
  assert.equal(REINTEGRATION_DAYS.length, 21);
  assert.equal(new Set(REINTEGRATION_DAYS.map(day => day.title)).size, 21);
});

test('approved public acceptance and daily integration remain spoken', () => {
  for (const day of REINTEGRATION_DAYS) {
    assert.ok(day.audioCues.some(cue => cue.at === 200 && cue.text.length > 0));
    assert.ok(day.audioCues.some(cue => cue.at === 900 && cue.text.length > 0));
  }
});

test('public spoken cues do not expose private system and symbol names', () => {
  for (const day of REINTEGRATION_DAYS) {
    const spoken = day.audioCues.map(cue => cue.text).join(' ');
    assert.equal(PRIVATE_TERMS.test(spoken), false, `Dia ${day.day}: private energetic terminology leaked into public narration`);
  }
});
