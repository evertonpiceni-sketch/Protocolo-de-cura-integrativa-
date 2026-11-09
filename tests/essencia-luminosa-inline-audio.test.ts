import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { shouldPlayEssenciaLuminosaInlineSolfeggio } from '../src/lib/essenciaLuminosaAudioPolicy';

test('639 Hz inline só toca com modal aberto, áudio habilitado e sem narração neural', () => {
  const base = {
    isOpen: true,
    enabled: true,
    audioEnabled: true,
    voiceLoading: false,
    voicePlaying: false,
  };

  assert.equal(shouldPlayEssenciaLuminosaInlineSolfeggio(base), true);
  assert.equal(shouldPlayEssenciaLuminosaInlineSolfeggio({ ...base, isOpen: false }), false);
  assert.equal(shouldPlayEssenciaLuminosaInlineSolfeggio({ ...base, enabled: false }), false);
  assert.equal(shouldPlayEssenciaLuminosaInlineSolfeggio({ ...base, audioEnabled: false }), false);
  assert.equal(shouldPlayEssenciaLuminosaInlineSolfeggio({ ...base, voiceLoading: true }), false);
  assert.equal(shouldPlayEssenciaLuminosaInlineSolfeggio({ ...base, voicePlaying: true }), false);
});

test('Anamnese e Perguntas Sistêmicas conectam a política de áudio exclusiva da Essência Luminosa', () => {
  const anamnesis = fs.readFileSync('src/components/AnamnesisModal.tsx', 'utf8');
  const systemic = fs.readFileSync('src/components/SystemicQuestionsModal.tsx', 'utf8');

  assert.ok(anamnesis.includes('shouldPlayEssenciaLuminosaInlineSolfeggio'));
  assert.ok(anamnesis.includes('audioEnabled: userProfile.audioEnabled'));
  assert.ok(anamnesis.includes('voiceLoading: isLoadingVoice'));
  assert.ok(anamnesis.includes('voicePlaying: isPlayingTherapeuticVoice'));
  assert.ok(anamnesis.includes('ensureAnamnesisSolfeggio();'));
  assert.ok(anamnesis.includes('setNeuralVoicePreviewActive(true)'));
  assert.ok(anamnesis.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(anamnesis.includes(': is639HzActive;'));
  assert.ok(anamnesis.includes('isEssenciaLuminosa ? isLoadingVoice : false'));

  assert.ok(systemic.includes('shouldPlayEssenciaLuminosaInlineSolfeggio'));
  assert.ok(systemic.includes('audioEnabled: userProfile?.audioEnabled'));
  assert.ok(systemic.includes('voiceLoading: isReadingVoice'));
  assert.ok(systemic.includes('voicePlaying: isReadingVoice'));
  assert.ok(systemic.includes('setNeuralVoicePreviewActive(true)'));
  assert.ok(systemic.includes('setNeuralVoicePreviewActive(false)'));
  assert.ok(systemic.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(systemic.includes('disabled={isEssenciaLuminosa && (userProfile?.audioEnabled === false || isReadingVoice)}'));
  assert.ok(systemic.includes(': is639HzActive;'));
  assert.ok(systemic.includes('isEssenciaLuminosa ? isReadingVoice : false'));

  const anamnesisCss = fs.readFileSync('src/essencia-luminosa-anamnesis-audit.css', 'utf8');
  const systemicCss = fs.readFileSync('src/essencia-luminosa-final-audit.css', 'utf8');
  assert.ok(anamnesisCss.includes(':root[data-layout="essencia-luminosa"] #anamnesis-modal'));
  assert.ok(systemicCss.includes(':root[data-layout="essencia-luminosa"] #systemic-questions-modal [class*="bg-emerald-"]'));
});
