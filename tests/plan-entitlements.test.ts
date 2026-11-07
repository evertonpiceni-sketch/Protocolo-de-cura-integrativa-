import assert from 'node:assert/strict';
import test from 'node:test';
import { hasCompleteMapsAccess } from '../src/lib/planEntitlements';

test('complete Astral and Numerology maps unlock only from the semestral plan', () => {
  assert.equal(hasCompleteMapsAccess({ plan: 'free', subscriptionPlan: 'semestral' }), false);
  assert.equal(hasCompleteMapsAccess({ plan: 'pro', subscriptionPlan: 'mensal' }), false);
  assert.equal(hasCompleteMapsAccess({ plan: 'pro', subscriptionPlan: 'trimestral' }), false);
  assert.equal(hasCompleteMapsAccess({ plan: 'pro', subscriptionPlan: 'semestral' }), true);
  assert.equal(hasCompleteMapsAccess({ plan: 'pro', subscriptionPlan: 'anual' }), true);
  assert.equal(hasCompleteMapsAccess({ plan: 'pro', subscriptionPlan: undefined }), false);
});
