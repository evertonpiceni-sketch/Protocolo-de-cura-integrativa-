import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { resolveAudioEnabledAfterFrequencySelection } from '../src/lib/essenciaLuminosaAudioPolicy';

test('selecionar frequência na Anamnese preserva o silêncio global explícito no Estilo 3', () => {
  assert.equal(resolveAudioEnabledAfterFrequencySelection(true, false), false);
  assert.equal(resolveAudioEnabledAfterFrequencySelection(true, true), true);
  assert.equal(resolveAudioEnabledAfterFrequencySelection(true, undefined), true);
  assert.equal(resolveAudioEnabledAfterFrequencySelection(false, false), true);
});

test('o callback da Anamnese aplica a frequência sem reativar o áudio global no Estilo 3', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  const start = app.indexOf('onApplyFrequency={(freq) => {');
  const end = app.indexOf('\n        />', start);
  assert.ok(start >= 0 && end > start, 'Callback de frequência da Anamnese deve existir.');
  const callback = app.slice(start, end);
  assert.ok(callback.includes('resolveAudioEnabledAfterFrequencySelection(isEssenciaLuminosa, userProfile.audioEnabled)'));
  assert.doesNotMatch(callback, /audioEnabled:\s*true/);
});

test('o seletor de trilha dos Ajustes respeita o silêncio global no Estilo 3', () => {
  const settings = fs.readFileSync('src/components/AudioSettingsModal.tsx', 'utf8');
  const tracksStart = settings.indexOf("{ id: '396hz'");
  const start = settings.indexOf('onClick={() => {', tracksStart);
  const end = settings.indexOf('\n                  }}', start);
  assert.ok(start >= 0 && end > start, 'Seletor ativo de trilha dos Ajustes deve existir.');
  const callback = settings.slice(start, end);
  assert.ok(callback.includes('if (allowBackgroundPlayback && (!isEssenciaLuminosa || audioEnabled))'));
  assert.ok(callback.includes('else if (isEssenciaLuminosa && !audioEnabled)'));
  assert.ok(callback.includes('audioEngine.stopBG()'));

  const saveStart = settings.indexOf('const handleSave = () => {');
  const saveEnd = settings.indexOf('\n  };', saveStart);
  assert.ok(saveStart >= 0 && saveEnd > saveStart, 'Salvar ajustes de áudio deve existir.');
  const save = settings.slice(saveStart, saveEnd);
  assert.ok(save.includes('audioEnabled,'));
  assert.ok(save.includes("if (allowBackgroundPlayback && audioEnabled && bgMusicType !== 'none')"));
});
