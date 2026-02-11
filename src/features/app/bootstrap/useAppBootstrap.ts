import { isMobilePlatform } from "@utils/platformPaths";
import { useDebugLog } from "@/features/debug/hooks/useDebugLog";
import { useAppSettingsController } from "@app/hooks/useAppSettingsController";
import { useCodeCssVars } from "@app/hooks/useCodeCssVars";
import { useDictationController } from "@app/hooks/useDictationController";
import { useLiquidGlassEffect } from "@app/hooks/useLiquidGlassEffect";
import { useSettingsModalState } from "@app/hooks/useSettingsModalState";

export function useAppBootstrap() {
  const appSettingsState = useAppSettingsController();
  useCodeCssVars(appSettingsState.appSettings);

  const dictationState = useDictationController(appSettingsState.appSettings);
  const debugState = useDebugLog();
  const settingsModalState = useSettingsModalState();

  const shouldReduceTransparency =
    appSettingsState.reduceTransparency || isMobilePlatform();

  useLiquidGlassEffect({
    reduceTransparency: shouldReduceTransparency,
    onDebug: debugState.addDebugEntry,
  });

  return {
    ...appSettingsState,
    ...dictationState,
    ...debugState,
    ...settingsModalState,
    shouldReduceTransparency,
  };
}
