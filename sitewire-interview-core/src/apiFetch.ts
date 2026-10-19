import { wait } from './wait.ts';

const API_BASE_URL = 'https://fake-users-api.vercel.app';

// Delay before each attempt; the first attempt goes out immediately.
const BACKOFF_MS = [0, 500, 1000, 2000, 4000];

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
    return await fetch(url);
  } finally {
    releaseSlot();
  }
}

export async function apiFetch<T>(path: string): Promise<T> {
  for (const [index, delay] of BACKOFF_MS.entries()) {
    await wait(delay);
    const response = await limitedFetch(`${API_BASE_URL}${path}`);
    console.debug(
      `[apiFetch] GET ${path} -> ${response.status} (attempt ${index + 1}/${BACKOFF_MS.length})`,
    );

    if (response.status === 500) {
      continue;
    } else if (!response.ok) {
      throw new Error(`GET ${path} failed with ${response.status}`);
    } else {
      // Unchecked cast: we trust the API to return the documented shape.
      return (await response.json()) as T;
    }
  }

  throw new Error(`GET ${path} failed after ${BACKOFF_MS.length} attempts`);
}
