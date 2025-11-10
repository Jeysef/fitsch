import { makeEventListenerStack } from "@solid-primitives/event-listener";
import { scheduleIdle } from "@solid-primitives/scheduled";
import { createSignal, onMount, type ParentProps } from "solid-js";
import { InstallationContext } from "~/providers/instalation/instalation-context";
import type { BeforeInstallPromptEvent } from "~/types";

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
