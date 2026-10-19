const API_BASE_URL = 'https://fake-users-api.vercel.app'

export async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`)
  return response.json()
}
