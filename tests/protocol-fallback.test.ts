import assert from 'node:assert/strict';
import test from 'node:test';
import { audioEngine } from '../src/lib/audio';

test('official protocol stream reports failure without falling back to browser speech', async t => {
  const keys = ['window', 'navigator', 'Audio', 'SpeechSynthesisUtterance', 'fetch'] as const;
  const original = new Map(keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const spoken: any[] = [];
  const audioInstances: any[] = [];
  class FakeAudio {
    paused = true;
    currentTime = 0;
    preload = '';
    volume = 1;
    playCalls = 0;
    constructor() { audioInstances.push(this); }
    pause() { this.paused = true; }
    play() { this.playCalls += 1; this.paused = false; return Promise.resolve(); }
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
      await t.test(`reports ${failure} without starting browser speech`, async () => {
        let release!: () => void;
        const gate = new Promise<void>(resolve => { release = resolve; });
        Object.defineProperty(globalThis, 'fetch', { configurable: true, value: async () => {
          await gate;
          if (failure === 'network-error') throw new Error('fixture network failure');
          return new Response(JSON.stringify({ fallbackToSpeechSynthesis: true }), { status: 503 });
        } });

        spoken.length = 0;
        audioInstances.length = 0;
        const errors: Error[] = [];
        const playbackChanges: boolean[] = [];
        audioEngine.setMainVolume(0);
        const playback = audioEngine.playProtocolStageStream({
          text: 'Texto aprovado.',
          voiceId: 'Rachel',
          stageTitle: 'Etapa',
          dayNumber: 1,
          onError: error => errors.push(error),
          onPlaybackChange: playing => playbackChanges.push(playing)
        });

        audioEngine.pauseSpeech();
        release();
        const result = await playback;

        assert.equal(result, null);
        assert.equal(spoken.length, 0);
        assert.equal(errors.length, 1);
        assert.ok(errors[0] instanceof Error);
        assert.ok(errors[0].message.length > 0);
        assert.deepEqual(playbackChanges, [false]);
        const protocolAudio = audioInstances[audioInstances.length - 1];
        assert.equal(protocolAudio?.volume, 0);
        assert.equal(protocolAudio?.playCalls, 0);

        audioEngine.resumeSpeech();
        assert.equal(spoken.length, 0);
        audioEngine.stopSpeech();
      });
    }

    await t.test('exit cancels an in-flight official request without invoking browser speech', async () => {
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
        voiceId: 'Rachel',
        stageTitle: 'Etapa',
        dayNumber: 1,
        onError: error => errors.push(error)
      });

      audioEngine.pauseSpeech();
      audioEngine.stopSpeech();
      release();
      const result = await playback;
      audioEngine.resumeSpeech();

      assert.equal(result, null);
      assert.equal(errors.length, 0);
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
