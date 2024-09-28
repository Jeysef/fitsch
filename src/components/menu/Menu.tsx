import Menu from "lucide-solid/icons/menu";
import { createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const [openend, setOpened] = createSignal(true, { name: "navOpened" });
const [navHidden, setNavHidden] = createSignal(false, { name: "navHidden" });

/**
   * This is a workaround for the transition to work properly.
   * Not the best solution probably, but for low timeout, it works pretty reliably.
   */
export const toggleNavigation = (openend: boolean) => {
  openend ?
    setNavHidden(false)
    : setTimeout(() => {
      setNavHidden(true);
    }, 150);
  setTimeout(() => {
    setOpened(openend)
  }, 5);


}

export default function Navigation() {
  return (
    <>
      <Button variant="default" size="icon" aria-label="navigation opener" class={cn("absolute top-4 left-4 z-10", { "hidden": openend() })} onClick={() => toggleNavigation(true)}>
        <Menu />
      </Button>

      <nav class={cn("peer/nav flex flex-col h-full overflow-auto w-64 bg-background relative p-4 -ml-0 transition-[margin] flex-shrink-0 ", {
        "-ml-64": !openend(),
        "hidden": navHidden(),
      })}
      >
      </nav >
    </>
  )
}
