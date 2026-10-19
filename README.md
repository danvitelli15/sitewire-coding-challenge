# sitewire-interview

Solution to the [Sitewire coding challenge](https://github.com/sitewireco/sitewire-coding-challenge/blob/main/README.md): list every user from the Fake Users API alongside their most recent login, while the API randomly fails (~25% of requests return 500) and randomly slows down (up to ~3s).

There are two front ends over one shared data layer: a React dashboard and a small CLI.

## Running it

Requires Node 22.18+ (for native TypeScript type stripping; developed on Node 26) and pnpm 11.

```sh
pnpm install

pnpm dev                    # dashboard at http://localhost:5173
pnpm cli                    # first 15 users as a table
pnpm cli --limit 50         # first 50 users
pnpm cli --all              # every user (takes about a minute)
pnpm cli --json --all       # machine-readable output, e.g. to pipe into jq
pnpm cli --verbose          # also trace every request attempt (to stderr)
```

Other root scripts: `pnpm build`, `pnpm lint`, `pnpm format`.

## Layout

A pnpm workspace with three packages:

- **`sitewire-interview-core`** owns all of the data logic: the API calls, retries, timeouts, concurrency limiting, and parsing into clean types. It's framework-agnostic and ships as raw TypeScript with no build step.
- **`sitewire-interview-dashboard`** is a Vite + React app. It uses TanStack React Query for request state, with a table of users and a side panel showing the selected user's full login history.
- **`sitewire-interview-cli`** is a deliberately thin Node CLI over the same core functions. It exists to show that core works outside React, not to match the dashboard feature for feature.

## How it handles the unreliable API

Every request goes through a single `apiFetch` function in core (`sitewire-interview-core/src/apiFetch.ts`), so both front ends get the same behavior:

- **Retries with backoff.** Up to 5 attempts, waiting `0, 500ms, 1s, 2s, 4s` before each one. 500s, network errors, and timeouts are retried. Other error statuses fail immediately.
- **Timeouts.** Each attempt is aborted after 10s.
- **Concurrency limit.** At most 50 requests are in flight at once. Showing every user's last login takes one request per user (1,000), so this keeps them from all firing at once. A request only holds a slot while it's actually on the network, not while it waits to retry.
- **Parsed data.** Login times become `Date`s, logins are sorted newest first, and each user gets an explicit `last_login` that is `null` if they've never logged in.

In the dashboard, every state is shown explicitly rather than looking like empty data:

| Situation                                | What you see                         |
| ---------------------------------------- | ------------------------------------ |
| User list loading                        | "Loading…"                           |
| User list failed after all retries       | Error banner in place of the table   |
| A user's logins loading                  | "Loading…" in that row's login cells |
| A user's logins failed after all retries | "Failed to load" in that row         |
| User has no logins                       | "Never"                              |
| Last login more than a month ago         | Orange dot next to the time          |

Rows load independently, so the table fills in as responses arrive. React Query caches each user's logins, so the side panel reuses them without refetching.

## Bonus tasks

- [x] Highlight users who haven't logged in for at least a month (orange dot).
- [ ] Humanized login times. Not implemented: the plan would be a helper in core using the built-in `Intl.RelativeTimeFormat`, shared by both front ends.
- [ ] Country for the last login IP. Not implemented: it needs an external geo-IP service or an offline database (e.g. MaxMind GeoLite). With 1,000 lookups, those would need batching, caching, and the same concurrency limiting.

## Known limitations

- **No automated tests.** The first ones to write would cover `fetchUserLogins` parsing and sorting, and `apiFetch` retry and limiter behavior with a stubbed `fetch`.
- **No runtime validation of API responses.** The response types are trusted, not checked.
- **Loading all 1,000 users' logins takes a while** under the concurrency limit. Possible next steps are prioritizing visible rows or the selected user, or fetching only the rows on screen. Both are noted in `apiFetch.ts`.
- **The CLI overrides `console.debug` globally** to silence core's trace logging. It's a knowing shortcut, commented as such in the code.

## Decision log

[`DECISION_LOG.md`](./DECISION_LOG.md) is an append-only trace of the design decisions made during this assessment, in the order they were made. It records choices about how the problem was approached (architecture, data handling, UI states), not tooling or routine refactoring.
