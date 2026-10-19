# Decision Log

An append-only trace of conscious design/structure decisions made while working on this assessment, in the order they were made.

- Structured the repo as a pnpm workspace so the dashboard, a future core data-handling package, and a future CLI can share code and a single dependency graph.
- Started with a deliberately naive data-loading baseline (plain `fetch` calls fired from a mount `useEffect` in `App.tsx`, no error handling or retries) to prove the API wiring end to end before tackling failures, latency, and the per-user login fan-out.
