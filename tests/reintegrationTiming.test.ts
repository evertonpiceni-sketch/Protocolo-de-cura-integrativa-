import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REINTEGRATION_DAYS } from '../src/data/reintegrationJourneyPublic';
import { currentReintegrationCue } from '../src/lib/reintegrationTiming';

test('resuming at 15 minutes selects the current passage instead of an old voice backlog', () => {
  for (const day of REINTEGRATION_DAYS) {
    const index = currentReintegrationCue(day.audioCues, 950, 0);
    assert.equal(day.audioCues[index].at, 900);
    assert.equal(currentReintegrationCue(day.audioCues, 950, index), -1);
  }
});
test('absorption remains without narration even when earlier passages were not played', () => {
  const cues = REINTEGRATION_DAYS[0].audioCues;
  for (const second of [1260, 1400, 1619]) assert.equal(currentReintegrationCue(cues, second, -1), -1);
  assert.equal(cues[currentReintegrationCue(cues, 1620, -1)].at, 1620);
  assert.equal(currentReintegrationCue(cues, 1797, -1), -1);
});
