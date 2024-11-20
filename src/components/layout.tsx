import type { JSX } from "solid-js";
import Header from "~/components/header/Header";
import Menu from "~/components/menu/Menu";
import { cn } from "~/lib/utils";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <div class={cn("h-dvh w-full flex flex-col")}>
      <Header />
      <div class="relative flex w-full h-[calc(100%-3rem)] gap-x-4">
        <Menu />
        {children}
      </div>
    </div>
  );
}
