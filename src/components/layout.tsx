import type { FlowProps } from "solid-js";
import Header from "~/components/header/Header";
import AppSidebar from "~/components/menu/MenuBase";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";

export default function Layout(props: FlowProps) {
  return (
    <div class="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider class="flex flex-col">
      <Header />
      <div class="flex flex-1">
        <AppSidebar />
        <SidebarInset class="h-[calc(100svh-var(--header-height))] overflow-auto">
          {props.children}
        </SidebarInset>
      </div>
      </SidebarProvider>
    </div>
  );
}
