import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('Natural Sereno uses the approved Marianne neural voice without silent device fallback', () => {
  const app = read('src/App.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const session = read('src/components/MeditationSession.tsx');
  const server = read('server.ts');

  assert.ok(app.includes("const isNaturalSereno = layoutConfirmedThisSession && userProfile?.visualLayout === 'natural-sereno';"));
  assert.ok(app.includes('const usesNeuralVoiceCatalog = isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa;'));
  assert.ok(app.includes("const selectedNeuralVoiceId = isNaturalSereno && (currentLanguage === 'pt' || !isElevenLabsVoiceId(userProfile?.voiceId))"));
  assert.ok(app.includes('currentLanguage={currentLanguage}'));
  assert.ok(app.includes('disabled={isNaturalSereno && currentLanguage === \'pt\'}'));
  assert.ok(app.includes('const selectableSettingsNeuralVoices = isNaturalSereno && currentLanguage === \'pt\''));
  assert.ok(settings.includes('const selectableNeuralVoices = isNaturalSereno && currentLanguage === \'pt\''));
  assert.ok(settings.includes('disabled={isNaturalSereno && currentLanguage === \'pt\'}'));
  assert.ok(app.includes('voiceId: selectedNeuralVoiceId'));
  assert.ok(app.includes('Natural Sereno, Elegância Profunda e Essência Luminosa não usam a voz do dispositivo.'));
  assert.ok(settings.includes("const requiresNeuralVoice = isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa;"));
  assert.ok(settings.includes('(isNaturalSereno || isEssenciaLuminosa) && !isElevenLabsVoiceId(savedVoiceId)'));
  assert.ok(settings.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(session.includes("const protocolVoiceId = language === 'pt' ? OFFICIAL_PROTOCOL_VOICE_ID : savedVoiceId;"));
  assert.ok(session.includes("? protocolVoiceId\n        : activeLayout === 'elegancia-profunda'"));
  assert.ok(server.includes('voice_id: OFFICIAL_PROTOCOL_VOICE_ID, name: "Marianne — Meditação"'));
});
