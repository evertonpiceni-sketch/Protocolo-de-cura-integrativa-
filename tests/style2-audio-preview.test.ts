import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { shouldPlayProtocolSessionBackground } from '../src/lib/protocolSessionAudioPolicy';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('o Estilo 2 suspende Solfeggio durante prévias neurais e restaura apenas ambiência não tonal', () => {
  assert.equal(shouldPlayProtocolSessionBackground('playing', '528hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', '396hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', 'florestazen'), true);
  assert.equal(shouldPlayProtocolSessionBackground('playing', 'chuvaserena'), true);
  assert.equal(shouldPlayProtocolSessionBackground('playing', 'none'), false);

  const app = read('src/App.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const gates = app.match(/\(!usesNeuralVoiceCatalog \|\| !isPlayingVoiceTest \|\|/g) ?? [];
  assert.equal(gates.length, 2, 'A sincronização global e o desbloqueio por gesto devem aplicar a mesma política aos estilos de voz neural.');
  assert.ok(settings.includes('const shouldPlayVoiceBackground = !requiresNeuralVoice'));
  assert.ok(settings.includes('if (requiresNeuralVoice && audioEnabled && shouldPlayProtocolSessionBackground'));
  assert.ok(settings.includes('else if (allowBackgroundPlayback && requiresNeuralVoice)'));
  assert.ok(settings.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
});
