import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS, resolveMisticoModernoOfficialVoiceId } from '../src/config/voiceAliases';
import { audioEngine } from '../src/lib/audio';
import { shouldPlayProtocolSessionBackground } from '../src/lib/protocolSessionAudioPolicy';
import '../src/lib/misticoModernoOfficialVoicePatch';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('Style 4 selector uses the official board derivative and explicit confirmation', () => {
  const assetPath = resolve(root, 'public/brand/mistico-moderno/prancha-oficial.svg');
  assert.equal(existsSync(assetPath), true);
  const asset = readFileSync(assetPath, 'utf8');
  assert.match(asset, /data:image\/webp;base64,/);
  const modal = readFileSync(resolve(root, 'src/components/LayoutChoiceModal.tsx'), 'utf8');
  assert.match(modal, /\/brand\/mistico-moderno\/prancha-oficial\.svg/);
  assert.match(modal, /\/brand\/essencia-luminosa\/prancha-oficial\.webp/);
  assert.match(modal, /useState<LayoutId \| null>\(null\)/);
  assert.match(modal, /disabled=\{!selectedLayout \|\| isSaving\}/);
  assert.match(modal, /isMystic \? 'bg-\[#0A0F18\]/);
  assert.match(modal, /isSelected \? <Check size=\{16\} \/> : null/);
  const app = readFileSync(resolve(root, 'src/App.tsx'), 'utf8');
  assert.match(app, /setLayoutConfirmedThisSession\(false\);\s*setLayoutChoiceRequested\(false\);/);
});

test('Style 4 server alias rejects known legacy voice labels and IDs', () => {
  assert.equal(resolveMisticoModernoOfficialVoiceId(' configured-voice-id '), 'configured-voice-id');
  assert.equal(resolveMisticoModernoOfficialVoiceId(undefined), null);
  for (const legacy of ['Rachel','Marcus','Marianne','Sofia','mJqP14JQFEK0PojR5lfV','21m00Tcm4TlvDq8ikWAM','nPczCjzI2devNBz1zQrb']) {
    assert.equal(resolveMisticoModernoOfficialVoiceId(legacy), null, legacy);
  }
  const server = readFileSync(resolve(root, 'server.ts'), 'utf8');
  const aliasIndex = server.indexOf('resolveMisticoModernoOfficialVoiceId(process.env.ELEVENLABS_VOICE_ID)');
  const cacheIndex = server.indexOf('const effectiveCacheKey', aliasIndex);
  assert.ok(aliasIndex >= 0 && cacheIndex > aliasIndex);
  assert.match(server, /fallbackToSpeechSynthesis: !isMisticoVoice/);
});

test('Style 4 voice playback uses server alias and never falls back to browser speech', async () => {
  const keys = ['document','window','navigator','fetch'] as const;
  const original = new Map(keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis,key)]));
  const spoken: unknown[] = [];
  const errors: unknown[] = [];
  const requests: Array<{url:string;body:Record<string,unknown>}> = [];
  Object.defineProperty(globalThis,'document',{configurable:true,value:{documentElement:{dataset:{layout:'mistico-moderno'}}}});
  Object.defineProperty(globalThis,'window',{configurable:true,value:{speechSynthesis:{cancel(){},pause(){},resume(){},getVoices:()=>[],speak(utterance:unknown){spoken.push(utterance);}}}});
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:{}});
  Object.defineProperty(globalThis,'fetch',{configurable:true,value:async(url:string,init:RequestInit)=>{
    requests.push({url,body:JSON.parse(String(init.body)) as Record<string,unknown>});
    return new Response(JSON.stringify({error:'Voz oficial indisponível no fixture.',fallbackToSpeechSynthesis:false}),{status:503,headers:{'content-type':'application/json'}});
  }});
  try {
    await audioEngine.speakWithElevenLabsOrFallback('Texto de teste.',0.8,()=>{},()=>{},undefined,undefined,{
      voiceId:'Rachel',preferElevenLabs:false,fallbackToSpeechSynthesis:true,onError:error=>errors.push(error)
    });
    assert.equal(requests.length,1);
    assert.equal(requests[0].body.voiceId,MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS);
    assert.equal(spoken.length,0);
    assert.equal(errors.length,1);
  } finally {
    audioEngine.stopSpeech();
    for(const key of keys){const descriptor=original.get(key);if(descriptor)Object.defineProperty(globalThis,key,descriptor);else Reflect.deleteProperty(globalThis,key);}
  }
});

test('Protocol player does not restart Solfeggio as background during narration', () => {
  for(const frequency of ['396hz','417hz','432hz','528hz','639hz','741hz','852hz','963hz']) assert.equal(shouldPlayProtocolSessionBackground('playing',frequency),false,frequency);
  assert.equal(shouldPlayProtocolSessionBackground('playing','waves'),true);
  assert.equal(shouldPlayProtocolSessionBackground('playing','none'),false);
  assert.equal(shouldPlayProtocolSessionBackground('portal','waves'),false);
});

test('Arcanjo Místico CSS is scoped and voice fallback is blocked', () => {
  const css=readFileSync(resolve(root,'src/mistico-moderno-arcanjo-audit.css'),'utf8');
  assert.match(css,/:root\[data-layout="mistico-moderno"\]/);
  assert.doesNotMatch(css,/(^|\n)\s*(body|html|:root)\s*\{/);
  const arcanjo=readFileSync(resolve(root,'src/components/ArcanjoProtocolView.tsx'),'utf8');
  assert.match(arcanjo,/MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS/);
  assert.match(arcanjo,/if \(isMisticoModerno\(\)\)\s*\{[\s\S]*?setVoiceError\(true\)/);
  assert.match(arcanjo,/id="arcanjo-protocol-view"/);
});
