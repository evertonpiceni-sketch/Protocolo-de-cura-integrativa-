import test from 'node:test';
import assert from 'node:assert/strict';
import { audioEngine } from '../src/lib/audio';

test('guided audio discards retired requests and clears system controls on exit', async () => {
  const keys = ['window','navigator','Audio','MediaMetadata','fetch'] as const;
  const originals = new Map(keys.map(k => [k, Object.getOwnPropertyDescriptor(globalThis,k)]));
  const audios: any[] = []; const handlers: Record<string,any> = {};
  class AudioFixture {
    paused = true; currentTime = 0; duration = 180; onplay?: () => void; onpause?: () => void;
    constructor(public src = '') { audios.push(this); }
    play() { this.paused = false; this.onplay?.(); return Promise.resolve(); }
    pause() { this.paused = true; this.onpause?.(); }
  }
  const session = { metadata: null, playbackState: 'none', setPositionState() {}, setActionHandler(action: string, handler: any) { if (action === 'seekforward') throw Error('unsupported'); handlers[action] = handler; } };
  const values: Record<string,unknown> = { window: { speechSynthesis: { cancel() {},pause() {},resume() {} } }, navigator: { mediaSession: session }, Audio: AudioFixture, MediaMetadata: class { constructor(public data: unknown) {} } };
  for (const [key,value] of Object.entries(values)) Object.defineProperty(globalThis,key,{ configurable:true,value });
  const response = () => new Response(new Uint8Array([1,2,3]),{ headers: { 'content-type':'audio/mpeg' } });
  try {
    let release!: () => void; const gate = new Promise<void>(r => { release = r; });
    Object.defineProperty(globalThis,'fetch',{ configurable:true,value:async () => { await gate; return response(); } });
    const delayed = audioEngine.playGuidedMeditation(['Texto aprovado.'], { title:'Dia 1',subtitle:'Teste' });
    audioEngine.stopSpeech(); release(); await delayed;
    assert.equal(audios.filter(a => a.src.startsWith('blob:')).length,0);
    assert.equal(session.metadata,null);
    Object.defineProperty(globalThis,'fetch',{ configurable:true,value:async () => response() });
    let pauses = 0;
    await audioEngine.playGuidedMeditation(['Texto aprovado.'], { title:'Dia 1',subtitle:'Teste',onPause:() => pauses++ });
    const voice = audios.find(a => a.src.startsWith('blob:')); assert.ok(voice); assert.equal(voice.paused,false);
    handlers.pause(); assert.equal(pauses,1); assert.equal(voice.paused,true);
    const oldPlay = handlers.play; audioEngine.stopSpeech(); oldPlay();
    assert.equal(voice.paused,true); assert.equal(session.metadata,null); assert.equal(handlers.play,null);
  } finally {
    audioEngine.stopSpeech();
    for (const key of keys) { const d = originals.get(key); if (d) Object.defineProperty(globalThis,key,d); else Reflect.deleteProperty(globalThis,key); }
  }
});
