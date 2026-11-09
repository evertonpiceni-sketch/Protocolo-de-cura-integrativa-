import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createPendingProfileSyncStore, type PendingProfileStorage } from '../src/lib/pendingProfileSync';

function createMemoryStorage(): PendingProfileStorage {
  const values = new Map<string, string>();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
    removeItem: key => { values.delete(key); }
  };
}

test('pending registration profile sync is isolated by account and survives until confirmed', () => {
  const store = createPendingProfileSyncStore(createMemoryStorage());
  const patch = { birthDate: '1984-01-12', birthTime: '21:15', birthCity: 'Canoas/RS', bgMusicType: '528hz' };

  assert.equal(store.save('Everton', patch), true);
  assert.deepEqual(store.read(' EVERTON ')?.profilePatch, patch);
  assert.equal(store.read('another-user'), null);

  store.clear('everton');
  assert.equal(store.read('everton'), null);
});

test('pending registration profile sync rejects empty or malformed records', () => {
  const storage = createMemoryStorage();
  const store = createPendingProfileSyncStore(storage);

  assert.equal(store.save('   ', { birthDate: '1984-01-12' }), false);
  assert.equal(store.save('everton', {}), false);

  storage.setItem('cura_integrada_pending_profile_sync_v1:everton', '{broken');
  assert.equal(store.read('everton'), null);
});

test('registration queues unsynced profile fields and the authenticated app retries them', () => {
  const setup = readFileSync('src/components/ProfileSetup.tsx', 'utf8');
  const app = readFileSync('src/App.tsx', 'utf8');

  assert.ok(setup.includes('queuePendingProfileSync(data.user.login, profilePatch)'));
  assert.ok(setup.includes('clearPendingProfileSync(data.user.login)'));
  assert.ok(setup.includes('Os dados complementares ficaram salvos neste dispositivo'));

  const onboardingStart = app.indexOf('const handleOnboardingComplete');
  const sessionStart = app.indexOf('// Complete a meditation session', onboardingStart);
  const onboarding = onboardingStart >= 0 && sessionStart > onboardingStart ? app.slice(onboardingStart, sessionStart) : '';
  assert.ok(onboarding.includes('setIsLoggedIn(true);'), 'login/cadastro precisa ativar a sessão autenticada sem recarregar a página');
  assert.ok(app.includes('readPendingProfileSync(account.login)'));
  assert.ok(app.includes('syncUserState({ profile: pending.profilePatch }, { accountKey: login })'));
  assert.ok(app.includes("window.addEventListener('online', flushPendingProfileSync)"));
  assert.ok(app.includes('clearPendingProfileSync(login)'));
});
