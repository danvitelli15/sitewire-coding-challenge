import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { User } from 'sitewire-interview-core';
import { userLoginsQuery } from './queries.ts';
import './UserCard.css';

type UserCardProps = {
  user: User;
  isSelected: boolean;
  onSelect: (user: User) => void;
};

function UserCard({ user, isSelected, onSelect }: UserCardProps) {
  const {
    data: userLogins,
    isPending,
    isError,
  } = useQuery(userLoginsQuery(user.id));

  let loginCells: ReactNode;
  if (isPending) {
    loginCells = <td colSpan={2}>Loading…</td>;
  } else if (isError) {
    loginCells = (
      <td colSpan={2} className="user-card__error">
        Failed to load
      </td>
    );
  } else if (userLogins.last_login === null) {
    loginCells = <td colSpan={2}>Never</td>;
  } else {
    loginCells = (
      <>
        <td>{userLogins.last_login.login_time.toLocaleString()}</td>
        <td>{userLogins.last_login.ip_v4}</td>
      </>
    );
  }

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
      {loginCells}
    </tr>
  );
}

export default UserCard;
