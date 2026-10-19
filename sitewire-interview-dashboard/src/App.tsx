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
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </>
  )
}

export default App
