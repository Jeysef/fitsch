import { type Accessor, createContext, createSignal, type JSX, onMount, useContext } from "solid-js";

interface InstallationContextType {
  canInstall: Accessor<boolean>;
  install: () => Promise<void>;
}

const InstallationContext = createContext<InstallationContextType>();

export function InstallationProvider(props: { children: JSX.Element }) {
  const [installEvent, setInstallEvent] = createSignal<any | null>(null);

  onMount(() => {
    if ("BeforeInstallPromptEvent" in window) {
      window.addEventListener("beforeinstallprompt", (event: Event) => {
        setInstallEvent(event);
      });

      window.addEventListener("appinstalled", () => {
        setInstallEvent(null);
      });
    }
  });

  const install = async () => {
    const event = installEvent();
    if (!event) return;

    event.prompt();
    const result = await event.userChoice;
    if (result.outcome === "accepted") {
      setInstallEvent(null);
    }
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
