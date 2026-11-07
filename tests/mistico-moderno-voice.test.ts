import assert from 'node:assert/strict';
import test from 'node:test';
import { audioEngine, OFFICIAL_PROTOCOL_VOICE_ID } from '../src/lib/audio';
import { normalizeMisticoModernoVoiceId } from '../src/lib/misticoModernoOfficialVoicePatch';

test('Místico Moderno always resolves legacy and device voice names to Marianne', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const fakeDocument = { documentElement: { dataset: { layout: 'mistico-moderno' } } };
  Object.defineProperty(globalThis, 'document', { configurable: true, value: fakeDocument });
  try {
    for (const legacy of ['Rachel', 'Marcus', 'Microsoft Francisca Online', 'Google português do Brasil', '']) {
      assert.equal(normalizeMisticoModernoVoiceId(legacy), OFFICIAL_PROTOCOL_VOICE_ID);
    }
    assert.equal(normalizeMisticoModernoVoiceId(undefined), OFFICIAL_PROTOCOL_VOICE_ID);
    fakeDocument.documentElement.dataset.layout = 'natural-sereno';
    assert.equal(normalizeMisticoModernoVoiceId('Rachel'), 'Rachel');
  } finally {
    if (original) Object.defineProperty(globalThis, 'document', original);
    else Reflect.deleteProperty(globalThis, 'document');
  }
});

test('Místico Moderno does not start browser speech when ElevenLabs is unavailable', async () => {
  const keys = ['window', 'navigator', 'Audio', 'SpeechSynthesisUtterance', 'fetch', 'document'] as const;
  const original = new Map(keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const spoken: any[] = [];
  const requestBodies: any[] = [];
  let ended = 0;
  const fakeDocument = { documentElement: { dataset: { layout: 'mistico-moderno' } } };
  const globals = {
    window: { speechSynthesis: { cancel() {}, pause() {}, resume() {}, getVoices: () => [], speak(u: any) { spoken.push(u); } } },
    navigator: {},
    Audio: class { paused = true; currentTime = 0; volume = 1; pause() { this.paused = true; } play() { this.paused = false; return Promise.resolve(); } },
    SpeechSynthesisUtterance: class { constructor(public text: string) {} },
    document: fakeDocument,
    fetch: async (_url: string, init?: RequestInit) => {
      if (init?.body) requestBodies.push(JSON.parse(String(init.body)));
      return new Response(JSON.stringify({ error: 'ElevenLabs indisponível no teste.' }), {
        status: 503,
        headers: { 'content-type': 'application/json' }
      });
    }
  };
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value });
  try {
    await audioEngine.speakWithElevenLabsOrFallback(
      'Teste da voz oficial.',
      0.9,
      () => {},
      () => { ended += 1; },
      undefined,
      undefined,
      { voiceId: 'Rachel' }
    );
    assert.equal(requestBodies.length, 1);
    assert.equal(requestBodies[0].voiceId, OFFICIAL_PROTOCOL_VOICE_ID);
    assert.equal(spoken.length, 0);
    assert.equal(ended, 1);
  } finally {
    audioEngine.stopSpeech();
    for (const key of keys) {
      const descriptor = original.get(key);
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});


test('the settings preview also uses Marianne and reports failure without browser TTS', async () => {
  const keys = ['window', 'navigator', 'Audio', 'SpeechSynthesisUtterance', 'fetch', 'document'] as const;
  const original = new Map(keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const spoken: any[] = [];
  const requestBodies: any[] = [];
  let errors = 0;
  const globals = {
    window: { speechSynthesis: { cancel() {}, pause() {}, resume() {}, getVoices: () => [], speak(u: any) { spoken.push(u); } } },
    navigator: {},
    Audio: class { paused = true; currentTime = 0; volume = 1; pause() { this.paused = true; } play() { this.paused = false; return Promise.resolve(); } },
    SpeechSynthesisUtterance: class { constructor(public text: string) {} },
    document: { documentElement: { dataset: { layout: 'mistico-moderno' } } },
    fetch: async (_url: string, init?: RequestInit) => {
      if (init?.body) requestBodies.push(JSON.parse(String(init.body)));
      return new Response(JSON.stringify({ error: 'ElevenLabs indisponível no teste.' }), {
        status: 503,
        headers: { 'content-type': 'application/json' }
      });
    }
  };
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value });
  try {
    audioEngine.previewVoice({
      text: 'Prévia da voz aprovada.',
      voiceId: 'Microsoft Francisca Online',
      onError: () => { errors += 1; }
    });
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(requestBodies.length, 1);
    assert.equal(requestBodies[0].voiceId, OFFICIAL_PROTOCOL_VOICE_ID);
    assert.equal(spoken.length, 0);
    assert.equal(errors, 1);
  } finally {
    audioEngine.stopSpeech();
    for (const key of keys) {
      const descriptor = original.get(key);
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
