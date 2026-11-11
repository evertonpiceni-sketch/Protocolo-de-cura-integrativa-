import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('salvar a Anamnese preserva a preferência de áudio e não concede consentimento de reprodução', () => {
  const source = read('src/App.tsx');
  const start = source.indexOf('const handleSaveAnamnesis = (newAnamnesis: AnamnesisData) => {');
  const end = source.indexOf('\n  };', start);
  assert.ok(start >= 0 && end > start, 'handler de salvamento da Anamnese deve existir');

  const handler = source.slice(start, end);
  assert.match(handler, /\.\.\.userProfile/);
  assert.match(handler, /bgMusicType:/);
  assert.match(handler, /saveProfile\(updatedProfile\)/);
  assert.doesNotMatch(handler, /audioEnabled\s*:\s*true/);
  assert.doesNotMatch(handler, /setAudioPlaybackRequested\(true\)/);
});
