import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from 'sitewire-interview-core';
import UserCard from './UserCard.tsx';

function App() {
  const { data: users = [], isPending } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <>
      <h1>Login Dashboard</h1>
      {isPending ? (
        <p>Loading…</p>
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
                <UserCard key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

export default App;
