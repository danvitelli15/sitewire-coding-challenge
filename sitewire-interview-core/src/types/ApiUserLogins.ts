// Raw response shape of GET /users/:id/relationships/logins, before parsing.
export type ApiUserLogins = {
  user_id: number;
  logins: { login_time: string; ip_v4: string }[];
};
