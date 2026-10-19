import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserLogins, type User } from 'sitewire-interview-core';
import './UserCard.css';

function UserCard({ user }: { user: User }) {
  const {
    data: userLogins,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['logins', user.id],
    queryFn: () => fetchUserLogins(user.id),
  });

  let loginCells: ReactNode;
  if (isPending) {
    loginCells = <td colSpan={2}>Loading…</td>;
  } else if (isError) {
    loginCells = (
      <td colSpan={2} className="user-card__error">
        Failed to load
      </td>
    );
  } else if (userLogins.last_login === null) {
    loginCells = <td colSpan={2}>Never</td>;
  } else {
    loginCells = (
      <>
        <td>{userLogins.last_login.login_time.toLocaleString()}</td>
        <td>{userLogins.last_login.ip_v4}</td>
      </>
    );
  }

  return (
    <tr>
      <td className="user-card__id">#{user.id}</td>
      <td className="user-card__name">
        {user.first_name} {user.last_name}
      </td>
      <td>{user.email}</td>
      {loginCells}
    </tr>
  );
}

export default UserCard;
