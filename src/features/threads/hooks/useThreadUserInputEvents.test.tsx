// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { RequestUserInputRequest } from "../../../types";
import { useThreadUserInputEvents } from "./useThreadUserInputEvents";

describe("useThreadUserInputEvents", () => {
  it("queues request and clears processing/reviewing state for the thread", () => {
    const dispatch = vi.fn();
    const markProcessing = vi.fn();
    const markReviewing = vi.fn();
    const setActiveTurnId = vi.fn();
    const request: RequestUserInputRequest = {
      workspace_id: "workspace-1",
      request_id: "req-1",
      params: {
        thread_id: "thread-1",
        turn_id: "turn-1",
        item_id: "item-1",
        questions: [],
      },
    };

    const { result } = renderHook(() =>
      useThreadUserInputEvents({
        dispatch,
        markProcessing,
        markReviewing,
        setActiveTurnId,
      }),
    );

    act(() => {
      result.current(request);
    });

    expect(dispatch).toHaveBeenCalledWith({ type: "addUserInputRequest", request });
    expect(markProcessing).toHaveBeenCalledWith("thread-1", false);
    expect(markReviewing).toHaveBeenCalledWith("thread-1", false);
    expect(setActiveTurnId).toHaveBeenCalledWith("thread-1", null);
  });

  it("only queues request when thread id is missing", () => {
    const dispatch = vi.fn();
    const markProcessing = vi.fn();
    const markReviewing = vi.fn();
    const setActiveTurnId = vi.fn();
    const request: RequestUserInputRequest = {
      workspace_id: "workspace-1",
      request_id: "req-1",
      params: {
        thread_id: "   ",
        turn_id: "turn-1",
        item_id: "item-1",
        questions: [],
      },
    };

    const { result } = renderHook(() =>
      useThreadUserInputEvents({
        dispatch,
        markProcessing,
        markReviewing,
        setActiveTurnId,
      }),
    );

    act(() => {
      result.current(request);
    });

    expect(dispatch).toHaveBeenCalledWith({ type: "addUserInputRequest", request });
    expect(markProcessing).not.toHaveBeenCalled();
    expect(markReviewing).not.toHaveBeenCalled();
    expect(setActiveTurnId).not.toHaveBeenCalled();
  });
});
