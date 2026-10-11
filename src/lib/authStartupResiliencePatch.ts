const AUTH_ME_PATH = '/api/auth/me';
const AUTH_STARTUP_TIMEOUT_MS = 6000;

const isAuthMeRequest = (input: RequestInfo | URL): boolean => {
  try {
    if (typeof input === 'string') {
      return new URL(input, window.location.origin).pathname === AUTH_ME_PATH;
    }
    if (input instanceof URL) {
      return input.pathname === AUTH_ME_PATH;
    }
    return new URL(input.url, window.location.origin).pathname === AUTH_ME_PATH;
  } catch {
    return false;
  }
};

if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
  const marker = '__curaAuthStartupResilienceInstalled';
  const patchedWindow = window as typeof window & Record<string, unknown>;

  if (!patchedWindow[marker]) {
    patchedWindow[marker] = true;
    const nativeFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      if (!isAuthMeRequest(input)) {
        return nativeFetch(input, init);
      }

      const controller = new AbortController();
      const inheritedSignal = init?.signal;
      const abortFromParent = () => controller.abort();
      inheritedSignal?.addEventListener('abort', abortFromParent, { once: true });

      const timeoutId = window.setTimeout(() => controller.abort(), AUTH_STARTUP_TIMEOUT_MS);

      try {
        return await nativeFetch(input, { ...init, signal: controller.signal });
      } catch (error) {
        // Authentication must never keep the app on the opening/loading screen forever.
        // Returning 401 intentionally activates App.tsx's existing local-session fallback.
        console.warn('Auth startup fallback activated', error);
        return new Response('{}', {
          status: 401,
          statusText: 'Authentication temporarily unavailable',
          headers: { 'Content-Type': 'application/json' },
        });
      } finally {
        window.clearTimeout(timeoutId);
        inheritedSignal?.removeEventListener('abort', abortFromParent);
      }
    };
  }
}

export {};
