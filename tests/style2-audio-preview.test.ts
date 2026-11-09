import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { isSolfeggioFrequency, shouldPlayProtocolSessionBackground } from '../src/lib/protocolSessionAudioPolicy';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('o Estilo 2 identifica waves como ambiência de ondas, não como sinos ou tigelas', () => {
  const app = read('src/App.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const audioEngine = read('src/lib/audio.ts');

  assert.ok(app.includes("const isEleganciaProfunda = layoutConfirmedThisSession && userProfile?.visualLayout === 'elegancia-profunda';"));
  assert.ok(settings.includes("const isEleganciaProfunda = typeof document !== 'undefined' && document.documentElement.dataset.layout === 'elegancia-profunda';"));
  assert.ok(app.includes("{ id: 'waves', title: isEssenciaLuminosa || isEleganciaProfunda ? 'Ondas do Mar' : 'Sinos & Brisa Tibetana', subtitle: isEssenciaLuminosa || isEleganciaProfunda ? 'Maré suave e brisa costeira' : 'Atmosfera de Templo Sagrado', isPro: false }"));
  assert.ok(settings.includes("{ id: 'waves', name: isEssenciaLuminosa || isEleganciaProfunda ? 'Ondas do Mar' : 'Sinos Zen', desc: isEssenciaLuminosa || isEleganciaProfunda ? 'Maré suave e brisa costeira' : 'Tigelas Tibetanas', pro: false }"));
  assert.ok(audioEngine.includes("type === 'waves' || type === 'florestazen' || type === 'chuvaserena'"));
  assert.ok(audioEngine.includes("this.noiseFilter.type = 'lowpass';"));
  assert.ok(audioEngine.includes("const noiseMix = type === 'chuvaserena' ? 0.03 : 0.015;"));
});

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
  assert.ok(settings.includes('const isStyle3SolfeggioBlocked = shouldBlockTrackDuringNeuralVoicePreview(isEssenciaLuminosa, isTestingVoice, track.id);'));
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


test('o Arcanjo suspende Solfeggio durante narração neural e respeita o áudio global', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  assert.ok(arcanjo.includes("import { isSolfeggioFrequency } from '../lib/protocolSessionAudioPolicy';"));
  assert.ok(arcanjo.includes('const requiresNeuralVoice = isEleganciaProfunda || isEssenciaLuminosa;'));
  assert.ok(arcanjo.includes('if (isSolfeggioFrequency(audioEngine.getCurrentSynthType())) {'));
  assert.ok(arcanjo.includes('if (userProfile.audioEnabled === false) {'));
  assert.ok(arcanjo.includes('if (requiresNeuralVoice) stopProtocolFrequency();'));
  assert.ok(arcanjo.includes('if (restoreFrequency) playProtocolFrequency();'));
  assert.ok(arcanjo.includes('resetPlayback(requiresNeuralVoice);'));
  assert.ok(arcanjo.includes('if (requiresNeuralVoice) playProtocolFrequency();'));
  assert.ok(arcanjo.includes('audioEngine.resumeSpeech();\n    if (!requiresNeuralVoice) playProtocolFrequency();'));
  assert.equal((arcanjo.match(/audioEngine\.startSynth\(/g) ?? []).length, 1, 'A frequência diária deve ser iniciada somente pelo helper que respeita audioEnabled.');
});


test('o player informa o estado real do Solfeggio no Arcanjo', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  assert.ok(arcanjo.includes('const [isProtocolFrequencyActive, setIsProtocolFrequencyActive] = useState(false);'));
  assert.ok(arcanjo.includes('Narração neural ativa — Solfeggio ${config.freq} Hz suspenso.'));
  assert.ok(arcanjo.includes('Solfeggio ${config.freq} Hz ativo durante a pausa ou após a narração.'));
  assert.ok(arcanjo.includes('Áudio desativado — nenhuma frequência será reproduzida.'));
  assert.ok(arcanjo.includes('role="status" aria-live="polite"'));
  assert.ok(arcanjo.includes('audioEngine.resumeSpeech();\n    if (!requiresNeuralVoice) {\n      playProtocolFrequency();\n      setIsPlaying(true);\n    }'));
});
