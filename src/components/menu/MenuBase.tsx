import { Show } from "solid-js";
import Content from "~/components/menu/MenuContent";
import { MenuLocalDataProvider } from "~/components/menu/MenuLocalDataProvider";
import {
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
} from "../ui/sidebar";
import { useIsMobile } from "~/lib/hooks";

export default function Menu() {
  const isMobile = useIsMobile();
  return (
    <Sidebar class="top-[--header-height] !h-[calc(100svh-var(--header-height))]">
      <Show when={isMobile()}>
        <SidebarHeader>
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 196 80" height={24}>
                <title>VUT FIT Logo</title>
                <rect fill="#fff" width="77" height="100%" /> {/* 80 - 3 */}
                <rect fill="#fff" width="110" height="100%" x="86" /> {/* 83 + 3 */}
                <path
                  fill="#00a9e0"
                  fill-rule="evenodd"
                  d="M83 80h113V0H83v80zm68.807-59.903h29.12v5.824h-11.2v33.376h-6.721V25.921h-11.199v-5.824zm-15.68 39.2h6.72v-39.2h-6.72v39.2zm-32.759-39.2h22.96v5.824h-16.24v10.752h15.12v5.824h-15.12v16.8h-6.72v-39.2z"
                />
                <path fill="#e4002b" d="M67 32H53a5.9 5.9 0 0 0-6 5.7V69h-9V24H13v-9h25v9h29v8zM0 80h80V0H0v80z" />
              </svg>
              <span class="inline">Scheduler</span>
            </div>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
      </Show>
      <MenuLocalDataProvider>
        <Content />
      </MenuLocalDataProvider>
    </Sidebar>
  );
}
