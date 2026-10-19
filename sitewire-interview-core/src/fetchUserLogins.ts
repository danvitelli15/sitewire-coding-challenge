import { API_BASE_URL } from './apiBaseUrl.ts'
import type { UserLogins } from './types/UserLogins.ts'

export async function fetchUserLogins(userId: number): Promise<UserLogins> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/relationships/logins`)
  return response.json()
}
