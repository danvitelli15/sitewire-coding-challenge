import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { User } from 'sitewire-interview-core';
import { usersQuery } from './queries.ts';
import UserCard from './UserCard.tsx';
import UserDetailsPanel from './UserDetailsPanel.tsx';

function App() {
  const { data: users = [], isPending, isError } = useQuery(usersQuery);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <>
      <main>
        <h1>Login Dashboard</h1>
        {isPending ? (
          <p>Loading…</p>
        ) : isError ? (
          <div className="error-banner" role="alert">
            Unable to access user data. Loading failed after repeated retry
            attempts.
          </div>
        ) : (
          <>
            <p>Total users: {users.length}</p>
            <table className="user-table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Last Login</th>
                  <th scope="col">Last Login IP</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    isSelected={user.id === selectedUser?.id}
                    onSelect={setSelectedUser}
                  />
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
      <UserDetailsPanel user={selectedUser} />
    </>
  );
}

export default App;
