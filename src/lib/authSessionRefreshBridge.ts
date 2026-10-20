// Keeps the React authentication guard synchronized with the server cookie.
// App.tsx currently establishes isLoggedIn during its startup /api/auth/me check.
// After a successful login/register, refresh once so the authenticated server
// session becomes the canonical application state before any checkout action.

const AUTH_PATHS = new Map([
  ['/api/auth/login', 1150],
  ['/api/auth/register', 1750],
]);

function pathnameOf(input: RequestInfo | URL): string {
  try {
    if (typeof input === 'string') return new URL(input, window.location.origin).pathname;
    if (input instanceof URL) return input.pathname;
    return new URL(input.url, window.location.origin).pathname;
  } catch {
    return '';
  }
}

if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
  const marker = '__curaAuthSessionRefreshBridgeInstalled';
  const patchedWindow = window as typeof window & Record<string, unknown>;

  if (!patchedWindow[marker]) {
    patchedWindow[marker] = true;
    const previousFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const response = await previousFetch(input, init);
      const path = pathnameOf(input);
      const delay = AUTH_PATHS.get(path);
      const method = String(init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();

      if (delay && method === 'POST' && response.ok) {
        window.setTimeout(() => window.location.reload(), delay);
      }
      return response;
    };
  }
}

export {};
