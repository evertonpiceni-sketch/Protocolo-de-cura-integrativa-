import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase is not configured. Authentication features are unavailable.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.invalid',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'protocolo-cura-auth',
    },
  }
);

export type AppRole = 'user' | 'admin';
export type AppPlan = 'free' | 'pro';

export interface AppIdentity {
  id: string;
  email: string | null;
  role: AppRole;
  plan: AppPlan;
}

export async function getCurrentIdentity(): Promise<AppIdentity | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role, plan')
    .eq('id', user.id)
    .single();

  if (error || !profile) return null;

  return {
    id: user.id,
    email: user.email ?? null,
    role: profile.role as AppRole,
    plan: profile.plan as AppPlan,
  };
}

export const signOut = () => supabase.auth.signOut();
