import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
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

test('an active Arcanjo subscription unlocks access but does not auto-open the screen', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  assert.ok(app.includes('const isArcanjoProtocolActive = showArcanjoView;'));
  assert.ok(!app.includes("showArcanjoView || userProfile?.subscriptionPlan === 'arcanjo_7d'"));
});


test('Natural Sereno no Arcanjo exige a voz neural salva e não abre fallback nativo', () => {
  const view = fs.readFileSync('src/components/ArcanjoProtocolView.tsx', 'utf8');
  assert.ok(view.includes('isNaturalSerenoVoiceId(userProfile.voiceId)'));
  assert.ok(view.includes('requireExplicitVoiceId: requiresExplicitNeuralVoice'));
  assert.ok(view.includes('if (requiresExplicitNeuralVoice)'));
  assert.ok(view.includes('audioEngine.startSynth(`${config.freq}hz`)'));
});
