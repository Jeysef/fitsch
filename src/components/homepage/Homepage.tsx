import { useSearchParams } from "@solidjs/router";
import { For, Suspense, createMemo, lazy } from "solid-js";
import Scheduler from "~/components/scheduler";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import { useMenuOpened } from "~/providers/MenuOpenedProvider";
import { useScheduler } from "~/providers/SchedulerProvider";
import { Button } from "../ui/button";
import MenuIcon from "lucide-solid/icons/menu";

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
  const { opened, toggleNavigation } = useMenuOpened();

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

  const tab = createMemo(() => searchParams.tab ?? tabs.workSchedule);

  return (
    <Tabs as="nav" value={tab()} onChange={setTab} class="items-center h-full w-full overflow-auto flex flex-col">
      <div class="flex items-center justify-between w-full h-14 bg-background sticky top-0 z-10 px-4">
        <Button
          variant="default"
          size="icon"
          aria-label="navigation opener"
          class={cn("sticky left-0 shrink-0 z-10 ", { "w-0": opened() })}
          onClick={() => toggleNavigation(true)}
          name="open-menu"
        >
          <MenuIcon />
        </Button>
        <TabsList
          class={cn(
            "h-14 max-w-full w-auto bg-background flex-shrink-0 overflow-auto z-0 transition-[margin,max-width] justify-between px-4 items-center",
          )}
        >
          <div class="flex gap-x-4 h-full items-center">
            <For each={Object.values(tabs)}>
              {(value) => (
                <TabsTrigger class="w-auto whitespace-break-spaces" value={value}>
                  {t(`scheduler.tabs.${value}`)}
                </TabsTrigger>
              )}
            </For>
          </div>
          <TabsIndicator variant="underline" data-lang={locale()} />
          {/* data-lang for rerendering */}
        </TabsList>
        <div />
      </div>
      <TabsContent
        value={tabs.workSchedule}
        as="main"
        class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background"
      >
        <Scheduler store={storeProxy} />
      </TabsContent>
      <TabsContent
        value={tabs.resultSchedule}
        as="main"
        class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background"
      >
        <Scheduler store={filteredStore} />
      </TabsContent>
      <TabsContent
        value={tabs.timeSpan}
        as="main"
        class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background pb-4"
      >
        <Suspense>
          <TimeSpanPage store={storeProxy} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
