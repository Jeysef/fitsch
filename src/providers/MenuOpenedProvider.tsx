import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { makeTimer } from "@solid-primitives/timer";
import { type Accessor, createContext, createSignal, type ParentProps, type Setter, useContext } from "solid-js";

interface MenuOpenedContextType {
  opened: Accessor<boolean>;
  setOpened: Setter<boolean>;
  menuHidden: Accessor<boolean>;
  toggleNavigation: (openend: boolean) => void;
}

const MenuOpenedContext = createContext<MenuOpenedContextType>();

export function MenuOpenedProvider(props: ParentProps) {
  const [opened, setOpened] = makePersisted(createSignal(true), {
    name: "menuOpened",
    storage: cookieStorage.withOptions(),
  });

  const [menuHidden, setMenuHidden] = createSignal(!opened(), { name: "menuHidden" });

  const toggleNavigation = (openend: boolean) => {
    if (openend) {
      setMenuHidden(false);
    } else {
      makeTimer(() => setMenuHidden(true), 150, setTimeout);
    }
    makeTimer(() => setOpened(openend), 5, setTimeout);
  };

  const value = {
    opened,
    setOpened,
    menuHidden,
    toggleNavigation,
  };

  return <MenuOpenedContext.Provider value={value}>{props.children}</MenuOpenedContext.Provider>;
}

export function useMenuOpened() {
  const context = useContext(MenuOpenedContext);
  if (!context) throw new Error("useMenuOpened must be used within an MenuOpenedProvider");
  return context;
}
