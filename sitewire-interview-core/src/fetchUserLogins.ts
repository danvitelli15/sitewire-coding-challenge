import { apiFetch } from './apiFetch.ts'
import type { UserLogins } from './types/UserLogins.ts'

export async function fetchUserLogins(userId: number): Promise<UserLogins> {
  return apiFetch<UserLogins>(`/users/${userId}/relationships/logins`)
}
