export type UserLogins = {
  user_id: number;
  logins: { login_time: string; ip_v4: string }[];
};
