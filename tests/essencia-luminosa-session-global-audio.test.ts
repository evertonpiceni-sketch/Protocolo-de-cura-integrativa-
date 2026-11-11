import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { shouldPlayEssenciaLuminosaSessionBackground } from '../src/lib/essenciaLuminosaAudioPolicy';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('a sessão principal da Essência Luminosa respeita o interruptor global de áudio', () => {
  assert.equal(shouldPlayEssenciaLuminosaSessionBackground('playing', 'waves', true), true);
  assert.equal(shouldPlayEssenciaLuminosaSessionBackground('playing', 'waves', false), false);
  assert.equal(shouldPlayEssenciaLuminosaSessionBackground('playing', 'waves'), true);
});

test('a sessão não inicia Solfeggio nem ambiência fora da fase de reprodução', () => {
  assert.equal(shouldPlayEssenciaLuminosaSessionBackground('playing', '639hz', true), false);
  assert.equal(shouldPlayEssenciaLuminosaSessionBackground('playing', 'none', true), false);
  assert.equal(shouldPlayEssenciaLuminosaSessionBackground('portal', 'waves', true), false);
});

test('App transmite o estado global e a sessão aplica a regra apenas ao Estilo 3', () => {
  const app = read('src/App.tsx');
  const session = read('src/components/MeditationSession.tsx');

  assert.ok(app.includes('audioEnabled={userProfile.audioEnabled !== false}'));
  assert.ok(session.includes('audioEnabled?: boolean'));
  assert.ok(session.includes('shouldPlayEssenciaLuminosaSessionBackground(sessionPhase, bgMusicType, audioEnabled)'));
  assert.ok(session.includes(': shouldPlayProtocolSessionBackground(sessionPhase, bgMusicType)'));
});
