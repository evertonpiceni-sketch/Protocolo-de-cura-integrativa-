export type PendingProfilePatch = Record<string, unknown>;

export interface PendingProfileSyncRecord {
  login: string;
  profilePatch: PendingProfilePatch;
  savedAt: number;
}

export interface PendingProfileStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const STORAGE_PREFIX = 'cura_integrada_pending_profile_sync_v1:';

function normalizeLogin(login: string): string {
  return login.trim().toLowerCase();
}

function storageKey(login: string): string {
  return `${STORAGE_PREFIX}${encodeURIComponent(normalizeLogin(login))}`;
}

export function createPendingProfileSyncStore(storage: PendingProfileStorage) {
  return {
    save(login: string, profilePatch: PendingProfilePatch): boolean {
      const normalizedLogin = normalizeLogin(login);
      if (!normalizedLogin || !profilePatch || Object.keys(profilePatch).length === 0) return false;
      try {
        const record: PendingProfileSyncRecord = {
          login: normalizedLogin,
          profilePatch,
          savedAt: Date.now()
        };
        storage.setItem(storageKey(normalizedLogin), JSON.stringify(record));
        return true;
      } catch {
        return false;
      }
    },

    read(login: string): PendingProfileSyncRecord | null {
      const normalizedLogin = normalizeLogin(login);
      if (!normalizedLogin) return null;
      try {
        const raw = storage.getItem(storageKey(normalizedLogin));
        if (!raw) return null;
        const value = JSON.parse(raw) as Partial<PendingProfileSyncRecord>;
        if (
          value.login !== normalizedLogin ||
          !value.profilePatch ||
          typeof value.profilePatch !== 'object' ||
          Array.isArray(value.profilePatch)
        ) return null;
        return {
          login: normalizedLogin,
          profilePatch: value.profilePatch as PendingProfilePatch,
          savedAt: typeof value.savedAt === 'number' ? value.savedAt : 0
        };
      } catch {
        return null;
      }
    },

    clear(login: string): void {
      const normalizedLogin = normalizeLogin(login);
      if (!normalizedLogin) return;
      try {
        storage.removeItem(storageKey(normalizedLogin));
      } catch {
        // Storage may be unavailable in private or restricted browser contexts.
      }
    }
  };
}

function browserStore() {
  if (typeof window === 'undefined') return null;
  try {
    return createPendingProfileSyncStore(window.localStorage);
  } catch {
    return null;
  }
}

export function queuePendingProfileSync(login: string, profilePatch: PendingProfilePatch): boolean {
  return browserStore()?.save(login, profilePatch) ?? false;
}

export function readPendingProfileSync(login: string): PendingProfileSyncRecord | null {
  return browserStore()?.read(login) ?? null;
}

export function clearPendingProfileSync(login: string): void {
  browserStore()?.clear(login);
}
