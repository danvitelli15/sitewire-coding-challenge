import type { Login } from './Login.ts';

export type UserLogins = {
  user_id: number;
  // Sorted newest first.
  logins: Login[];
  last_login: Login | null;
};
