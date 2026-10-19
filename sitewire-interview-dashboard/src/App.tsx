import { useEffect, useState } from 'react'

const API_BASE_URL = 'https://fake-users-api.vercel.app'

type User = {
  id: number
  first_name: string
  last_name: string
  email: string
}

type UserLogins = {
  user_id: number
  logins: { login_time: string; ip_v4: string }[]
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`)
  return response.json()
}

async function fetchUserLogins(userId: number): Promise<UserLogins> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/relationships/logins`)
  return response.json()
}

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
