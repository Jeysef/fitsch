import AppInfo from "../header/InfoDialog";
import { LanguageSwitcher } from "../header/LanguageSwitcher";
import ModeToggle from "../modeToggle";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import InstallButton from "../ui/InstallButton";

export function Settings() {
  return (
    <div class="block md:hidden">
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
    </div>
  );
}
