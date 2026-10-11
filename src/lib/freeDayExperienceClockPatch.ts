const CURRENT_LOGIN_KEY = 'cura_integrada_logged_in_user_v1';
const ACCOUNTS_KEY = 'cura_integrada_accounts_v1';
const COMMERCIAL_PLANS = new Set(['jornada_7d', 'semanal', 'mensal', 'trimestral', 'semestral', 'anual']);

let syncing = false;
let completedForSession = false;

function updateLocalStartedAt(startedAt: string) {
  try {
    const login = localStorage.getItem(CURRENT_LOGIN_KEY);
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!login || !raw) return;
    const accounts = JSON.parse(raw);
    if (!Array.isArray(accounts)) return;
    const index = accounts.findIndex((item: any) => item?.login === login || item?.profile?.login === login);
    if (index < 0) return;
    accounts[index] = {
      ...accounts[index],
      profile: { ...accounts[index].profile, startedAt },
    };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    // Remote state remains authoritative.
  }
}

async function ensureExperienceClock() {
  if (syncing || completedForSession) return;
  syncing = true;
  try {
    const response = await fetch('/api/auth/me', { credentials: 'same-origin' });
    if (!response.ok) return;
    const data = await response.json().catch(() => null);
    const profile = data?.user?.profile;
    if (!profile) return;

    if (profile.startedAt || COMMERCIAL_PLANS.has(profile.subscriptionPlan || '')) {
      completedForSession = true;
      return;
    }

    const startedAt = new Date().toISOString();
    const nextProfile = { ...profile, startedAt };
    updateLocalStartedAt(startedAt);

    const sync = await fetch('/api/user/sync', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: nextProfile, progress: data?.user?.progress || [] }),
    });

    if (sync.ok) {
      completedForSession = true;
      window.dispatchEvent(new StorageEvent('storage', { key: ACCOUNTS_KEY }));
    }
  } catch {
    // The auth resilience layer will retry naturally on the next focus/navigation.
  } finally {
    syncing = false;
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const run = () => void ensureExperienceClock();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
  window.addEventListener('focus', () => {
    completedForSession = false;
    run();
  });
  new MutationObserver(() => {
    if (document.querySelector('.ns-app, #profile-setup-view')) run();
  }).observe(document.documentElement, { childList: true, subtree: true });
}

export {};
