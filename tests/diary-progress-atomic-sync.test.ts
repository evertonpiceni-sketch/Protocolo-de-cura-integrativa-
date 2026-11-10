import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync('src/App.tsx', 'utf8');

function section(startMarker: string, endMarker: string) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0 && end > start, `Seção não encontrada: ${startMarker}`);
  return source.slice(start, end);
}

test('Diário e resposta sistêmica persistem perfil e progresso no mesmo snapshot', () => {
  const helper = section('const saveProfileAndProgress =', '// Profile Onboarding complete');
  assert.ok(helper.includes('setUserProfile(newProfile)'));
  assert.ok(helper.includes('setProgress(newProgress)'));
  assert.ok(helper.includes('updateLocalAccountCache(newProfile, newProgress)'));
  assert.ok(helper.includes('body: JSON.stringify({ profile: newProfile, progress: newProgress })'));
  assert.equal((helper.match(/fetch\('\/api\/user\/sync'/g) || []).length, 1);

  const handlers = [
    section('const handleSaveSystemicAnswer =', '// Save detailed diary entry for a day'),
    section('const handleSaveDiaryDay =', '// Save treatment expectations')
  ];

  for (const handler of handlers) {
    const profileBranchStart = handler.indexOf('if (userProfile)');
    const elseStart = handler.indexOf('} else {', profileBranchStart);
    assert.ok(profileBranchStart >= 0 && elseStart > profileBranchStart);
    const profileBranch = handler.slice(profileBranchStart, elseStart);
    assert.ok(profileBranch.includes('saveProfileAndProgress(updatedProfile, updatedProgress)'));
    assert.ok(!profileBranch.includes('saveProgress(updatedProgress)'));
    assert.ok(!profileBranch.includes('saveProfile(updatedProfile)'));
    assert.ok(handler.includes('saveProgress(updatedProgress)'), 'Sem perfil, o salvamento local continua disponível.');
  }
});

test('salvamentos isolados preservam o outro recurso e não enviam snapshots antigos', () => {
  const cache = section('const updateLocalAccountCache =', '// Save profile state whenever it changes');
  assert.ok(cache.includes('profileToCache?: UserProfile'));
  assert.ok(cache.includes('progressToCache?: DayProgress[]'));
  assert.ok(cache.includes('const existingAccount ='));
  assert.ok(cache.includes('existingAccount?.profile'));
  assert.ok(cache.includes('existingAccount?.progress'));

  const profileSave = section('const saveProfile =', 'const saveProgress =');
  assert.ok(profileSave.includes('updateLocalAccountCache(newProfile, undefined)'));
  assert.ok(profileSave.includes('body: JSON.stringify({ profile: newProfile })'));
  assert.ok(!profileSave.includes('progress })'));

  const progressSave = section('const saveProgress =', '// Persist profile and progress together');
  assert.ok(progressSave.includes('updateLocalAccountCache(undefined, newProgress)'));
  assert.ok(progressSave.includes('body: JSON.stringify({ progress: newProgress })'));
  assert.ok(!progressSave.includes('profile: userProfile'));

  const layoutChoice = section('{(!layoutConfirmedThisSession || layoutChoiceRequested) && (', '{showPersonalJourney ? (');
  assert.ok(layoutChoice.includes('body: JSON.stringify({ profile: updatedProfile })'));
  assert.ok(layoutChoice.includes('updateLocalAccountCache(updatedProfile, undefined)'));
  assert.ok(!layoutChoice.includes('progress })'));
});
