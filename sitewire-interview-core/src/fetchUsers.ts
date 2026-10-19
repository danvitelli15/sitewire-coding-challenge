import { API_BASE_URL } from './apiBaseUrl.ts'
import type { User } from './types/User.ts'

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`)
  return response.json()
}
