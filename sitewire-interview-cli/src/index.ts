import { parseArgs } from 'node:util';
import {
  fetchUserLogins,
  fetchUsers,
  type User,
  type UserLogins,
} from 'sitewire-interview-core';

const { values: args } = parseArgs({
  options: {
    limit: { type: 'string', default: '15' },
    all: { type: 'boolean', default: false },
    json: { type: 'boolean', default: false },
    verbose: { type: 'boolean', default: false },
  },
});

// WARNING: this is a hack, don't copy it. Replacing a global console method is bad practice:
// it silently affects every module in the process. Core's apiFetch traces each attempt with
// console.debug, which Node always prints, and this is the cheapest way to silence it (or, with
// --verbose, move it to stderr so it can't corrupt --json output on stdout) without adding a
// real logging seam to core. It's only tolerable because this tiny CLI owns its process.
console.debug = args.verbose ? console.error : () => {};

function formatLastLogin(result: PromiseSettledResult<UserLogins>): string[] {
  if (result.status === 'rejected') {
    return ['Failed to load', ''];
  } else if (result.value.last_login === null) {
    return ['Never', ''];
  } else {
    return [
      result.value.last_login.login_time.toLocaleString(),
      result.value.last_login.ip_v4,
    ];
  }
}

function printTable(rows: string[][]): void {
  const widths = rows[0].map((_, column) =>
    Math.max(...rows.map((row) => row[column].length)),
  );
  for (const row of rows) {
    console.log(
      row
        .map((cell, column) => cell.padEnd(widths[column]))
        .join('  ')
        .trimEnd(),
    );
  }
}

let users: User[];
try {
  users = await fetchUsers();
} catch {
  console.error(
    'Unable to access user data. Loading failed after repeated retry attempts.',
  );
  process.exit(1);
}

const shownUsers = args.all ? users : users.slice(0, Number(args.limit));
// Only fetch logins for the rows we're actually printing.
const loginResults = await Promise.allSettled(
  shownUsers.map((user) => fetchUserLogins(user.id)),
);

if (args.json) {
  const output = {
    total_users: users.length,
    users: shownUsers.map((user, index) => {
      const result = loginResults[index];
      return {
        ...user,
        last_login:
          result.status === 'fulfilled' ? result.value.last_login : null,
        logins_failed: result.status === 'rejected',
      };
    }),
  };
  console.log(JSON.stringify(output, null, 2));
  process.exit(0);
}

printTable([
  ['ID', 'Name', 'Email', 'Last Login', 'Last Login IP'],
  ...shownUsers.map((user, index) => [
    `#${user.id}`,
    `${user.first_name} ${user.last_name}`,
    user.email,
    ...formatLastLogin(loginResults[index]),
  ]),
]);

const remaining = users.length - shownUsers.length;
console.log();
if (remaining > 0) {
  console.log(`… ${remaining} more (${users.length} total users)`);
} else {
  console.log(`${users.length} total users`);
}
