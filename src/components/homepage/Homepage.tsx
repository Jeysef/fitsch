import { useSearchParams } from "@solidjs/router";
import { For, Suspense, createMemo, lazy } from "solid-js";
import Scheduler from "~/components/scheduler";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import { useScheduler } from "~/providers/SchedulerProvider";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { ObjectTyped } from "object-typed";

const TimeSpanPage = lazy(() => import("./TimeSpan"));

const tabs = {
  workSchedule: "workSchedule",
  resultSchedule: "resultSchedule",
  timeSpan: "timeSpan",
} as const;

type TabValues = (typeof tabs)[keyof typeof tabs];
type Tab = { tab: TabValues };

export default function Home() {
  const { t, locale } = useI18n();
  const { store } = useScheduler();
  const [searchParams, setSearchParams] = useSearchParams<Tab>();
  // const { opened, toggleNavigation } = useMenuOpened();

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

  const tab = createMemo(() => searchParams.tab ?? tabs.workSchedule);

  return (
    <Tabs value={tab()} onChange={setTab} class="content">
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
          <div />
        </div>
        {/* <div /> */}
      {/* </div> */}
      <TabsContent
        value={tabs.workSchedule}
        class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background"
      >
        <Scheduler store={storeProxy} />
      </TabsContent>
      <TabsContent
        value={tabs.resultSchedule}
        class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background"
      >
        <Scheduler store={filteredStore} />
      </TabsContent>
      <TabsContent
        value={tabs.timeSpan}
        class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background pb-4"
      >
        <Suspense>
          <TimeSpanPage store={storeProxy} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
