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
  assert.ok(settings.includes("const requiresNeuralVoice = isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa;"));
  assert.ok(settings.includes('(isNaturalSereno || isEssenciaLuminosa) && !isElevenLabsVoiceId(savedVoiceId)'));
  assert.ok(settings.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(session.includes("? savedVoiceId\n        : activeLayout === 'elegancia-profunda'"));
  assert.ok(server.includes('voice_id: OFFICIAL_PROTOCOL_VOICE_ID, name: "Marianne — Meditação"'));
});
