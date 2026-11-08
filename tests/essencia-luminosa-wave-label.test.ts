import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { shouldBlockTrackDuringNeuralVoicePreview } from '../src/lib/protocolSessionAudioPolicy';

test('Essência Luminosa identifica waves como ambiência de ondas, não como tigelas tibetanas', () => {
  const audioSettings = fs.readFileSync('src/components/AudioSettingsModal.tsx', 'utf8');
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  const audioEngine = fs.readFileSync('src/lib/audio.ts', 'utf8');

  assert.ok(audioSettings.includes("{ id: 'waves', name: isEssenciaLuminosa ? 'Ondas do Mar' : 'Sinos Zen', desc: isEssenciaLuminosa ? 'Maré suave e brisa costeira' : 'Tigelas Tibetanas', pro: false }"));
  assert.ok(app.includes("{ id: 'waves', title: isEssenciaLuminosa ? 'Ondas do Mar' : 'Sinos & Brisa Tibetana', subtitle: isEssenciaLuminosa ? 'Maré suave e brisa costeira' : 'Atmosfera de Templo Sagrado', isPro: false }"));
  assert.ok(audioEngine.includes("type === 'waves' || type === 'florestazen' || type === 'chuvaserena'"));
  assert.equal(shouldBlockTrackDuringNeuralVoicePreview(true, true, 'waves'), false);
  assert.equal(shouldBlockTrackDuringNeuralVoicePreview(true, true, 'chuvaserena'), false);
  assert.equal(shouldBlockTrackDuringNeuralVoicePreview(true, true, '528hz'), true);
});
