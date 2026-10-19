import { useEffect, useState } from 'react'
import { fetchUserLogins, fetchUsers, type User, type UserLogins } from 'sitewire-interview-core'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [userLogins, setUserLogins] = useState<UserLogins[]>([])

  useEffect(() => {
    fetchUsers().then(setUsers)
    fetchUserLogins(1).then((logins) => setUserLogins([logins]))
  }, [])

  return (
    <>
      <h1>Hello, world</h1>
      <div>{JSON.stringify(users)}</div>
      <div>{JSON.stringify(userLogins)}</div>
    </>
  )
}

export default App
