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
