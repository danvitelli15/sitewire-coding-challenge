import { queryOptions } from '@tanstack/react-query';
import { fetchUserLogins, fetchUsers } from 'sitewire-interview-core';

export const usersQuery = queryOptions({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

// Shared by the table rows and the details panel so both read the same cache entry.
export function userLoginsQuery(userId: number) {
  return queryOptions({
    queryKey: ['logins', userId],
    queryFn: () => fetchUserLogins(userId),
  });
}
