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

test('trocar a trilha durante a sessão preserva o silêncio global no Estilo 3 sem alterar os outros estilos', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  const start = app.indexOf('onChangeBgMusic={(bgType) => {');
  const end = app.indexOf('\n          }}', start);
  assert.ok(start >= 0 && end > start, 'Callback de trilha da sessão deve existir.');
  const callback = app.slice(start, end);
  assert.ok(callback.includes('isEssenciaLuminosa ? resolveAudioEnabledAfterFrequencySelection(isEssenciaLuminosa, userProfile.audioEnabled)'));
  assert.ok(callback.includes(": bgType !== 'none' ? true : userProfile.audioEnabled"));
  assert.doesNotMatch(callback, /audioEnabled:\\s*bgType !== 'none'\\s*\\?\\s*true/);
});
