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
  assert.ok(settings.includes('const isTrackBlockedDuringVoicePreview = isStyle3SolfeggioBlocked || isStyle2SolfeggioBlocked || isStyle4SolfeggioBlocked;'));
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
  assert.ok(arcanjo.includes('startArcanjoOwnedSolfeggio(`${config.freq}hz`);'));
  assert.ok(arcanjo.includes('audioEngine.resumeSpeech();'));
  assert.ok(arcanjo.includes('if (!requiresNeuralVoice && !isMisticoModerno)'));
  assert.equal((arcanjo.match(/audioEngine\.startSynth\(/g) ?? []).length, 0, 'A frequência do Arcanjo deve passar pelo helper de ownership, não pelo startBG bloqueado.');
});


test('o player informa o estado real do Solfeggio no Arcanjo', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  assert.ok(arcanjo.includes('const [isProtocolFrequencyActive, setIsProtocolFrequencyActive] = useState(false);'));
  assert.ok(arcanjo.includes('Narração neural ativa — Solfeggio ${config.freq} Hz suspenso.'));
  assert.ok(arcanjo.includes('Solfeggio ${config.freq} Hz ativo durante a pausa ou após a narração.'));
  assert.ok(arcanjo.includes('Áudio desativado — nenhuma frequência será reproduzida.'));
  assert.ok(arcanjo.includes('role="status" aria-live="polite"'));
  assert.ok(arcanjo.includes('prepareFrequencyForNarration();'));
});


test('pausar a narração neural do Arcanjo restaura Solfeggio apenas pelo evento onpause', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const toggleStart = arcanjo.indexOf('const togglePlayback');
  const pauseStart = arcanjo.indexOf('if (isPlaying) {', toggleStart);
  const pauseEnd = arcanjo.indexOf('\n    }', pauseStart);
  const pauseBranch = arcanjo.slice(pauseStart, pauseEnd);
  assert.ok(pauseStart >= 0 && pauseEnd > pauseStart);
  assert.ok(pauseBranch.includes('audioEngine.pauseSpeech();'));
  assert.ok(!pauseBranch.includes('playProtocolFrequency()'), 'O botão não deve reiniciar a frequência além do callback de pausa.');
  assert.ok(arcanjo.includes('onPause: () => {'));
  assert.ok(arcanjo.includes('if (requiresNeuralVoice) playProtocolFrequency();'));
});


test('Místico Moderno inicia o Solfeggio apenas no início real da narração e o interrompe em pausa, erro, conclusão e saída', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const startStart = arcanjo.indexOf('const start = () =>');
  const startEnd = arcanjo.indexOf('const togglePlayback', startStart);
  const startBlock = arcanjo.slice(startStart, startEnd);
  const onStartStart = startBlock.indexOf('onStart: () => {');
  const onPauseStart = startBlock.indexOf('onPause: () => {', onStartStart);
  const onStartBlock = startBlock.slice(onStartStart, onPauseStart);
  const onPauseBlock = startBlock.slice(onPauseStart, startBlock.indexOf('onTimeUpdate:', onPauseStart));
  assert.ok(startBlock.includes('if (isMisticoModerno) stopProtocolFrequency();'));
  assert.ok(onStartBlock.includes('prepareFrequencyForNarration();'));
  assert.ok(onPauseBlock.includes('audioEngine.stopSynth();'));
  assert.ok(onPauseBlock.includes('setIsProtocolFrequencyActive(false);'));
  assert.ok(startBlock.includes('requireExplicitVoiceId: isEleganciaProfunda || isEssenciaLuminosa || isMisticoModerno'));
  assert.ok(startBlock.includes('if (requiresNeuralVoice) playProtocolFrequency();'));
  assert.ok(startBlock.includes('complete();'));
  const toggleStart = arcanjo.indexOf('const togglePlayback');
  const selectDayStart = arcanjo.indexOf('const selectDay', toggleStart);
  const toggleBlock = arcanjo.slice(toggleStart, selectDayStart);
  assert.ok(toggleBlock.includes('audioEngine.resumeSpeech();'));
  assert.ok(toggleBlock.includes('if (!requiresNeuralVoice && !isMisticoModerno)'));
  const resetStart = arcanjo.indexOf('const resetPlayback');
  const resetEnd = arcanjo.indexOf('const complete', resetStart);
  const resetBlock = arcanjo.slice(resetStart, resetEnd);
  assert.ok(resetBlock.includes('audioEngine.stopSynth();'));
  assert.ok(resetBlock.includes('setIsProtocolFrequencyActive(false);'));
});


test('a cor da barra do navegador acompanha apenas o estilo explicitamente confirmado', () => {
  const app = read('src/App.tsx');
  const layouts = read('src/config/layouts.ts');
  const html = read('index.html');
  assert.ok(html.includes('<meta name="theme-color" content="#F8F4EC" />'), 'O shell permanece neutro antes da escolha.');
  assert.ok(app.includes("document.querySelector<HTMLMetaElement>('meta[name=\"theme-color\"]')"));
  assert.ok(app.includes("const themeColor = selected?.swatches[0] ?? '#F8F4EC';"));
  assert.ok(app.includes('metaThemeColor.setAttribute('content', themeColor);'));
  assert.ok(app.includes('const selected = layoutConfirmedThisSession'));
  assert.ok(layouts.includes("id: 'elegancia-profunda'"));
  assert.ok(layouts.includes("swatches: ['#0B1712', '#2E6B4F', '#D4AF37', '#132A1F']"));
});


test('a tela completa do Arcanjo usa o shell profundo da Elegância Profunda', () => {
  const css = read('src/elegancia-profunda-prayer-audit.css');
  const component = read('src/components/ArcanjoProtocolView.tsx');
  const main = read('src/main.tsx');
  assert.ok(main.includes("import './elegancia-profunda-prayer-audit.css';"));
  assert.ok(component.includes('id="arcanjo-protocol-view"'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] #arcanjo-protocol-view {'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] #arcanjo-protocol-view > .fixed.inset-0'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] #arcanjo-protocol-view > header'));
  assert.ok(css.includes('#arcanjo-protocol-view > header button[class*="bg-rose-"]'));
  assert.ok(css.includes('#arcanjo-protocol-view .ep-forest-panel'));
  assert.ok(css.includes('#arcanjo-protocol-view main > section:last-child > p'));
  const selectors = extractCssSelectors(css);
  assert.ok(selectors.length > 0);
  assert.ok(
    selectors.every(selector => selector.startsWith(':root[data-layout="elegancia-profunda"]')),
    'Todas as regras da oração e da tela do Arcanjo devem permanecer exclusivas do Estilo 2.'
  );
});
