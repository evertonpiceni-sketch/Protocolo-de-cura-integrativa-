const AUTH_ME_PATH = '/api/auth/me';
const AUTH_STARTUP_TIMEOUT_MS = 6000;

const isAuthMeRequest = (input: RequestInfo | URL): boolean => {
  try {
    if (typeof input === 'string') return new URL(input, window.location.origin).pathname === AUTH_ME_PATH;
    if (input instanceof URL) return input.pathname === AUTH_ME_PATH;
    return new URL(input.url, window.location.origin).pathname === AUTH_ME_PATH;
  } catch {
    return false;
  }
};

const fallbackResponse = () => new Response('{}', {
  status: 401,
  statusText: 'Authentication temporarily unavailable',
  headers: { 'Content-Type': 'application/json' },
});

if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
  const marker = '__curaAuthStartupResilienceInstalled';
  const patchedWindow = window as typeof window & Record<string, unknown>;

  if (!patchedWindow[marker]) {
    patchedWindow[marker] = true;
    const nativeFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      if (!isAuthMeRequest(input)) return nativeFetch(input, init);

      const controller = new AbortController();
      const inheritedSignal = init?.signal;
      const abortFromParent = () => controller.abort();
      inheritedSignal?.addEventListener('abort', abortFromParent, { once: true });

      let timeoutId = 0;
      const timeoutPromise = new Promise<Response>((resolve) => {
        timeoutId = window.setTimeout(() => {
          controller.abort();
          console.warn('Auth startup hard timeout activated');
          resolve(fallbackResponse());
        }, AUTH_STARTUP_TIMEOUT_MS);
      });

      /*
       * The deadline must cover BOTH receipt of the response headers and
       * consumption of its body. Previously the timeout ended as soon as fetch()
       * returned a Response; if res.json() then stalled, App.tsx never reached
       * its finally block and the opening screen stayed forever.
       */
      const completedResponsePromise = nativeFetch(input, { ...init, signal: controller.signal })
        .then(async (response) => {
          const body = await response.text();
          return new Response(body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          });
        })
        .catch((error) => {
          console.warn('Auth startup fallback activated', error);
          return fallbackResponse();
        });

      try {
        return await Promise.race([completedResponsePromise, timeoutPromise]);
      } finally {
        window.clearTimeout(timeoutId);
        inheritedSignal?.removeEventListener('abort', abortFromParent);
      }
    };
  }
}

export {};
