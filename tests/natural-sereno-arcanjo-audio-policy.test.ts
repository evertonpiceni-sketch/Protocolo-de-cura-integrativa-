import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync('src/components/ArcanjoProtocolView.tsx', 'utf8');

test('Natural Sereno mantém Solfeggio separado da voz neural e usa arte neutra nos controles do sistema', () => {
  assert.ok(source.includes("document.documentElement.dataset.layout === 'natural-sereno'"));
  assert.ok(source.includes("import NeutralBodyLightProgress from './NeutralBodyLightProgress'"));
  assert.ok(source.includes("src: '/icon-192.svg'"));
  assert.ok(source.includes("src: '/icon-512.svg'"));
  assert.ok(source.includes('requireExplicitVoiceId: requiresNeuralVoice'));

  const startSolfeggio = source.slice(source.indexOf('const startSolfeggio ='), source.indexOf('const stopSolfeggio ='));
  assert.ok(startSolfeggio.includes('userProfile.audioEnabled === false'));
  assert.ok(startSolfeggio.includes('audioEngine.stopSynth()'));

  const onStart = source.slice(source.indexOf('onStart: () =>'), source.indexOf('onPause: () =>'));
  assert.ok(onStart.indexOf('stopSolfeggio()') < onStart.indexOf('setIsPlaying(true)'));
  const onPause = source.slice(source.indexOf('onPause: () =>'), source.indexOf('onTimeUpdate:'));
  assert.ok(onPause.includes('startSolfeggio()'));

  const toggle = source.slice(source.indexOf('const togglePlayback ='), source.indexOf('const selectDay ='));
  assert.ok(toggle.indexOf('stopSolfeggio()') < toggle.indexOf('audioEngine.resumeSpeech()'));
  assert.ok(toggle.includes('audioEngine.pauseSpeech()'));

  const fallback = source.slice(source.indexOf('const startNativeFallback ='), source.indexOf('const start ='));
  assert.ok(fallback.includes('if (requiresNeuralVoice)'));
  assert.ok(fallback.includes('setVoiceError(true)'));
  assert.ok(!fallback.includes('preferElevenLabs: false') || fallback.includes('if (requiresNeuralVoice)'));
});
