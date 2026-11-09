import { getCurrentAccountLogin, normalizeAccountLogin } from './authSession';

export type UserSyncPayload = {
  profile?: unknown;
  progress?: unknown;
};

export type UserSyncOptions = {
  fetcher?: typeof fetch;
  wait?: (milliseconds: number) => Promise<void>;
  maxAttempts?: number;
  /** Account identity captured when the change is queued. */
  accountKey?: string;
  /** Reads the identity represented by the browser's current auth session. */
  getCurrentAccountKey?: () => string | null;
  /** Browser writes fail closed when no account identity can be established. */
  requireAccountKey?: boolean;
};

const RETRYABLE_STATUSES = new Set([409, 423, 429, 500, 502, 503, 504]);
const DEFAULT_MAX_ATTEMPTS = 24;
const MAX_RETRY_AFTER_WAIT_MS = 5000;
const syncQueues = new Map<string, Promise<void>>();
const UNSCOPED_QUEUE_KEY = '__unscoped__';

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

function assertAccountStillCurrent(
  expectedAccountKey: string | null,
  getCurrentAccountKey: () => string | null,
  requireAccountKey: boolean,
) {
  if (!expectedAccountKey) {
    if (requireAccountKey) {
      throw new Error('User sync cancelled: the active account could not be identified.');
    }
    return;
  }

  const currentAccountKey = normalizeAccountLogin(getCurrentAccountKey());
  if (currentAccountKey !== expectedAccountKey) {
    throw new Error('User sync cancelled because the active account changed.');
  }
}

async function performUserSync(
  body: string,
  options: UserSyncOptions,
  expectedAccountKey: string | null,
  getCurrentAccountKey: () => string | null,
  requireAccountKey: boolean,
): Promise<Response> {
  const fetcher = options.fetcher ?? fetch;
  const wait = options.wait ?? defaultWait;
  const maxAttempts = Math.max(1, options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS);

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    assertAccountStillCurrent(expectedAccountKey, getCurrentAccountKey, requireAccountKey);

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

    // A request already dispatched belongs to the cookie it was sent with.
    // Do not treat it as the current session's success after an account switch.
    assertAccountStillCurrent(expectedAccountKey, getCurrentAccountKey, requireAccountKey);

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

/**
 * Persist profile/progress changes with bounded retry for transient database
 * and network failures. Writes are serialized per account so a delayed retry
 * cannot overwrite a newer diary or session snapshot. Each retry is also bound
 * to the account that initiated it; changing accounts cancels the old request.
 */
export function syncUserState(payload: UserSyncPayload, options: UserSyncOptions = {}): Promise<Response> {
  if (!payload || (!Object.prototype.hasOwnProperty.call(payload, 'profile') && !Object.prototype.hasOwnProperty.call(payload, 'progress'))) {
    return Promise.reject(new Error('A profile or progress payload is required for user sync.'));
  }

  const getCurrentAccountKey = options.getCurrentAccountKey ?? getCurrentAccountLogin;
  let currentAtStart: string | null = null;
  try {
    currentAtStart = normalizeAccountLogin(
      options.accountKey !== undefined ? options.accountKey : getCurrentAccountKey(),
    );
  } catch {
    currentAtStart = null;
  }
  const requireAccountKey = options.requireAccountKey ?? typeof window !== 'undefined';
  if (requireAccountKey && !currentAtStart) {
    return Promise.reject(new Error('User sync cancelled: the active account could not be identified.'));
  }

  // Snapshot the payload at call time. The per-account queue preserves invocation
  // order, allowing the latest save to reach the server after an older retry.
  const body = JSON.stringify(payload);
  const queueKey = currentAtStart ? `account:${currentAtStart}` : UNSCOPED_QUEUE_KEY;
  const previous = syncQueues.get(queueKey) ?? Promise.resolve();
  const operation = previous
    .catch(() => undefined)
    .then(() => performUserSync(body, options, currentAtStart, getCurrentAccountKey, requireAccountKey));
  const settled = operation.then(() => undefined, () => undefined);
  syncQueues.set(queueKey, settled);
  void settled.finally(() => {
    if (syncQueues.get(queueKey) === settled) syncQueues.delete(queueKey);
  });

  return operation;
}
