import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { syncUserState } from '../src/lib/userSync';

test('user sync retries a shared-lock response and respects Retry-After', async () => {
  let calls = 0;
  const waits: number[] = [];
  const response = await syncUserState(
    { progress: [{ dayNumber: 1, completed: true }] },
    {
      maxAttempts: 3,
      wait: async milliseconds => { waits.push(milliseconds); },
      fetcher: async () => {
        calls += 1;
        return calls === 1
          ? new Response('{"error":"busy"}', { status: 409, headers: { 'Retry-After': '1' } })
          : new Response('{"success":true}', { status: 200 });
      },
    },
  );

  assert.equal(response.status, 200);
  assert.equal(calls, 2);
  assert.deepEqual(waits, [1000]);
});

test('user sync retries transient persistence failures with bounded backoff', async () => {
  let calls = 0;
  const waits: number[] = [];
  const response = await syncUserState(
    { profile: { visualLayout: 'natural-sereno' } },
    {
      maxAttempts: 3,
      wait: async milliseconds => { waits.push(milliseconds); },
      fetcher: async () => {
        calls += 1;
        return calls === 1
          ? new Response('{"code":"PERSISTENCE_UNAVAILABLE"}', { status: 503 })
          : new Response('{"success":true}', { status: 200 });
      },
    },
  );

  assert.equal(response.status, 200);
  assert.equal(calls, 2);
  assert.deepEqual(waits, [300]);
});

test('user sync does not retry permanent authentication or validation errors', async () => {
  let calls = 0;
  await assert.rejects(
    syncUserState(
      { profile: { visualLayout: 'natural-sereno' } },
      {
        maxAttempts: 4,
        wait: async () => { assert.fail('permanent errors must not wait'); },
        fetcher: async () => {
          calls += 1;
          return new Response('{"error":"unauthorized"}', { status: 401 });
        },
      },
    ),
    /HTTP 401/,
  );
  assert.equal(calls, 1);
});

test('user sync does not retry before a Retry-After longer than its bounded window', async () => {
  let calls = 0;
  const waits: number[] = [];
  await assert.rejects(
    syncUserState(
      { progress: [] },
      {
        maxAttempts: 4,
        wait: async milliseconds => { waits.push(milliseconds); },
        fetcher: async () => {
          calls += 1;
          return new Response('{"error":"busy"}', { status: 503, headers: { 'Retry-After': '6' } });
        },
      },
    ),
    /Retry-After exceeds the 5000ms retry window/,
  );
  assert.equal(calls, 1);
  assert.deepEqual(waits, []);
});

test('user sync rejects an empty payload before making a request', async () => {
  let calls = 0;
  await assert.rejects(
    syncUserState({}, {
      fetcher: async () => {
        calls += 1;
        return new Response('{}', { status: 200 });
      },
    }),
    /profile or progress payload is required/,
  );
  assert.equal(calls, 0);
});

