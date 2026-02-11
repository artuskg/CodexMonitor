import { useCallback } from "react";
import type { Dispatch } from "react";
import type { RequestUserInputRequest } from "../../../types";
import type { ThreadAction } from "./useThreadsReducer";

type UseThreadUserInputEventsOptions = {
  dispatch: Dispatch<ThreadAction>;
  markProcessing: (threadId: string, isProcessing: boolean) => void;
  markReviewing: (threadId: string, isReviewing: boolean) => void;
  setActiveTurnId: (threadId: string, turnId: string | null) => void;
};

export function useThreadUserInputEvents({
  dispatch,
  markProcessing,
  markReviewing,
  setActiveTurnId,
}: UseThreadUserInputEventsOptions) {
  return useCallback(
    (request: RequestUserInputRequest) => {
      dispatch({ type: "addUserInputRequest", request });
      const threadId = request.params.thread_id.trim();
      if (!threadId) {
        return;
      }
      markProcessing(threadId, false);
      markReviewing(threadId, false);
      setActiveTurnId(threadId, null);
    },
    [dispatch, markProcessing, markReviewing, setActiveTurnId],
  );
}
