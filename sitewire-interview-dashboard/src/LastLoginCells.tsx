import { useQuery } from '@tanstack/react-query';
import { userLoginsQuery } from './queries.ts';
import './LastLoginCells.css';

function isOlderThanOneMonth(date: Date): boolean {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return date < oneMonthAgo;
}

function LastLoginCells({ userId }: { userId: number }) {
  const {
    data: userLogins,
    isPending,
    isError,
  } = useQuery(userLoginsQuery(userId));

  if (isPending) {
    return <td colSpan={2}>Loading…</td>;
  } else if (isError) {
    return (
      <td colSpan={2} className="last-login__error">
        Failed to load
      </td>
    );
  } else if (userLogins.last_login === null) {
    return <td colSpan={2}>Never</td>;
  } else {
    return (
      <>
        <td>
          {userLogins.last_login.login_time.toLocaleString()}
          {isOlderThanOneMonth(userLogins.last_login.login_time) && (
            <span
              className="last-login__inactive"
              role="img"
              aria-label="No login in over a month"
              title="No login in over a month"
            />
          )}
        </td>
        <td>{userLogins.last_login.ip_v4}</td>
      </>
    );
  }
}

export default LastLoginCells;
