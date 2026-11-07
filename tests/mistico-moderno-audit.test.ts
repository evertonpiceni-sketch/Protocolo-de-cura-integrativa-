import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS, resolveMisticoModernoOfficialVoiceId } from '../src/config/voiceAliases';
import { audioEngine } from '../src/lib/audio';
import '../src/lib/misticoModernoOfficialVoicePatch';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('Style 4 selector uses the official board and still requires explicit confirmation', () => {
  const assetPath = resolve(root, 'public/brand/mistico-moderno/prancha-oficial.webp');
  assert.equal(existsSync(assetPath), true);
  const asset = readFileSync(assetPath);
  assert.equal(asset.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(asset.subarray(8, 12).toString('ascii'), 'WEBP');

  const modal = readFileSync(resolve(root, 'src/components/LayoutChoiceModal.tsx'), 'utf8');
  assert.match(modal, /\/brand\/mistico-moderno\/prancha-oficial\.webp/);
  assert.match(modal, /useState<LayoutId \| null>\(null\)/);
  assert.match(modal, /disabled=\{!selectedLayout \|\| isSaving\}/);
  assert.match(modal, /isSelected \|\| !isMystic \? <Check size=\{16\} \/> : null/);

  const arcanjo = readFileSync(resolve(root, 'src/components/ArcanjoProtocolView.tsx'), 'utf8');
  const logoutStart = arcanjo.indexOf('{onLogout && (');
  const logoutEnd = arcanjo.indexOf('</button>', logoutStart);
  const logoutBlock = arcanjo.slice(logoutStart, logoutEnd);
  assert.match(logoutBlock, /isMisticoModerno\(\)/);
  assert.doesNotMatch(logoutBlock, /bg-rose-50|text-rose-600/);
});

test('Style 4 voice alias resolves only to a configured ElevenLabs voice ID', () => {
  assert.equal(resolveMisticoModernoOfficialVoiceId('  configured-voice-id  '), 'configured-voice-id');
  assert.equal(resolveMisticoModernoOfficialVoiceId(undefined), null);
  assert.equal(resolveMisticoModernoOfficialVoiceId(''), null);
  assert.equal(resolveMisticoModernoOfficialVoiceId('Rachel'), null);
  assert.equal(resolveMisticoModernoOfficialVoiceId('Marcus'), null);
  const server = readFileSync(resolve(root, 'server.ts'), 'utf8');
  assert.match(server, /cacheKey}_\$\{cacheVoiceId\}/);
});

test('Style 4 forces the server voice alias and never falls back to browser speech', async () => {
  const keys = ['document', 'window', 'navigator', 'fetch'] as const;
  const original = new Map(keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const spoken: unknown[] = [];
  const errors: Error[] = [];
  const requests: Array<{ url: string; body: Record<string, unknown> }> = [];
  const fakeWindow = {
    speechSynthesis: {
      cancel() {},
      pause() {},
      resume() {},
      getVoices: () => [],
      speak(utterance: unknown) { spoken.push(utterance); }
    }
  };

  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: { documentElement: { dataset: { layout: 'mistico-moderno' } } }
  });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: fakeWindow });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {} });
  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    value: async (url: string, init: RequestInit) => {
      requests.push({ url, body: JSON.parse(String(init.body)) as Record<string, unknown> });
      return new Response(JSON.stringify({
        error: 'Voz oficial indisponível no fixture.',
        fallbackToNativeTTS: false
      }), { status: 503, headers: { 'content-type': 'application/json' } });
    }
  });

  try {
    await audioEngine.speakWithElevenLabsOrFallback(
      'Texto de teste.',
      0.8,
      () => {},
      () => {},
      undefined,
      undefined,
      {
        voiceId: 'Rachel',
        preferElevenLabs: false,
        onError: error => errors.push(error)
      }
    );

    assert.equal(requests.length, 1);
    assert.equal(requests[0].body.voiceId, MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS);
    assert.equal(spoken.length, 0);
    assert.equal(errors.length, 1);
  } finally {
    audioEngine.stopSpeech();
    for (const key of keys) {
      const descriptor = original.get(key);
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
