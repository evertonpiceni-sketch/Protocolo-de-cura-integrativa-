// Authentication heritage guard.
// Legacy browser storage may keep old account/profile state alive even after the
// server session is gone. Authentication must come exclusively from the server.

const LEGACY_AUTH_KEYS = new Set([
  'cura_integrada_logged_in_user_v1',
  'cura_integrada_accounts_v1',
  'cura_integrada_login',
  'cura_accounts',
]);

const isLegacyAuthKey = (key: string | null): boolean => Boolean(key && LEGACY_AUTH_KEYS.has(key));

if (typeof window !== 'undefined') {
  try {
    LEGACY_AUTH_KEYS.forEach((key) => {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    });

    const storagePrototype = Storage.prototype;
    const nativeGetItem = storagePrototype.getItem;
    const nativeSetItem = storagePrototype.setItem;
    const nativeRemoveItem = storagePrototype.removeItem;

    const marker = '__curaAuthLegacyStorageGuardInstalled';
    const guardedWindow = window as typeof window & Record<string, unknown>;

    if (!guardedWindow[marker]) {
      guardedWindow[marker] = true;

      storagePrototype.getItem = function (key: string): string | null {
        if ((this === window.localStorage || this === window.sessionStorage) && isLegacyAuthKey(key)) {
          return null;
        }
        return nativeGetItem.call(this, key);
      };

      storagePrototype.setItem = function (key: string, value: string): void {
        if ((this === window.localStorage || this === window.sessionStorage) && isLegacyAuthKey(key)) {
          nativeRemoveItem.call(this, key);
          return;
        }
        nativeSetItem.call(this, key, value);
      };
    }
  } catch (error) {
    console.warn('Legacy authentication storage guard could not be fully installed.', error);
  }
}

export {};
