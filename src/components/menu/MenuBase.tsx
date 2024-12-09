import MenuIcon from "lucide-solid/icons/menu";
import X from "lucide-solid/icons/x";
import { createSignal } from "solid-js";
import Content from "~/components/menu/MenuContent";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const [openend, setOpened] = createSignal(true, { name: "menuOpened" });
const [menuHidden, setMenuHidden] = createSignal(false, { name: "menuHidden" });

/**
 * This is a workaround for the transition to work properly.
 * Not the best solution probably, but for low timeout, it works pretty reliably.
 */
export const toggleNavigation = (openend: boolean) => {
  openend
    ? setMenuHidden(false)
    : setTimeout(() => {
        setMenuHidden(true);
      }, 150);
  setTimeout(() => {
    setOpened(openend);
  }, 5);
};

export default function Menu() {
  return (
    <>
      <Button
        variant="default"
        size="icon"
        aria-label="navigation opener"
        class={cn("absolute top-4 left-4 z-10", { hidden: openend() })}
        onClick={() => toggleNavigation(true)}
      >
        <MenuIcon />
      </Button>

      <aside
        class={cn(
          "flex flex-col h-full overflow-auto w-64 bg-background relative p-4 -ml-0 transition-[margin] flex-shrink-0 z-10",
          {
            "-ml-64": !openend(),
            hidden: menuHidden(),
          }
        )}
      >
        <Button
          variant="ghost"
          size={null}
          class="sticky right-0 top-0 -mt-6 w-max self-end rounded-sm opacity-70 ring-offset-background transition-[opacity,box-shadow] hover:opacity-100 focus:outline-none focus:ring-[1.5px] focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          onClick={() => toggleNavigation(false)}
        >
          <X />
        </Button>
        <Content />
      </aside>
    </>
  );
}
