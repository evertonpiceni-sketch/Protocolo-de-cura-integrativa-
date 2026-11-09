import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { hasCommercialAccess } from '../src/lib/naturalSerenoHomeJourneyStateFix';

const source = readFileSync(new URL('../src/lib/naturalSerenoHomeJourneyStateFix.ts', import.meta.url), 'utf8');
const fixedNow = Date.parse('2026-11-09T12:00:00.000Z');

test('Natural Sereno grants protocol access only while an explicit paid entitlement is active', () => {
  assert.equal(hasCommercialAccess({
    subscriptionPlan: 'mensal',
    subscriptionExpiresAt: new Date(fixedNow + 60_000).toISOString(),
  }, fixedNow), true);

  assert.equal(hasCommercialAccess({
    subscriptionPlan: 'mensal',
    subscriptionExpiresAt: new Date(fixedNow - 60_000).toISOString(),
  }, fixedNow), false);

  assert.equal(hasCommercialAccess({
    subscriptionPlan: 'mensal',
    subscriptionExpiresAt: 'data-inválida',
  }, fixedNow), false);
});

test('legacy/admin grants without an explicit expiry keep their existing access rule', () => {
  assert.equal(hasCommercialAccess({ subscriptionPlan: 'mensal' }, fixedNow), true);
});

test('the existing VIP7 trial rule is preserved rather than silently reclassified as a paid plan', () => {
  assert.equal(hasCommercialAccess({
    subscriptionPlan: 'teste_vip_7d',
    subscriptionExpiresAt: new Date(fixedNow + 7 * 86_400_000).toISOString(),
  }, fixedNow), false);
});

test('protocol choice persistence rechecks entitlement at the moment of saving', () => {
  const start = source.indexOf('async function persistProtocolChoice');
  const end = source.indexOf('function setGatedControls', start);
  const handler = start >= 0 && end > start ? source.slice(start, end) : '';
  assert.ok(handler.includes('if (!hasCommercialAccess(state)) return false;'));
});

test('an expired entitlement cannot bypass the access gate through an already selected journey', () => {
  const start = source.indexOf('function installProtocolCapture()');
  const end = source.indexOf('function applyFlowState()', start);
  const handler = start >= 0 && end > start ? source.slice(start, end) : '';
  assert.ok(handler.indexOf('const hasAccess = hasCommercialAccess(state)') >= 0);
  assert.ok(handler.indexOf('const hasAccess = hasCommercialAccess(state)') < handler.indexOf('const activeJourney = hasAccess && hasExplicitJourney(state)'));
});

test('the home flow refreshes its access state when the saved subscription expiry is reached', () => {
  assert.ok(source.includes('subscriptionExpiresAt: account?.profile?.subscriptionExpiresAt'));
  assert.ok(source.includes('subscriptionExpiresAt: profileWithLogin.subscriptionExpiresAt'));
  assert.ok(source.includes('scheduleExpiryRefresh(journeyState)'));
  assert.ok(source.includes('remoteStateRequested = false;'));
});
