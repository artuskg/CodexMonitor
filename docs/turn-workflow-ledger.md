# Turn Workflow Ledger

## Plan
- Push the completed mobile QoL patch set to `artuskg/CodexMonitor`.

## Doing
- Finalizing commit/push metadata and confirming git state.

## Done
- Consulted this ledger before responding this turn.
- Added/updated git remote `artuskg -> https://github.com/artuskg/CodexMonitor.git`.
- Committed staged changes on `main`:
- commit `500d94c`
- message: `Improve remote mobile QoL: add-project, refresh, reconnect, and sidebar activity`
- Pushed to `artuskg`:
- `git push artuskg HEAD:main` -> `b6f30a5..500d94c`.

## Next
- Optionally address RepoPrompt follow-up hardening: per-thread in-flight subscribe guard to avoid duplicate same-thread subscriptions under race.

## Todos
- Keep this ledger updated every turn.
- Monitor iOS real-device behavior after daemon restarts and verify toast frequency/noise.
