import { apiFetch } from './apiFetch.ts';
import type { ApiUserLogins } from './types/ApiUserLogins.ts';
import type { Login } from './types/Login.ts';
import type { UserLogins } from './types/UserLogins.ts';

export async function fetchUserLogins(userId: number): Promise<UserLogins> {
  const response = await apiFetch<ApiUserLogins>(
    `/users/${userId}/relationships/logins`,
  );

  const logins: Login[] = response.logins
    .map((login) => ({
      login_time: new Date(login.login_time),
      ip_v4: login.ip_v4,
    }))
    .sort((a, b) => b.login_time.getTime() - a.login_time.getTime());

  return {
    user_id: response.user_id,
    logins,
    last_login: logins[0] ?? null,
  };
}
