import assert from 'node:assert/strict';
import test from 'node:test';
import { audioEngine } from '../src/lib/audio';

test('official protocol narration never silently falls back to browser TTS', async t => {
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
      await t.test(`\u001b[0m${failure} reports the official voice error without invoking browser speech`, async () => {
        let release!: () => void;
        const gate = new Promise<void>(resolve => { release = resolve; });
        Object.defineProperty(globalThis, 'fetch', { configurable: true, value: async () => {
          await gate;
          if (failure === 'network-error') throw new Error('fixture network failure');
          return new Response(JSON.stringify({ fallbackToSpeechSynthesis: true }), { status: 503 });
        } });
        spoken.length = 0;
        const errors: Error[] = [];
        const playbackStates: boolean[] = [];
        const playback = audioEngine.playProtocolStageStream({
          text: 'Texto aprovado.',
          voiceId: 'mJqP14JQFEK0PojR5lfV',
          stageTitle: 'Etapa',
          dayNumber: 1,
          onError: error => errors.push(error),
          onPlaybackChange: playing => playbackStates.push(playing)
        });
        release();
        assert.equal(await playback, null);
        assert.equal(spoken.length, 0);
        assert.equal(errors.length, 1);
        assert.ok(errors[0] instanceof Error);
        assert.equal(playbackStates.at(-1), false);
      });
    }

    await t.test('leaving the player cancels a pending official stream without browser speech', async () => {
      let release!: () => void;
      const gate = new Promise<void>(resolve => { release = resolve; });
      Object.defineProperty(globalThis, 'fetch', { configurable: true, value: async () => {
        await gate;
        return new Response(JSON.stringify({ fallbackToSpeechSynthesis: true }), { status: 503 });
      } });
      spoken.length = 0;
      const errors: Error[] = [];
      const playback = audioEngine.playProtocolStageStream({
        text: 'Texto aprovado.',
        voiceId: 'mJqP14JQFEK0PojR5lfV',
        stageTitle: 'Etapa',
        dayNumber: 1,
        onError: error => errors.push(error)
      });
      audioEngine.stopSpeech();
      release();
      assert.equal(await playback, null);
      assert.equal(spoken.length, 0);
      assert.equal(errors.length, 0);
    });
  } finally {
    audioEngine.stopSpeech();
    for (const key of keys) {
      const descriptor = original.get(key);
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
