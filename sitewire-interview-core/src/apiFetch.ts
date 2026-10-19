import { wait } from './wait.ts';

const API_BASE_URL = 'https://fake-users-api.vercel.app';

// Delay before each attempt; the first attempt goes out immediately.
const BACKOFF_MS = [0, 500, 1000, 2000, 4000];

export async function apiFetch<T>(path: string): Promise<T> {
  let attempt = 0;
  let response: Response;

  do {
    await wait(BACKOFF_MS[attempt]);
    response = await fetch(`${API_BASE_URL}${path}`);
    attempt++;
    console.debug(
      `[apiFetch] GET ${path} -> ${response.status} (attempt ${attempt}/${BACKOFF_MS.length})`,
    );
  } while (response.status === 500 && attempt < BACKOFF_MS.length);

  if (!response.ok) {
    throw new Error(
      `GET ${path} failed with ${response.status} after ${attempt} attempts`,
    );
  }

  return response.json();
}
