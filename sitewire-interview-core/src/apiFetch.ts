import { wait } from './wait.ts';

const API_BASE_URL = 'https://fake-users-api.vercel.app';

// Delay before each attempt; the first attempt goes out immediately.
const BACKOFF_MS = [0, 500, 1000, 2000, 4000];

// Per-attempt timeout. The API's documented worst case is ~3s; this is generous on purpose.
const REQUEST_TIMEOUT_MS = 10_000;

// Concurrency limit shared by every caller in the process (module scope acts as a singleton).
// A slot is held only for the network request itself, not across backoff waits, so a retrying
// request gives up its slot while it waits and rejoins the back of the queue.
//
// Possible future improvements, out of scope for this project:
// - Priority: let urgent requests (e.g. the user selected in the details panel, or rows
//   currently on screen) jump the queue instead of waiting behind every earlier request.
// - Fetch only what's visible: request logins only for rows in view (virtualized/lazy rows).
//   That reduces total requests rather than pacing them, and complements this limiter.
const MAX_ACTIVE_REQUESTS = 50;
let activeRequests = 0;
const waitingForSlot: (() => void)[] = [];

function acquireSlot(): Promise<void> {
  if (activeRequests < MAX_ACTIVE_REQUESTS) {
    activeRequests++;
    return Promise.resolve();
  } else {
    return new Promise((resolve) => waitingForSlot.push(resolve));
  }
}

function releaseSlot(): void {
  const next = waitingForSlot.shift();
  if (next) {
    // Hand the slot straight to the next waiter; the active count stays the same.
    next();
  } else {
    activeRequests--;
  }
}

async function limitedFetch(url: string): Promise<Response> {
  await acquireSlot();
  try {
    // The timeout is created after acquiring a slot so time spent queued doesn't count against it.
    // Note: the signal also covers reading the body, so response.json() could technically time out
    // after an OK status and that error wouldn't be retried. Bodies here are tiny, so we accept it.
    return await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } finally {
    releaseSlot();
  }
}

export async function apiFetch<T>(path: string): Promise<T> {
  let lastFailure = '';

  for (const [index, delay] of BACKOFF_MS.entries()) {
    await wait(delay);
    const attemptLabel = `(attempt ${index + 1}/${BACKOFF_MS.length})`;

    let response: Response;
    try {
      response = await limitedFetch(`${API_BASE_URL}${path}`);
    } catch (error) {
      // Timeouts and network errors (DNS, connection reset, ...) are retried like a 500.
      lastFailure =
        error instanceof Error
          ? `${error.name}: ${error.message}`
          : String(error);
      console.debug(`[apiFetch] GET ${path} -> ${lastFailure} ${attemptLabel}`);
      continue;
    }
    console.debug(
      `[apiFetch] GET ${path} -> ${response.status} ${attemptLabel}`,
    );

    if (response.status === 500) {
      lastFailure = String(response.status);
      continue;
    } else if (!response.ok) {
      throw new Error(`GET ${path} failed with ${response.status}`);
    } else {
      // Unchecked cast: we trust the API to return the documented shape.
      return (await response.json()) as T;
    }
  }

  throw new Error(
    `GET ${path} failed after ${BACKOFF_MS.length} attempts (last: ${lastFailure})`,
  );
}
