import { createContext, type Accessor } from "solid-js";

interface InstallationContextType {
  canInstall: Accessor<boolean>;
  install: () => Promise<void>;
}

export const InstallationContext = createContext<InstallationContextType>();
