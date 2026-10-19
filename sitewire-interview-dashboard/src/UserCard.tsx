import type { User } from 'sitewire-interview-core'
import './UserCard.css'

function UserCard({ user }: { user: User }) {
  return (
    <tr>
      <td className="user-card__id">#{user.id}</td>
      <td className="user-card__name">
        {user.first_name} {user.last_name}
      </td>
      <td>{user.email}</td>
    </tr>
  )
}

export default UserCard
