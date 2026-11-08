export type UserSyncPayload = {
  profile?: unknown;
  progress?: unknown;
};

export type UserSyncOptions = {
  fetcher?: typeof fetch;
  wait?: (milliseconds: number) => Promise<void>;
  maxAttempts?: number;
};

const RETRYABLE_STATUSES = new Set([409, 423, 429, 500, 502, 503, 504]);
// The shared DB lock may remain held through the provider's 15s timeout; keep sync pending well beyond that window.
const DEFAULT_MAX_ATTEMPTS = 24;
const MAX_RETRY_AFTER_WAIT_MS = 5000;

function defaultWait(milliseconds: number) {
  return new Promise<void>(resolve => setTimeout(resolve, milliseconds));
}

function retryDelay(response: undefined, attempt: number): number;
function retryDelay(response: Response, attempt: number): number | null;
function retryDelay(response: Response | undefined, attempt: number): number | null {
  const backoff = Math.min(MAX_RETRY_AFTER_WAIT_MS, 300 * (2 ** (attempt - 1)));
  const retryAfter = response?.headers.get('Retry-After')?.trim();
  if (!retryAfter) return backoff;

  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds) && seconds >= 0) {
    const requestedDelay = seconds * 1000;
    return requestedDelay > MAX_RETRY_AFTER_WAIT_MS ? null : Math.max(backoff, requestedDelay);
  }

  const dateDelay = Date.parse(retryAfter) - Date.now();
  if (Number.isFinite(dateDelay) && dateDelay > MAX_RETRY_AFTER_WAIT_MS) return null;
  if (Number.isFinite(dateDelay) && dateDelay > 0) return Math.max(backoff, dateDelay);
  return backoff;
}

/**
 * Persist profile/progress changes with bounded retry for the shared database
 * write lock. Callers may send only the field they changed so concurrent
 * profile and progress updates cannot overwrite one another with stale state.
 */
export async function syncUserState(payload: UserSyncPayload, options: UserSyncOptions = {}): Promise<Response> {
  if (!payload || (!Object.prototype.hasOwnProperty.call(payload, 'profile') && !Object.prototype.hasOwnProperty.call(payload, 'progress'))) {
    throw new Error('A profile or progress payload is required for user sync.');
  }

  const fetcher = options.fetcher ?? fetch;
  const wait = options.wait ?? defaultWait;
  const maxAttempts = Math.max(1, options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS);
  const body = JSON.stringify(payload);

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    let response: Response | undefined;
    try {
      response = await fetcher('/api/user/sync', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
    } catch (error) {
      if (attempt >= maxAttempts) throw error;
      await wait(retryDelay(undefined, attempt));
      continue;
    }

    if (response.ok) return response;
    if (!RETRYABLE_STATUSES.has(response.status) || attempt >= maxAttempts) {
      throw new Error(`User sync failed (HTTP ${response.status}) after ${attempt} attempt(s).`);
    }
    const delay = retryDelay(response, attempt);
    if (delay === null) {
      throw new Error(`User sync deferred after HTTP ${response.status}: Retry-After exceeds the ${MAX_RETRY_AFTER_WAIT_MS}ms retry window.`);
    }
    await wait(delay);
  }

  throw new Error('User sync could not be completed.');
}
