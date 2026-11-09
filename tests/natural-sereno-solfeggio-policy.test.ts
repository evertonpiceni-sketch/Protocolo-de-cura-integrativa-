import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { shouldPlayInlineSolfeggio } from '../src/lib/protocolSessionAudioPolicy';

const read = (path: string) => fs.readFileSync(path, 'utf8');
const enabledState = {
  isOpen: true,
  enabled: true,
  audioEnabled: true,
  voiceLoading: false,
  voicePlaying: false
};

test('Solfeggio inline só toca com áudio habilitado e sem narração em curso', () => {
  assert.equal(shouldPlayInlineSolfeggio(enabledState), true);
  assert.equal(shouldPlayInlineSolfeggio({ ...enabledState, audioEnabled: false }), false);
  assert.equal(shouldPlayInlineSolfeggio({ ...enabledState, voiceLoading: true }), false);
  assert.equal(shouldPlayInlineSolfeggio({ ...enabledState, voicePlaying: true }), false);
  assert.equal(shouldPlayInlineSolfeggio({ ...enabledState, isOpen: false }), false);
  assert.equal(shouldPlayInlineSolfeggio({ ...enabledState, enabled: false }), false);
  assert.equal(shouldPlayInlineSolfeggio({ ...enabledState, audioEnabled: undefined }), true);
});

test('Anamnese e Perguntas Sistêmicas cedem o áudio ao preview neural sem fallback robótico', () => {
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  const systemic = read('src/components/SystemicQuestionsModal.tsx');

  for (const source of [anamnesis, systemic]) {
    assert.ok(source.includes('shouldPlayInlineSolfeggio'));
    assert.ok(source.includes('setNeuralVoicePreviewActive(true)'));
    assert.ok(source.includes('setNeuralVoicePreviewActive(false)'));
    assert.ok(source.includes('fallbackToSpeechSynthesis: false'));
  }

  assert.ok(anamnesis.includes('userProfile.audioEnabled !== false'));
  assert.ok(systemic.includes('userProfile?.audioEnabled !== false'));
  assert.ok(anamnesis.includes("bg-[#B88736] border-[#A87E37] text-[#FFFDF8]"));
  assert.ok(!systemic.includes('setTimeout(() => setIsReadingVoice(false), 12000)'));
  assert.ok(systemic.includes('is639HzAudible'));
});

test('Arcanjo/São Miguel interrompe Solfeggio durante narração neural e retoma após pausa, término ou falha', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const block = (start: string, end: string) => {
    const from = arcanjo.indexOf(start);
    const to = arcanjo.indexOf(end, from + start.length);
    assert.ok(from >= 0 && to > from, `Bloco não encontrado: ${start}`);
    return arcanjo.slice(from, to);
  };

  const startFrequency = block('const startSolfeggio = () => {', 'const stopSolfeggio = () => {');
  assert.ok(startFrequency.includes('userProfile.audioEnabled === false'));
  assert.ok(startFrequency.includes('audioEngine.startSynth(`${config.freq}hz`)'));

  const onStart = block('onStart: () => {', 'onPause: () => {');
  assert.ok(onStart.includes('stopSolfeggio();'));
  assert.ok(!onStart.includes('startSolfeggio();'));

  const onPause = block('onPause: () => {', 'onTimeUpdate:');
  assert.ok(onPause.includes('startSolfeggio();'));

  const completion = block('const complete = () => {', 'const startNativeFallback =');
  assert.ok(completion.includes('resetPlayback();'));
  assert.ok(completion.includes('startSolfeggio();'));

  const onError = block('onError: () => {', '    });');
  assert.ok(onError.includes('startSolfeggio();'));

  const toggle = block('const togglePlayback = () => {', 'const selectDay =');
  assert.ok(toggle.indexOf('stopSolfeggio();') < toggle.indexOf('audioEngine.resumeSpeech();'));

  assert.ok(arcanjo.includes('Narração neural ativa — Solfeggio'));
  assert.ok(arcanjo.includes('Solfeggio ${config.freq} Hz ativo — narração pausada ou encerrada'));
});
