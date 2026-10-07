import { test } from 'node:test';
import assert from 'node:assert/strict';
import { speechElapsedSeconds } from '../src/lib/speechElapsed';

test('native speech progress accepts seconds and millisecond browser events', () => {
  assert.equal(speechElapsedSeconds(26.184, 27), 26.184);
  assert.equal(speechElapsedSeconds(26184, 27), 26.184);
  assert.equal(speechElapsedSeconds(43624000, 27), 27);
  assert.equal(speechElapsedSeconds(NaN, 27), 0);
  assert.equal(speechElapsedSeconds(-1, 27), 0);
});
