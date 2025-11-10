import { useContext } from "solid-js";
import { InstallationContext } from "~/providers/instalation/instalation-context";

export function useInstallation() {
  const context = useContext(InstallationContext);
  if (!context) throw new Error("useInstallation must be used within an InstallationProvider");
  return context;
}
