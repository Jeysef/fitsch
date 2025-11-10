import { makeEventListenerStack } from "@solid-primitives/event-listener";
import { scheduleIdle } from "@solid-primitives/scheduled";
import { type Accessor, createContext, createSignal, onMount, type ParentProps, useContext } from "solid-js";
import type { BeforeInstallPromptEvent } from "~/types";

interface InstallationContextType {
  canInstall: Accessor<boolean>;
  install: () => Promise<void>;
}

const InstallationContext = createContext<InstallationContextType>();

export function InstallationProvider(props: ParentProps) {
  const [installEvent, setInstallEvent] = createSignal<BeforeInstallPromptEvent | null>(null);

  const clearInstallEvent = () => setInstallEvent(null);

  const setEventOnIdle = scheduleIdle(setInstallEvent, 1000);

  onMount(() => {
    if (!("BeforeInstallPromptEvent" in window)) return;
    const [listen] = makeEventListenerStack(window);
    listen("beforeinstallprompt", setEventOnIdle);
    listen("appinstalled", clearInstallEvent);
  });

  const install = async () => {
    const event = installEvent();
    if (!event) return;

    event.prompt();
    const result = await event.userChoice;
    if (result.outcome !== "accepted") return;
    clearInstallEvent();
  };

  const value = {
    canInstall: () => !!installEvent(),
    install,
  };

  return <InstallationContext.Provider value={value}>{props.children}</InstallationContext.Provider>;
}

export function useInstallation() {
  const context = useContext(InstallationContext);
  if (!context) throw new Error("useInstallation must be used within an InstallationProvider");
  return context;
}
