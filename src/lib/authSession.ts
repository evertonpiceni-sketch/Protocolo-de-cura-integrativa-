export const CURRENT_LOGIN_STORAGE_KEY = 'cura_integrada_logged_in_user_v1';

export function normalizeAccountLogin(login: string | null | undefined): string | null {
  const normalized = login?.trim().toLowerCase();
  return normalized || null;
}

export function getCurrentAccountLogin(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return normalizeAccountLogin(window.localStorage.getItem(CURRENT_LOGIN_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function setCurrentAccountLogin(login: string): boolean {
  const normalized = normalizeAccountLogin(login);
  if (!normalized || typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(CURRENT_LOGIN_STORAGE_KEY, normalized);
    return true;
  } catch {
    return false;
  }
}

export function clearCurrentAccountLogin(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(CURRENT_LOGIN_STORAGE_KEY);
  } catch {
    // A restricted browser storage context must not prevent server logout.
  }
}
