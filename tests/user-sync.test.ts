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
    /HTTP 401 after 1 attempt/,
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

test('App syncs profile-only and progress-only changes separately, with one atomic snapshot when both change', () => {
  const app = readFileSync('src/App.tsx', 'utf8');
  assert.match(app, /const saveProfile = \(newProfile: UserProfile, progressOverride\?: DayProgress\[\]\) =>/);
  assert.match(app, /const syncPayload = progressOverride \? \{ profile: newProfile, progress: progressOverride \} : \{ profile: newProfile \};/);
  assert.match(app, /void syncUserState\(syncPayload\)/);
  assert.match(app, /void syncUserState\(\{ progress: newProgress \}\)/);
  assert.match(app, /await syncUserState\(\{ profile: updatedProfile \}\)/);
});
