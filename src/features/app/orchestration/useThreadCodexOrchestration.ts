import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import type { AccessMode } from "@/types";
import { useThreadCodexParams } from "@threads/hooks/useThreadCodexParams";
import {
  resolveThreadCodexState,
  type PendingNewThreadSeed,
} from "@threads/utils/threadCodexParamsSeed";

export type ThreadCodexOrchestration = {
  accessMode: AccessMode;
  setAccessMode: Dispatch<SetStateAction<AccessMode>>;
  preferredModelId: string | null;
  setPreferredModelId: Dispatch<SetStateAction<string | null>>;
  preferredEffort: string | null;
  setPreferredEffort: Dispatch<SetStateAction<string | null>>;
  preferredCollabModeId: string | null;
  setPreferredCollabModeId: Dispatch<SetStateAction<string | null>>;
  threadCodexSelectionKey: string | null;
  setThreadCodexSelectionKey: Dispatch<SetStateAction<string | null>>;
  threadCodexParamsVersion: number;
  getThreadCodexParams: ReturnType<typeof useThreadCodexParams>["getThreadCodexParams"];
  patchThreadCodexParams: ReturnType<typeof useThreadCodexParams>["patchThreadCodexParams"];
  persistThreadCodexParams: (patch: {
    modelId?: string | null;
    effort?: string | null;
    accessMode?: AccessMode | null;
    collaborationModeId?: string | null;
  }) => void;
  activeThreadIdRef: MutableRefObject<string | null>;
  pendingNewThreadSeedRef: MutableRefObject<PendingNewThreadSeed | null>;
};

type UseThreadCodexOrchestrationParams = {
  activeWorkspaceIdForParamsRef: MutableRefObject<string | null>;
};

type UseThreadCodexSelectionSyncParams = {
  orchestration: ThreadCodexOrchestration;
  activeWorkspaceId: string | null | undefined;
  activeThreadId: string | null;
  defaultAccessMode: AccessMode;
  lastComposerModelId: string | null;
  lastComposerReasoningEffort: string | null;
};

export function useThreadCodexOrchestration({
  activeWorkspaceIdForParamsRef,
}: UseThreadCodexOrchestrationParams): ThreadCodexOrchestration {
  const {
    version: threadCodexParamsVersion,
    getThreadCodexParams,
    patchThreadCodexParams,
  } = useThreadCodexParams();
  const [accessMode, setAccessMode] = useState<AccessMode>("current");
  const [preferredModelId, setPreferredModelId] = useState<string | null>(null);
  const [preferredEffort, setPreferredEffort] = useState<string | null>(null);
  const [preferredCollabModeId, setPreferredCollabModeId] = useState<string | null>(
    null,
  );
  const [threadCodexSelectionKey, setThreadCodexSelectionKey] = useState<string | null>(
    null,
  );
  const activeThreadIdRef = useRef<string | null>(null);
  const pendingNewThreadSeedRef = useRef<PendingNewThreadSeed | null>(null);

  const persistThreadCodexParams = useCallback(
    (patch: {
      modelId?: string | null;
      effort?: string | null;
      accessMode?: AccessMode | null;
      collaborationModeId?: string | null;
    }) => {
      const workspaceId = activeWorkspaceIdForParamsRef.current;
      const threadId = activeThreadIdRef.current;
      if (!workspaceId || !threadId) {
        return;
      }
      patchThreadCodexParams(workspaceId, threadId, patch);
    },
    [activeWorkspaceIdForParamsRef, patchThreadCodexParams],
  );

  return useMemo(
    () => ({
      accessMode,
      setAccessMode,
      preferredModelId,
      setPreferredModelId,
      preferredEffort,
      setPreferredEffort,
      preferredCollabModeId,
      setPreferredCollabModeId,
      threadCodexSelectionKey,
      setThreadCodexSelectionKey,
      threadCodexParamsVersion,
      getThreadCodexParams,
      patchThreadCodexParams,
      persistThreadCodexParams,
      activeThreadIdRef,
      pendingNewThreadSeedRef,
    }),
    [
      accessMode,
      preferredCollabModeId,
      preferredEffort,
      preferredModelId,
      threadCodexSelectionKey,
      threadCodexParamsVersion,
      getThreadCodexParams,
      patchThreadCodexParams,
      persistThreadCodexParams,
    ],
  );
}

export function useThreadCodexSelectionSync({
  orchestration,
  activeWorkspaceId,
  activeThreadId,
  defaultAccessMode,
  lastComposerModelId,
  lastComposerReasoningEffort,
}: UseThreadCodexSelectionSyncParams) {
  const {
    activeThreadIdRef,
    getThreadCodexParams,
    pendingNewThreadSeedRef,
    setAccessMode,
    setPreferredCollabModeId,
    setPreferredEffort,
    setPreferredModelId,
    setThreadCodexSelectionKey,
    threadCodexParamsVersion,
  } = orchestration;

  useLayoutEffect(() => {
    const workspaceId = activeWorkspaceId ?? null;
    const threadId = activeThreadId ?? null;
    activeThreadIdRef.current = threadId;

    if (!workspaceId) {
      return;
    }

    const stored = threadId ? getThreadCodexParams(workspaceId, threadId) : null;
    const resolved = resolveThreadCodexState({
      workspaceId,
      threadId,
      defaultAccessMode,
      lastComposerModelId,
      lastComposerReasoningEffort,
      stored,
      pendingSeed: pendingNewThreadSeedRef.current,
    });

    setThreadCodexSelectionKey(resolved.scopeKey);
    setAccessMode(resolved.accessMode);
    setPreferredModelId(resolved.preferredModelId);
    setPreferredEffort(resolved.preferredEffort);
    setPreferredCollabModeId(resolved.preferredCollabModeId);
  }, [
    activeThreadId,
    activeWorkspaceId,
    defaultAccessMode,
    getThreadCodexParams,
    lastComposerModelId,
    lastComposerReasoningEffort,
    pendingNewThreadSeedRef,
    setAccessMode,
    setPreferredCollabModeId,
    setPreferredEffort,
    setPreferredModelId,
    setThreadCodexSelectionKey,
    threadCodexParamsVersion,
    activeThreadIdRef,
  ]);
}
