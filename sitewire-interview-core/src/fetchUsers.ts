import { apiFetch } from './apiFetch.ts';
import type { User } from './types/User.ts';

export async function fetchUsers(): Promise<User[]> {
  return apiFetch<User[]>('/users');
}
