# Turn Workflow Ledger

## Plan
- Confirm whether mobile backgrounding kills tool calls or only interrupts streamed updates.

## Doing
- Preparing a code-grounded answer on iOS background behavior and reconnect semantics.

## Done
- Consulted this ledger before responding this turn.
- Ran final targeted tests and typecheck after reconnect race patch:
- `npm run test -- src/features/app/hooks/useRemoteThreadLiveConnection.test.tsx src/features/workspaces/hooks/useWorkspaceRefreshOnFocus.test.tsx src/features/workspaces/hooks/useWorkspaces.test.tsx src/features/app/hooks/useRemoteThreadRefreshOnFocus.test.tsx src/features/app/components/Sidebar.test.tsx`
- `npm run typecheck`
- Ran RepoPrompt review vs `main` after latest edits.
- Inspected lifecycle code paths for background behavior in:
- `src/features/app/hooks/useRemoteThreadLiveConnection.ts`
- `src/features/app/hooks/useRemoteThreadRefreshOnFocus.ts`
- `src/features/workspaces/hooks/useWorkspaceRefreshOnFocus.ts`
- Verified daemon live subscribe/unsubscribe semantics in `src-tauri/src/bin/codex_monitor_daemon.rs`.

## Next
- Decide whether to add a per-thread in-flight subscribe guard to eliminate duplicate same-thread subscribe risk called out in review.

## Todos
- Keep this ledger updated every turn.
- Monitor iOS real-device behavior after daemon restarts and verify toast frequency/noise.
