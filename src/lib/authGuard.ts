/**
 * Centralized client-side identity helper.
 * IMPORTANT: this is for UI state only. Premium/admin authorization MUST be
 * enforced by the server/database and never by this module alone.
 */
import { getCurrentIdentity, supabase, type AppIdentity } from './supabase';

export async function requireIdentity(): Promise<AppIdentity> {
  const identity = await getCurrentIdentity();
  if (!identity) throw new Error('AUTH_REQUIRED');
  return identity;
}

export async function requireAdminIdentity(): Promise<AppIdentity> {
  const identity = await requireIdentity();
  if (identity.role !== 'admin') throw new Error('ADMIN_REQUIRED');
  return identity;
}

export async function requirePremiumIdentity(): Promise<AppIdentity> {
  const identity = await requireIdentity();
  if (identity.plan !== 'pro') throw new Error('PREMIUM_REQUIRED');
  return identity;
}

export function subscribeToAuthChanges(callback: (identity: AppIdentity | null) => void) {
  return supabase.auth.onAuthStateChange(async () => {
    try {
      callback(await getCurrentIdentity());
    } catch {
      callback(null);
    }
  });
}
