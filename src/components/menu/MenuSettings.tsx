import { useIsMobile } from "~/lib/hooks";
import AppInfo from "../header/InfoDialog";
import { LanguageSwitcher } from "../header/LanguageSwitcher";
import ModeToggle from "../modeToggle";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { Show } from "solid-js";
import InstallButton from "../ui/InstallButton";

export function Settings() {
  const isMobile = useIsMobile();
  return (
    <Show when={isMobile()}>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenu class="flex-row">
              <SidebarMenuItem>
                <ModeToggle />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <AppInfo />
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenuItem>
              <LanguageSwitcher />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <InstallButton  class="w-full"/>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </Show>
  );
}
