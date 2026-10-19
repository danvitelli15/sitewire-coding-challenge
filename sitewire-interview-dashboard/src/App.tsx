import { useEffect, useState } from 'react'
import { fetchUsers, type User } from 'sitewire-interview-core'
import UserCard from './UserCard.tsx'

function App() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetchUsers().then(setUsers)
  }, [])

  return (
    <>
      <h1>Login Dashboard</h1>
      <p>Total users: {users.length}</p>
      <table className="user-table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </>
  )
}

export default App
