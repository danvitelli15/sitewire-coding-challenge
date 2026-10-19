import type { User } from 'sitewire-interview-core';
import LastLoginCells from './LastLoginCells.tsx';
import './UserCard.css';

type UserCardProps = {
  user: User;
  isSelected: boolean;
  onSelect: (user: User) => void;
};

function UserCard({ user, isSelected, onSelect }: UserCardProps) {
  return (
    <tr className={isSelected ? 'user-card--selected' : undefined}>
      <td className="user-card__id">#{user.id}</td>
      <td className="user-card__name">
        <button
          type="button"
          className="user-card__select"
          aria-pressed={isSelected}
          onClick={() => onSelect(user)}
        >
          {user.first_name} {user.last_name}
        </button>
      </td>
      <td>{user.email}</td>
      <LastLoginCells userId={user.id} />
    </tr>
  );
}

export default UserCard;
