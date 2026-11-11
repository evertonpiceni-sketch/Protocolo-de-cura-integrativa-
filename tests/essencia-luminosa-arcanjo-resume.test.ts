import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const arcanjo = fs.readFileSync('src/components/ArcanjoProtocolView.tsx', 'utf8');
const prayerModal = fs.readFileSync('src/components/ArchangelMichaelPrayerModal.tsx', 'utf8');
const app = fs.readFileSync('src/App.tsx', 'utf8');

test('a retomada da narração neural suspende Solfeggio antes de reabrir a voz', () => {
  const start = arcanjo.indexOf('const togglePlayback');
  const end = arcanjo.indexOf('const selectDay', start);
  assert.ok(start >= 0 && end > start, 'O controle de reprodução do Arcanjo deve existir.');

  const toggle = arcanjo.slice(start, end);
  assert.ok(
    toggle.includes('if (requiresNeuralVoice) stopProtocolFrequency();\n    audioEngine.resumeSpeech();'),
    'A frequência precisa ser interrompida antes de retomar a narração neural.'
  );

  const pauseStart = toggle.indexOf('if (isPlaying) {');
  const pauseEnd = toggle.indexOf('\n    }', pauseStart);
  const pauseBranch = toggle.slice(pauseStart, pauseEnd);
  assert.ok(pauseBranch.includes('audioEngine.pauseSpeech();'));
  assert.ok(!pauseBranch.includes('playProtocolFrequency()'), 'A pausa não pode restaurar a frequência por um segundo caminho.');
});

test('a pausa restaura a frequência somente pelo callback e respeita o áudio global', () => {
  assert.ok(arcanjo.includes('onPause: () => {'));
  assert.ok(arcanjo.includes('if (requiresNeuralVoice) playProtocolFrequency();'));
  assert.ok(arcanjo.includes('if (userProfile.audioEnabled === false) {'));
  assert.ok(arcanjo.includes('if (isSolfeggioFrequency(audioEngine.getCurrentSynthType())) {'));
});


test('a oração legada do Arcanjo suspende apenas Solfeggio durante a narração neural no Estilo 3', () => {
  const helperStart = prayerModal.indexOf('const suspendEssenciaSolfeggio');
  const helperEnd = prayerModal.indexOf('const stopAudio', helperStart);
  const helper = prayerModal.slice(helperStart, helperEnd);
  assert.ok(helper.includes('isEssenciaLuminosa && isSolfeggioFrequency(audioEngine.getCurrentSynthType())'));
  assert.ok(helper.includes('audioEngine.stopBG()'));

  const playStart = prayerModal.indexOf('const handleTogglePlay');
  const playEnd = prayerModal.indexOf('const handleCompleteToday', playStart);
  const toggle = prayerModal.slice(playStart, playEnd);
  assert.ok(toggle.indexOf('suspendEssenciaSolfeggio();') < toggle.indexOf('audioEngine.speakWithElevenLabsOrFallback('));
  assert.ok(toggle.includes('onNarrationStateChange?.(true)'));
  assert.ok(toggle.includes('onNarrationStateChange?.(false)'));
  assert.ok(prayerModal.includes('fallbackToSpeechSynthesis: !(isEleganciaProfunda || isEssenciaLuminosa)'));

  assert.ok(app.includes('onNarrationStateChange={isEssenciaLuminosa ? setIsArchangelNarrationActive : undefined}'));
  assert.ok(app.includes('isEssenciaLuminosa && isArchangelNarrationActive && isSolfeggioFrequency(userProfile.bgMusicType)'));
  assert.ok(app.includes('!(isEssenciaLuminosa && showArchangelModal) &&'));
});
