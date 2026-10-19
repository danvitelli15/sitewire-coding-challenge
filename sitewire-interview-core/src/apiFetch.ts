import { wait } from './wait.ts';

const API_BASE_URL = 'https://fake-users-api.vercel.app';

// Delay before each attempt; the first attempt goes out immediately.
const BACKOFF_MS = [0, 500, 1000, 2000, 4000];

export async function apiFetch<T>(path: string): Promise<T> {
  for (const [index, delay] of BACKOFF_MS.entries()) {
    await wait(delay);
    const response = await fetch(`${API_BASE_URL}${path}`);
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
