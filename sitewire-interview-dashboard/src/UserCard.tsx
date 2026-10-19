import type { User } from 'sitewire-interview-core'
import './UserCard.css'

function UserCard({ user }: { user: User }) {
  return (
    <div className="user-card">
      <span className="user-card__id">#{user.id}</span>
      <span className="user-card__name">
        {user.first_name} {user.last_name}
      </span>
      <span>{user.email}</span>
    </div>
  )
}

export default UserCard
