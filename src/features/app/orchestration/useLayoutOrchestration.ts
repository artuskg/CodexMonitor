import { useMemo, type CSSProperties } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useLayoutController } from "@app/hooks/useLayoutController";
import type { AppSettings } from "@/types";

export type MainTab = "home" | "projects" | "codex" | "git" | "log";

type UseLayoutOrchestrationParams = {
  activeWorkspaceId: string | null;
  setActiveTab: Dispatch<SetStateAction<MainTab>>;
  setDebugOpen: Dispatch<SetStateAction<boolean>>;
  toggleDebugPanelShortcut: string | null;
  toggleTerminalShortcut: string | null;
  shouldReduceTransparency: boolean;
};

export function useLayoutOrchestration({
  activeWorkspaceId,
  setActiveTab,
  setDebugOpen,
  toggleDebugPanelShortcut,
  toggleTerminalShortcut,
  shouldReduceTransparency,
}: UseLayoutOrchestrationParams) {
  const layoutState = useLayoutController({
    activeWorkspaceId,
    setActiveTab,
    setDebugOpen,
    toggleDebugPanelShortcut,
    toggleTerminalShortcut,
  });

  const sidebarToggleProps = useMemo(
    () => ({
      isCompact: layoutState.isCompact,
      sidebarCollapsed: layoutState.sidebarCollapsed,
      rightPanelCollapsed: layoutState.rightPanelCollapsed,
      onCollapseSidebar: layoutState.collapseSidebar,
      onExpandSidebar: layoutState.expandSidebar,
      onCollapseRightPanel: layoutState.collapseRightPanel,
      onExpandRightPanel: layoutState.expandRightPanel,
    }),
    [
      layoutState.isCompact,
      layoutState.sidebarCollapsed,
      layoutState.rightPanelCollapsed,
      layoutState.collapseSidebar,
      layoutState.expandSidebar,
      layoutState.collapseRightPanel,
      layoutState.expandRightPanel,
    ],
  );

  const appClassName = useMemo(
    () =>
      `app ${layoutState.isCompact ? "layout-compact" : "layout-desktop"}${
        layoutState.isPhone ? " layout-phone" : ""
      }${layoutState.isTablet ? " layout-tablet" : ""}${
        shouldReduceTransparency ? " reduced-transparency" : ""
      }${!layoutState.isCompact && layoutState.sidebarCollapsed ? " sidebar-collapsed" : ""}${
        !layoutState.isCompact && layoutState.rightPanelCollapsed ? " right-panel-collapsed" : ""
      }`,
    [
      layoutState.isCompact,
      layoutState.isPhone,
      layoutState.isTablet,
      layoutState.sidebarCollapsed,
      layoutState.rightPanelCollapsed,
      shouldReduceTransparency,
    ],
  );

  return {
    ...layoutState,
    sidebarToggleProps,
    appClassName,
  };
}

type UseAppShellOrchestrationOptions = {
  isCompact: boolean;
  isPhone: boolean;
  isTablet: boolean;
  sidebarCollapsed: boolean;
  rightPanelCollapsed: boolean;
  shouldReduceTransparency: boolean;
  isWorkspaceDropActive: boolean;
  centerMode: "chat" | "diff";
  selectedDiffPath: string | null;
  showComposer: boolean;
  activeThreadId: string | null;
  sidebarWidth: number;
  rightPanelWidth: number;
  planPanelHeight: number;
  terminalPanelHeight: number;
  debugPanelHeight: number;
  appSettings: Pick<AppSettings, "uiFontFamily" | "codeFontFamily" | "codeFontSize">;
};

export function useAppShellOrchestration({
  isCompact,
  isPhone,
  isTablet,
  sidebarCollapsed,
  rightPanelCollapsed,
  shouldReduceTransparency,
  isWorkspaceDropActive,
  centerMode,
  selectedDiffPath,
  showComposer,
  activeThreadId,
  sidebarWidth,
  rightPanelWidth,
  planPanelHeight,
  terminalPanelHeight,
  debugPanelHeight,
  appSettings,
}: UseAppShellOrchestrationOptions) {
  const showGitDetail = Boolean(selectedDiffPath) && isPhone && centerMode === "diff";
  const isThreadOpen = Boolean(activeThreadId && showComposer);

  const appClassName = `app ${isCompact ? "layout-compact" : "layout-desktop"}${
    isPhone ? " layout-phone" : ""
  }${isTablet ? " layout-tablet" : ""}${
    shouldReduceTransparency ? " reduced-transparency" : ""
  }${!isCompact && sidebarCollapsed ? " sidebar-collapsed" : ""}${
    !isCompact && rightPanelCollapsed ? " right-panel-collapsed" : ""
  }`;

  const appStyle = useMemo<CSSProperties>(
    () => ({
      "--sidebar-width": `${isCompact ? sidebarWidth : sidebarCollapsed ? 0 : sidebarWidth}px`,
      "--right-panel-width": `${
        isCompact ? rightPanelWidth : rightPanelCollapsed ? 0 : rightPanelWidth
      }px`,
      "--plan-panel-height": `${planPanelHeight}px`,
      "--terminal-panel-height": `${terminalPanelHeight}px`,
      "--debug-panel-height": `${debugPanelHeight}px`,
      "--ui-font-family": appSettings.uiFontFamily,
      "--code-font-family": appSettings.codeFontFamily,
      "--code-font-size": `${appSettings.codeFontSize}px`,
    } as CSSProperties),
    [
      appSettings.codeFontFamily,
      appSettings.codeFontSize,
      appSettings.uiFontFamily,
      debugPanelHeight,
      isCompact,
      planPanelHeight,
      rightPanelCollapsed,
      rightPanelWidth,
      sidebarCollapsed,
      sidebarWidth,
      terminalPanelHeight,
    ],
  );

  return {
    showGitDetail,
    isThreadOpen,
    dropOverlayActive: isWorkspaceDropActive,
    dropOverlayText: "Drop Project Here",
    appClassName,
    appStyle,
  };
}
