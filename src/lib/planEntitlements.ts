import type { UserProfile } from '../types';

const COMPLETE_MAP_PLANS = new Set(['semestral', 'anual']);

/**
 * The approved plan rule keeps the compact maps in entry plans and unlocks
 * both complete maps only from the semestral plan upward.
 */
export function hasCompleteMapsAccess(profile: Pick<UserProfile, 'plan' | 'subscriptionPlan'>): boolean {
  return profile.plan === 'pro' && COMPLETE_MAP_PLANS.has(profile.subscriptionPlan || '');
}