test('active profile, progress, onboarding and Natural Sereno journey paths use the retry helper', () => {
  const app = readFileSync('src/App.tsx', 'utf8');
  const setup = readFileSync('src/components/ProfileSetup.tsx', 'utf8');
  const journey = readFileSync('src/lib/naturalSerenoHomeJourneyStateFix.ts', 'utf8');

  assert.match(app, /const saveProfile = \(newProfile: UserProfile, progressOverride\?: DayProgress\[\]\) =>/);
  const normalizedApp = app.replace(/\s+/g, ' ');
  assert.ok(normalizedApp.includes('const syncPayload = progressOverride ? { profile: newProfile, progress: progressOverride } : { profile: newProfile };'));
  assert.match(app, /void syncUserState\(syncPayload, \{ accountKey: newProfile\.login \}\)/);
  assert.match(app, /void syncUserState\(\{ progress: newProgress \}, \{ accountKey: userProfile\?\.login \}\)/);
  assert.match(app, /await syncUserState\(\{ profile: updatedProfile \}, \{ accountKey: updatedProfile\.login \}\)/);
  assert.doesNotMatch(app, /fetch\(['"]\/api\/user\/sync/);
  assert.match(setup, /syncUserState\(/);
  assert.doesNotMatch(setup, /fetch\(['"]\/api\/user\/sync/);
  assert.match(journey, /syncUserState\(\{ profile, progress \}, \{ accountKey:/);
  assert.doesNotMatch(journey, /fetch\(['"]\/api\/user\/sync/);
});


test('user sync cancels a retry when the authenticated account changes', async () => {
  let currentAccount = 'account-a';
  let calls = 0;
  let releaseWait!: () => void;
  let markStarted!: () => void;
  const waitGate = new Promise<void>(resolve => { releaseWait = resolve; });
  const started = new Promise<void>(resolve => { markStarted = resolve; });

  const request = syncUserState(
    { profile: { privateDiaryOwner: 'account-a' } },
    {
      accountKey: 'account-a',
      getCurrentAccountKey: () => currentAccount,
      maxAttempts: 3,
      wait: () => waitGate,
      fetcher: async () => {
        calls += 1;
        markStarted();
        return new Response('{"error":"busy"}', { status: 503 });
      },
    },
  );

  await started;
  currentAccount = 'account-b';
  releaseWait();

  await assert.rejects(request, /active account changed/);
  assert.equal(calls, 1, 'the old account payload must not be retried with the new account cookie');
});

test('user sync serializes writes per account so a newer progress snapshot wins after an older retry', async () => {
  const currentAccount = 'account-sequenced';
  let calls = 0;
  let releaseWait!: () => void;
  let markFirstStarted!: () => void;
  const waitGate = new Promise<void>(resolve => { releaseWait = resolve; });
  const firstStarted = new Promise<void>(resolve => { markFirstStarted = resolve; });
  const sentPayloads: unknown[] = [];

  const fetcher: typeof fetch = async (_input, init) => {
    calls += 1;
    sentPayloads.push(JSON.parse(String(init?.body || '{}')));
    if (calls === 1) {
      markFirstStarted();
      return new Response('{"error":"busy"}', { status: 503 });
    }
    return new Response('{"success":true}', { status: 200 });
  };

  const first = syncUserState(
    { progress: [{ dayNumber: 1, completed: true }] },
    {
      accountKey: currentAccount,
      getCurrentAccountKey: () => currentAccount,
      maxAttempts: 2,
      wait: () => waitGate,
      fetcher,
    },
  );

  await firstStarted;
  const second = syncUserState(
    { progress: [{ dayNumber: 2, completed: true }] },
    {
      accountKey: currentAccount,
      getCurrentAccountKey: () => currentAccount,
      maxAttempts: 1,
      wait: async () => undefined,
      fetcher,
    },
  );

  assert.equal(calls, 1, 'the second write waits while the first account write is retrying');
  releaseWait();
  await Promise.all([first, second]);

  assert.deepEqual(
    sentPayloads,
    [
      { progress: [{ dayNumber: 1, completed: true }], accountLogin: currentAccount },
      { progress: [{ dayNumber: 1, completed: true }], accountLogin: currentAccount },
      { progress: [{ dayNumber: 2, completed: true }], accountLogin: currentAccount },
    ],
  );
});


test('login and logout update the active account key before another sync retry can run', () => {
  const setup = readFileSync('src/components/ProfileSetup.tsx', 'utf8');
  const app = readFileSync('src/App.tsx', 'utf8');

  const registrationKey = setup.indexOf('setCurrentAccountLogin(data.user.login);');
  const registrationSync = setup.indexOf('await syncUserState(', registrationKey);
  assert.ok(registrationKey >= 0 && registrationSync > registrationKey);

  const loginKey = setup.indexOf('setCurrentAccountLogin(account.login);');
  const loginTransition = setup.indexOf('setTimeout(() => {', loginKey);
  assert.ok(loginKey >= 0 && loginTransition > loginKey);

  const logoutStart = app.indexOf('const handleLogout = async () => {');
  const clearKey = app.indexOf('clearCurrentAccountLogin();', logoutStart);
  const logoutRequest = app.indexOf("fetch('/api/auth/logout'", logoutStart);
  assert.ok(logoutStart >= 0 && clearKey > logoutStart && logoutRequest > clearKey);
});


test('a profile payload cannot be sent under a different active account after a stale callback', async () => {
  let calls = 0;
  await assert.rejects(
    syncUserState(
      { profile: { login: 'account-a', privateDiaryOwner: 'account-a' } },
      {
        getCurrentAccountKey: () => 'account-b',
        fetcher: async () => {
          calls += 1;
          return new Response('{"success":true}', { status: 200 });
        },
      },
    ),
    /active account changed/,
  );
  assert.equal(calls, 0, 'the stale account payload must be rejected before fetch');
});

test('authenticated app and Natural Sereno journey writes pass the originating account key', () => {
  const app = readFileSync('src/App.tsx', 'utf8');
  const setup = readFileSync('src/components/ProfileSetup.tsx', 'utf8');
  const journey = readFileSync('src/lib/naturalSerenoHomeJourneyStateFix.ts', 'utf8');

  assert.match(app, /const profileWithAdmin = \{ \.\.\.profileWithPending, login: account\.login, isAdmin: account\.role === 'admin' \}/);
  assert.match(app, /login: localAccount\.login/);
  assert.match(app, /profile: \{ \.\.\.pending\.profilePatch, login \}/);
  assert.match(setup, /const profileData = \{ \.\.\.data\.user\.profile, \.\.\.profilePatch, login: data\.user\.login \}/);
  assert.match(app, /const accountWithLogin: UserAccount =/);
  assert.match(app, /profile: \{ \.\.\.account\.profile, login: account\.login \}/);
  assert.match(app, /syncUserState\(syncPayload, \{ accountKey: newProfile\.login \}\)/);
  assert.match(app, /syncUserState\(\{ progress: newProgress \}, \{ accountKey: userProfile\?\.login \}\)/);
  assert.match(app, /accountKey: updatedProfile\?\.login \?\? userProfile\?\.login/);
  assert.match(journey, /accountKey: accountLogin/);
  assert.doesNotMatch(journey, /readLocalAccount\(\)\?\.login/);
  assert.match(journey, /profile: profileWithLogin/);
});


test('a stale profile callback cannot overwrite the active account in the local cache', () => {
  const app = readFileSync('src/App.tsx', 'utf8');
  const cacheStart = app.indexOf('const updateLocalAccountCache =');
  const cacheEnd = app.indexOf('// Profile and progress are synced independently', cacheStart);
  const cacheBlock = cacheStart >= 0 && cacheEnd > cacheStart
    ? app.slice(cacheStart, cacheEnd)
    : '';

  assert.ok(cacheBlock.includes('const activeLogin = getCurrentAccountLogin();'));
  assert.ok(cacheBlock.includes('if (!activeLogin || !profileLogin || activeLogin !== profileLogin) return;'));
  assert.doesNotMatch(cacheBlock, /setItem\(LOCAL_STORAGE_KEY_CURRENT_LOGIN/);
});


test('browser user sync fails closed instead of adopting the shared local account key', async () => {
  let calls = 0;
  await assert.rejects(
    syncUserState(
      { progress: [{ dayNumber: 1, privateDiaryOwner: 'account-a' }] },
      {
        requireAccountKey: true,
        getCurrentAccountKey: () => 'account-b',
        fetcher: async () => {
          calls += 1;
          return new Response('{"success":true}', { status: 200 });
        },
      },
    ),
    /active account could not be identified/,
  );
  assert.equal(calls, 0, 'a missing origin identity must never be inferred from another tab');
});

test('user sync rejects a profile whose declared account differs from the captured origin', async () => {
  let calls = 0;
  await assert.rejects(
    syncUserState(
      { profile: { login: 'account-a', privateDiaryOwner: 'account-a' } },
      {
        accountKey: 'account-b',
        requireAccountKey: true,
        getCurrentAccountKey: () => 'account-b',
        fetcher: async () => {
          calls += 1;
          return new Response('{"success":true}', { status: 200 });
        },
      },
    ),
    /payload account does not match/,
  );
  assert.equal(calls, 0);
});

test('user sync sends the captured account identity for server-side cookie binding', async () => {
  let sentBody = '';
  await syncUserState(
    { profile: { login: 'account-a' }, progress: [{ dayNumber: 1, completed: true }] },
    {
      accountKey: 'account-a',
      getCurrentAccountKey: () => 'account-a',
      fetcher: async (_input, init) => {
        sentBody = String(init?.body || '');
        return new Response('{"success":true}', { status: 200 });
      },
    },
  );
  assert.deepEqual(JSON.parse(sentBody), {
    profile: { login: 'account-a' },
    progress: [{ dayNumber: 1, completed: true }],
    accountLogin: 'account-a',
  });
});

test('server sync endpoint binds every write to the authenticated account', () => {
  const server = readFileSync('server.ts', 'utf8');
  const helper = readFileSync('src/lib/userSync.ts', 'utf8');

  assert.match(helper, /accountLogin: currentAtStart/);
  assert.match(server, /const \{ profile, progress, accountLogin \} = req\.body \|\| \{\}/);
  assert.match(server, /originatingLogin !== authenticatedLogin/);
  assert.match(server, /profile && \(!profileLogin \|\| profileLogin !== authenticatedLogin\)/);
  assert.match(server, /login: authenticatedLogin/);
});


test('browser profile sync rejects a missing profile identity even when a tab key is supplied', async () => {
  let calls = 0;
  await assert.rejects(
    syncUserState(
      { profile: { privateDiaryOwner: 'account-a' } },
      {
        accountKey: 'account-b',
        requireAccountKey: true,
        getCurrentAccountKey: () => 'account-b',
        fetcher: async () => {
          calls += 1;
          return new Response('{"success":true}', { status: 200 });
        },
      },
    ),
    /profile origin identity is missing/,
  );
  assert.equal(calls, 0, 'a shared tab key cannot stand in for the profile origin identity');
});
