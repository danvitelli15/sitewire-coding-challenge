import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { User } from 'sitewire-interview-core';
import { userLoginsQuery } from './queries.ts';
import './UserDetailsPanel.css';

function UserDetailsPanel({ user }: { user: User | null }) {
  return (
    <aside className="user-details" aria-label="User details">
      {user === null ? (
        <p className="user-details__empty">Select a user</p>
      ) : (
        <UserDetails user={user} />
      )}
    </aside>
  );
}

function UserDetails({ user }: { user: User }) {
  const {
    data: userLogins,
    isPending,
    isError,
  } = useQuery(userLoginsQuery(user.id));

  let logins: ReactNode;
  if (isPending) {
    logins = <p>Loading…</p>;
  } else if (isError) {
    logins = <p className="user-details__error">Failed to load logins</p>;
  } else if (userLogins.logins.length === 0) {
    logins = <p>Never logged in</p>;
  } else {
    logins = (
      <table className="user-details__logins">
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">IP</th>
          </tr>
        </thead>
        <tbody>
          {userLogins.logins.map((login) => (
            <tr key={login.login_time.getTime()}>
              <td>{login.login_time.toLocaleString()}</td>
              <td>{login.ip_v4}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <>
      <h2>
        #{user.id} {user.first_name} {user.last_name}
      </h2>
      <p>{user.email}</p>
      <h3>Logins</h3>
      {logins}
    </>
  );
}

export default UserDetailsPanel;
