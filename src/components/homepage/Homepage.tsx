import { useSearchParams } from "@solidjs/router";
import { For, Suspense, batch, createMemo, createSignal } from "solid-js";
import Scheduler from "~/components/scheduler";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import { useScheduler } from "~/providers/SchedulerProvider";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { ObjectTyped } from "object-typed";
import TimeSpan from "./TimeSpan";
import { isServer } from "solid-js/web";
import { Button } from "../ui/button";
import { useIsMobile } from "~/lib/hooks";
import { tabs, type Tab } from "./tab";


export default function Home() {
  const { t, locale } = useI18n();
  const { store } = useScheduler();
  const [searchParams, setSearchParams] = useSearchParams<Tab>();
  // const { opened, toggleNavigation } = useMenuOpened();
  const [isAllCollapsed, setIsAllCollapsed] = createSignal(false);

  const checkedDataMemo = createMemo(() => store.checkedData);
  const data = createMemo(() => store.data);

  const storeProxy = new Proxy(store, {
    get(store, prop) {
      if (prop === "data") return data();
      // Forward all other property access to original store
      // @ts-ignore
      return store[prop];
    },
    set(store, prop, value) {
      // Forward all property sets to original store
      // @ts-ignore
      store[prop] = value;
      return true;
    },
  });

  const filteredStore = new Proxy(storeProxy, {
    get(store, prop) {
      if (prop === "data") return checkedDataMemo();
      // Forward all other property access to original store
      // @ts-ignore
      return store[prop];
    },
    set(store, prop, value) {
      // Forward all property sets to original store
      // @ts-ignore
      store[prop] = value;
      return true;
    },
  });

  const setTab = (tabValue: string) => {
    setSearchParams({ tab: tabValue }, { replace: true });
  };

  const areAllCoursesSelected = createMemo(() => {
    return storeProxy.courses.every((course, idx) => {
      return ObjectTyped.entries(course.metrics).every(
        ([type, { weeklyLectures }]) => storeProxy.selected[idx]?.[type] === weeklyLectures
      );
    });
  });

  const collapseAll = (expand = false) =>
    batch(() => {
      for (const dayEvent of Object.values(storeProxy.data)) {
        for (const event of dayEvent.events) {
          event.eventData.event.collapsed = expand;
        }
      }
    });

  const tab = createMemo(() => searchParams.tab ?? tabs.workSchedule);

  const isMobile = useIsMobile();

  return (
    <Tabs value={tab()} onChange={setTab} class="contents">
      {/* <div class="flex items-center justify-between w-full h-14 bg-background sticky top-0 z-10 px-4"> */}
      <div class="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
        <div class="flex h-16 shrink-0 items-center gap-2 -ml-1">
          <SidebarTrigger />
          <Separator orientation="vertical" class="mr-2 !h-4" />
        </div>
        <TabsList
          class={cn(
            "h-14 max-w-full w-auto bg-background flex-shrink overflow-auto z-0 transition-[margin,max-width] justify-between px-4 items-center"
          )}
        >
          <For each={Object.values(tabs)}>
            {(value) => (
              <TabsTrigger
                class={cn(
                  "w-auto whitespace-break-spaces",
                  value === tabs.timeSpan &&
                    !isServer &&
                    (areAllCoursesSelected()
                      ? "after:ml-2 after:w-2 after:h-2 after:rounded-full after:bg-green-500 after:self-start"
                      : "after:ml-2 after:w-2 after:h-2 after:rounded-full after:bg-red-500 after:self-start")
                )}
                value={value}
              >
                {t(`scheduler.tabs.${value}`)}
              </TabsTrigger>
            )}
          </For>
          <TabsIndicator variant="underline" data-lang={locale()} />
          {/* data-lang for rerendering */}
        </TabsList>
        <div class={cn("flex h-16 shrink-0 items-center gap-2 -mr-1", {"*:hidden": tab() === tabs.timeSpan})}>
          <Separator orientation="vertical" class="mr-2 !h-4" />
          <Button variant="outline" on:click={() => collapseAll(setIsAllCollapsed((p) => !p))} class="h-8">
            {(isAllCollapsed() ? t("scheduler.tabActions.expandAll") : t("scheduler.tabActions.collapseAll"))
              .split(" ")
              .slice(0, 2 - Number(isMobile()))
              .join(" ")}
          </Button>
        </div>
        {/* <div /> */}
      </div>
      {/* <div /> */}
      {/* </div> */}
      <TabsContent value={tabs.workSchedule} class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background">
        <Scheduler store={storeProxy} />
      </TabsContent>
      <TabsContent value={tabs.resultSchedule} class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background">
        <Scheduler store={filteredStore} />
      </TabsContent>
      <TabsContent value={tabs.timeSpan} class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background pb-4">
        <Suspense>
          <TimeSpan store={storeProxy} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
