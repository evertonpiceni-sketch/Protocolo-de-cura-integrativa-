import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { syncUserState } from '../src/lib/userSync';

test('user sync repete após contenção do lock e conclui quando o lock é liberado', async () => {
  const calls: Array<{ body: string; credentials: string | undefined }> = [];
  const delays: number[] = [];
  const fetcher: typeof fetch = async (_input, init) => {
    calls.push({ body: String(init?.body || ''), credentials: init?.credentials as string | undefined });
    return calls.length === 1
      ? new Response(JSON.stringify({ error: 'lock busy' }), { status: 409, headers: { 'Retry-After': '1' } })
      : new Response(JSON.stringify({ success: true }), { status: 200 });
  };

  const profile = { reminderTime: '08:30' };
  const response = await syncUserState({ profile }, {
    fetcher,
    wait: async milliseconds => { delays.push(milliseconds); },
    maxAttempts: 3,
  });

  assert.equal(response.status, 200);
  assert.equal(calls.length, 2);
  assert.deepEqual(JSON.parse(calls[0].body), { profile });
  assert.deepEqual(JSON.parse(calls[1].body), { profile });
  assert.equal(calls[0].credentials, 'same-origin');
  assert.deepEqual(delays, [1000]);
});

test('user sync repete falha transitória de rede sem duplicar campos ou alterar o payload', async () => {
  let calls = 0;
  const delays: number[] = [];
  const progress = [{ dayNumber: 1, completed: true }];
  const response = await syncUserState({ progress }, {
    fetcher: async () => {
      calls += 1;
      if (calls === 1) throw new Error('temporary network failure');
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    },
    wait: async milliseconds => { delays.push(milliseconds); },
    maxAttempts: 3,
  });

  assert.equal(response.status, 200);
  assert.equal(calls, 2);
  assert.deepEqual(delays, [300]);
});

test('user sync não repete respostas permanentes de autenticação ou validação', async () => {
  let calls = 0;
  await assert.rejects(
    syncUserState({ profile: { name: 'Teste' } }, {
      fetcher: async () => {
        calls += 1;
        return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
      },
      wait: async () => { throw new Error('não deveria aguardar'); },
      maxAttempts: 5,
    }),
    /HTTP 401/
  );
  assert.equal(calls, 1);
});

test('App e jornada Natural Sereno usam sincronização resiliente e enviam apenas os campos alterados quando possível', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  const journey = fs.readFileSync('src/lib/naturalSerenoHomeJourneyStateFix.ts', 'utf8');

  assert.ok(app.includes("import { syncUserState } from './lib/userSync';"));
  assert.ok(app.includes('syncUserState({ profile: newProfile })'));
  assert.ok(app.includes('syncUserState({ progress: newProgress })'));
  assert.ok(!app.includes("fetch('/api/user/sync'"));
  assert.ok(journey.includes("import { syncUserState } from './userSync';"));
  assert.ok(journey.includes('await syncUserState({ profile, progress })'));
});


test('user sync does not retry before a numeric Retry-After longer than the bounded wait', async () => {
  let calls = 0;
  const delays: number[] = [];
  await assert.rejects(
    syncUserState({ profile: { reminderTime: '08:30' } }, {
      fetcher: async () => {
        calls += 1;
        return new Response(JSON.stringify({ error: 'rate limited' }), {
          status: 429,
          headers: { 'Retry-After': '10' },
        });
      },
      wait: async milliseconds => { delays.push(milliseconds); },
      maxAttempts: 8,
    }),
    /Retry-After exceeds the 5000ms retry window/
  );
  assert.equal(calls, 1);
  assert.deepEqual(delays, []);
});

test('user sync does not retry before a future HTTP-date Retry-After beyond the bounded wait', async () => {
  let calls = 0;
  const delays: number[] = [];
  const retryAfter = new Date(Date.now() + 15_000).toUTCString();
  await assert.rejects(
    syncUserState({ progress: [{ dayNumber: 1, completed: true }] }, {
      fetcher: async () => {
        calls += 1;
        return new Response(JSON.stringify({ error: 'rate limited' }), {
          status: 429,
          headers: { 'Retry-After': retryAfter },
        });
      },
      wait: async milliseconds => { delays.push(milliseconds); },
      maxAttempts: 8,
    }),
    /Retry-After exceeds the 5000ms retry window/
  );
  assert.equal(calls, 1);
  assert.deepEqual(delays, []);
});
