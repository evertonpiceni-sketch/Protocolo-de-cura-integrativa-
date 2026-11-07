import assert from 'node:assert/strict';
import test from 'node:test';
import { audioEngine } from '../src/lib/audio';

test('Arcanjo audio ownership blocks global background but preserves Solfeggio synth', async () => {
  const keys = ['window', 'document', 'MutationObserver'] as const;
  const original = new Map(keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const originalStartBG = audioEngine.startBG;
  const originalStopBG = audioEngine.stopBG;
  let backgroundStarts = 0;
  let stopCalls = 0;
  audioEngine.startBG = (() => { backgroundStarts += 1; }) as typeof audioEngine.startBG;
  audioEngine.stopBG = (() => { stopCalls += 1; }) as typeof audioEngine.stopBG;

  class FakeMutationObserver { observe() {} disconnect() {} }
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { addEventListener() {}, setTimeout: () => 1, clearTimeout() {} } });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: {
    body: {},
    querySelectorAll: () => [{ closest: () => null }]
  } });
  Object.defineProperty(globalThis, 'MutationObserver', { configurable: true, value: FakeMutationObserver });

  try {
    await import('../src/lib/arcanjoAudioOwnershipPatch');
    audioEngine.startBG('432hz');
    assert.equal(backgroundStarts, 0, 'global background must stay off while Arcanjo is mounted');

    const stopsBeforeSynth = stopCalls;
    audioEngine.startSynth('528hz');
    assert.equal(backgroundStarts, 1, 'the protocol-owned Solfeggio synth must still start');
    assert.equal(stopCalls, stopsBeforeSynth, 'starting Solfeggio must not be immediately stopped');

    audioEngine.startBG('396hz');
    assert.equal(backgroundStarts, 1, 'global background remains blocked after the synth starts');
  } finally {
    audioEngine.startBG = originalStartBG;
    audioEngine.stopBG = originalStopBG;
    for (const key of keys) {
      const descriptor = original.get(key);
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
