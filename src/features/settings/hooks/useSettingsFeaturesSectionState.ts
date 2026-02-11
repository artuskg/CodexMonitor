import { useCallback, useState } from "react";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { getCodexConfigPath } from "@services/tauri";

export const useSettingsFeaturesSectionState = () => {
  const [openConfigError, setOpenConfigError] = useState<string | null>(null);

  const handleOpenConfig = useCallback(async () => {
    setOpenConfigError(null);
    try {
      const configPath = await getCodexConfigPath();
      await revealItemInDir(configPath);
    } catch (error) {
      setOpenConfigError(
        error instanceof Error ? error.message : "Unable to open config.",
      );
    }
  }, []);

  return {
    openConfigError,
    handleOpenConfig,
  };
};
