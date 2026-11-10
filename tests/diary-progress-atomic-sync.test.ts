import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync('src/App.tsx', 'utf8');

function section(startMarker: string, endMarker: string) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0 && end > start, 'Seção não encontrada: ' + startMarker);
  return source.slice(start, end);
}

test('Diário e resposta sistêmica persistem perfil e progresso no mesmo snapshot', () => {
  const saveProfile = section('const saveProfile =', 'const saveProgress =');
  assert.ok(saveProfile.includes('progressOverride?: DayProgress[]'));
  assert.ok(saveProfile.includes('setUserProfile(newProfile)'));
  assert.ok(saveProfile.includes('setProgress(progressOverride)'));
  assert.ok(saveProfile.includes('updateLocalAccountCache(newProfile, nextProgress)'));
  assert.ok(saveProfile.includes('? { profile: newProfile, progress: progressOverride }'));
  assert.ok(saveProfile.includes('syncUserState(syncPayload'));
  assert.equal((saveProfile.match(/syncUserState\(/g) || []).length, 1);

  const handlers = [
    section('const handleSaveSystemicAnswer =', '// Save detailed diary entry for a day'),
    section('const handleSaveDiaryDay =', '// Save treatment expectations')
  ];

  for (const handler of handlers) {
    const profileBranchStart = handler.indexOf('if (userProfile)');
    const elseStart = handler.indexOf('} else {', profileBranchStart);
    assert.ok(profileBranchStart >= 0 && elseStart > profileBranchStart);
    const profileBranch = handler.slice(profileBranchStart, elseStart);
    assert.ok(profileBranch.includes('saveProfile(updatedProfile, updatedProgress)'));
    assert.ok(!profileBranch.includes('saveProgress(updatedProgress)'));
    assert.ok(handler.includes('saveProgress(updatedProgress)'), 'Sem perfil, o salvamento local continua disponível.');
  }
});
