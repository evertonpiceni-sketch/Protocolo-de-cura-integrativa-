import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const arcanjo = fs.readFileSync('src/components/ArcanjoProtocolView.tsx', 'utf8');

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
