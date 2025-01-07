import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { type Accessor, createContext, createSignal, type ParentProps, type Setter, useContext } from "solid-js";

interface MenuOpenedContextType {
  opened: Accessor<boolean>;
  setOpened: Setter<boolean>;
}

const MenuOpenedContext = createContext<MenuOpenedContextType>();

export function MenuOpenedProvider(props: ParentProps) {
  const [opened, setOpened] = makePersisted(createSignal(true), {
    name: "menuOpened",
    storage: cookieStorage.withOptions({
      sameSite: "Strict",
    }),
  });

  const value = {
    opened,
    setOpened,
  };

  return <MenuOpenedContext.Provider value={value}>{props.children}</MenuOpenedContext.Provider>;
}

export function useMenuOpened() {
  const context = useContext(MenuOpenedContext);
  if (!context) throw new Error("useInstallation must be used within an MenuOpenedProvider");
  return context;
}
