import assert from 'node:assert/strict';
import test from 'node:test';
import { audioEngine } from '../src/lib/audio';

test('protocol narration fails closed without a robotic browser-voice fallback', async t => {
  const keys = ['window', 'navigator', 'Audio', 'SpeechSynthesisUtterance', 'fetch'] as const;
  const original = new Map(keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const spoken: any[] = [];
  class FakeAudio {
    paused = true;
    currentTime = 0;
    preload = '';
    volume = 1;
    pause() { this.paused = true; }
    play() { this.paused = false; return Promise.resolve(); }
  }
  const globals = {
    window: { speechSynthesis: { cancel() {}, pause() {}, resume() {}, getVoices: () => [], speak(u: any) { spoken.push(u); u.onstart?.(); } } },
    navigator: {},
    Audio: FakeAudio,
    SpeechSynthesisUtterance: class { constructor(public text: string) {} }
  };
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value });
  try {
    for (const failure of ['service-fallback', 'network-error']) {
      await t.test(`pause before ${failure} prevents speech until resume`, async () => {
        let release!: () => void;
        const gate = new Promise<void>(resolve => { release = resolve; });
        Object.defineProperty(globalThis, 'fetch', { configurable: true, value: async () => {
          await gate;
          if (failure === 'network-error') throw new Error('fixture network failure');
          return new Response(JSON.stringify({ fallbackToSpeechSynthesis: true }), { status: 503 });
        } });
        spoken.length = 0;
        audioEngine.setMainVolume(0);
        let errors = 0;
        const playback = audioEngine.playProtocolStageStream({ text: 'Texto aprovado.', voiceId: 'Rachel', stageTitle: 'Etapa', dayNumber: 1, onError: () => { errors += 1; } });
        audioEngine.pauseSpeech();
        release();
        await playback;
        assert.equal(spoken.length, 0);
        assert.equal(errors, 1);
        audioEngine.resumeSpeech();
        assert.equal(spoken.length, 0);
        audioEngine.stopSpeech();
      });
    }
    await t.test('exit discards a pending fallback', async () => {
      Object.defineProperty(globalThis, 'fetch', { configurable: true, value: async () => new Response(JSON.stringify({ fallbackToSpeechSynthesis: true }), { status: 503 }) });
      spoken.length = 0;
      let errors = 0;
      const playback = audioEngine.playProtocolStageStream({ text: 'Texto aprovado.', voiceId: 'Rachel', stageTitle: 'Etapa', dayNumber: 1, onError: () => { errors += 1; } });
      audioEngine.pauseSpeech();
      await playback;
      audioEngine.stopSpeech();
      audioEngine.resumeSpeech();
      assert.equal(spoken.length, 0);
      assert.equal(errors, 1);
    });
    await t.test('falha de voz neural informa erro sem disparar conclusão bem-sucedida', async () => {
      Object.defineProperty(globalThis, 'fetch', {
        configurable: true,
        value: async () => new Response(JSON.stringify({ error: 'TTS indisponível' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        })
      });
      spoken.length = 0;
      let errors = 0;
      let completions = 0;
      await audioEngine.speakWithElevenLabsOrFallback(
        'Texto de teste.',
        0.9,
        () => undefined,
        () => { completions += 1; },
        undefined,
        undefined,
        {
          voiceId: 'mJqP14JQFEK0PojR5lfV',
          fallbackToSpeechSynthesis: false,
          onError: () => { errors += 1; }
        }
      );
      assert.equal(errors, 1);
      assert.equal(completions, 0);
      assert.equal(spoken.length, 0);
    });
  } finally {
    audioEngine.stopSpeech();
    audioEngine.setMainVolume(1);
    for (const key of keys) {
      const descriptor = original.get(key);
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
