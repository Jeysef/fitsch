import { makeTimer } from "@solid-primitives/timer";
import MenuIcon from "lucide-solid/icons/menu";
import X from "lucide-solid/icons/x";
import { createSignal } from "solid-js";
import Content from "~/components/menu/MenuContent";
import { MenuLocalDataProvider } from "~/components/menu/MenuLocalDataProvider";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useMenuOpened } from "~/providers/MenuOpenedProvider";

export default function Menu() {
  const { opened, menuHidden, toggleNavigation } = useMenuOpened();

  return (
    <aside
      class={cn(
        "flex flex-col h-full overflow-auto w-64 bg-background relative p-4 -ml-0 transition-[margin] flex-shrink-0 z-10",
        {
          "-ml-64": !opened(),
          hidden: menuHidden(),
        }
      )}
    >
      <Button
        variant="ghost"
        size={null}
        class="sticky right-0 top-0 -mt-6 w-max self-end rounded-sm opacity-70 ring-offset-background transition-[opacity,box-shadow] hover:opacity-100 focus:outline-none focus:ring-[1.5px] focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        onClick={() => toggleNavigation(false)}
        name="close-menu"
      >
        <X />
      </Button>
      <MenuLocalDataProvider>
        <Content />
      </MenuLocalDataProvider>
    </aside>
  );
}
