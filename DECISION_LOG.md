# Decision Log

An append-only trace of conscious design/structure decisions made while working on this assessment, in the order they were made.

- Structured the repo as a pnpm workspace so the dashboard, a future core data-handling package, and a future CLI can share code and a single dependency graph.
- Started with a deliberately naive data-loading baseline (plain `fetch` calls fired from a mount `useEffect` in `App.tsx`, no error handling or retries) to prove the API wiring end to end before tackling failures, latency, and the per-user login fan-out.
- Extracted the API fetch functions and types into a framework-agnostic `sitewire-interview-core` package, so the same data logic can back both the dashboard and a future CLI.
- `sitewire-interview-core` ships raw TypeScript source (`exports` points at `src/index.ts`) with no build step; Vite compiles it for the dashboard, and Node's native type stripping can run it directly for the CLI.
- Rendered users as grid-aligned list rows (`UserCard`) rather than a full data table, keeping a lightweight layout that can grow columns for login time and IP.
