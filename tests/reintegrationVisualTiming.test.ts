import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reintegrationPresenceWeights } from '../src/lib/reintegrationVisualTiming';

test('approved presence starts dark and blends gradually at the audio milestones', () => {
  assert.deepEqual(reintegrationPresenceWeights(0), [1,0,0,0,0]);
  assert.deepEqual(reintegrationPresenceWeights(239), [1,0,0,0,0]);
  assert.deepEqual(reintegrationPresenceWeights(262.5), [.5,.5,0,0,0]);
  assert.deepEqual(reintegrationPresenceWeights(285), [0,1,0,0,0]);
  for (let second=0; second<=1797; second++) {
    const weights=reintegrationPresenceWeights(second);
    assert(Math.abs(weights.reduce((sum,value)=>sum+value,0)-1)<1e-10);
    assert(weights.every(value=>value>=0&&value<=1));
    assert(weights.filter(value=>value>0).length<=2);
  }
});
test('pause and seeking restore the same visual state without an independent timer', () => {
  const paused=reintegrationPresenceWeights(922.5);
  assert.deepEqual(reintegrationPresenceWeights(922.5),paused);
  assert.deepEqual(reintegrationPresenceWeights(1797),[0,0,0,0,1]);
  assert.deepEqual(reintegrationPresenceWeights(0),[1,0,0,0,0]);
  assert.deepEqual(reintegrationPresenceWeights(NaN),[1,0,0,0,0]);
});
