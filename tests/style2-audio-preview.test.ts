import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { isSolfeggioFrequency, shouldPlayProtocolSessionBackground } from '../src/lib/protocolSessionAudioPolicy';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('o Estilo 2 suspende Solfeggio durante prévias neurais e restaura apenas ambiência não tonal', () => {
  for (const frequency of ['396hz', '417hz', '432hz', '528hz', '639hz', '741hz', '852hz', '963hz']) {
    assert.equal(isSolfeggioFrequency(frequency), true);
    assert.equal(shouldPlayProtocolSessionBackground('playing', frequency), false);
  }
  assert.equal(isSolfeggioFrequency('florestazen'), false);
  assert.equal(isSolfeggioFrequency('chuvaserena'), false);
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
  assert.ok(settings.includes('if (requiresNeuralVoice) audioEngine.startBG(bgMusicType);'));
  assert.ok(settings.includes('else if (allowBackgroundPlayback && requiresNeuralVoice)'));
  assert.ok(settings.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(settings.includes('if (!allowBackgroundPlayback || (requiresNeuralVoice && isTestingVoice)) return;'));
  assert.ok(settings.includes('const isStyle2SolfeggioBlocked = isEleganciaProfunda && isTestingVoice && isSolfeggioFrequency(track.id);'));
  assert.ok(settings.includes('const isStyle3SolfeggioBlocked = shouldBlockTrackDuringVoicePreview(isEssenciaLuminosa, isTestingVoice, track.id);'));
  assert.ok(settings.includes('const isTrackBlockedDuringVoicePreview = isStyle3SolfeggioBlocked || isStyle2SolfeggioBlocked;'));
  assert.ok(settings.includes('disabled={isTrackBlockedDuringVoicePreview}'));
  assert.ok(settings.includes('if (isTrackBlockedDuringVoicePreview) return;'));
  assert.ok(settings.includes('setNeuralVoicePreviewActive(true)'));
  assert.ok(settings.includes('setNeuralVoicePreviewActive(false)'));
  assert.ok(app.includes('setNeuralVoicePreviewActive(true)'));
  assert.ok(app.includes('setNeuralVoicePreviewActive(false)'));

  const audioPatch = read('src/lib/audioIntegrityPatch.ts');
  const previewState = read('src/lib/neuralVoicePreviewState.ts');
  const home = read('src/components/TransformationHome.tsx');
  assert.ok(audioPatch.includes('isNeuralVoicePreviewActive()'));
  assert.ok(audioPatch.includes('solfeggioTone.stop();'));
  assert.ok(previewState.includes('let neuralVoicePreviewActive = false;'));
  assert.ok(home.includes('setNeuralVoicePreviewActive(true)'));
  assert.ok(home.includes('restoreBackgroundAfterNeuralNarration'));
});
