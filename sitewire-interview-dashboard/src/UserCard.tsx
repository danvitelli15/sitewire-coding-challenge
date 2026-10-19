import { useQuery } from '@tanstack/react-query';
import { fetchUserLogins, type User } from 'sitewire-interview-core';
import './UserCard.css';

function UserCard({ user }: { user: User }) {
  const { data: userLogins, isPending } = useQuery({
    queryKey: ['logins', user.id],
    queryFn: () => fetchUserLogins(user.id),
  });

  const lastLogin = userLogins?.last_login;

  return (
    <tr>
      <td className="user-card__id">#{user.id}</td>
      <td className="user-card__name">
        {user.first_name} {user.last_name}
      </td>
      <td>{user.email}</td>
      {isPending ? (
        <td colSpan={2}>Loading…</td>
      ) : (
        <>
          <td>{lastLogin?.login_time.toLocaleString()}</td>
          <td>{lastLogin?.ip_v4}</td>
        </>
      )}
    </tr>
  );
}

export default UserCard;
