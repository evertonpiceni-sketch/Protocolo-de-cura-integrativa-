import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldBlockArcanjoBackground } from '../src/lib/arcanjoAudioPolicy';

test('Arcanjo audio ownership allows only the seven protocol Solfeggio tones', () => {
  for (const tone of ['396hz', '417hz', '528hz', '639hz', '741hz', '852hz', '963hz']) {
    assert.equal(shouldBlockArcanjoBackground(tone, true), false, tone);
  }

  for (const ambience of ['waves', 'florestazen', 'chuvaserena', '432hz', 'none']) {
    assert.equal(shouldBlockArcanjoBackground(ambience, true), true, ambience);
  }

  assert.equal(shouldBlockArcanjoBackground('waves', false), false);
});
