import { useSearchParams } from "@solidjs/router";
import { For, Show, Suspense, batch, createEffect, createMemo, createSignal, onMount } from "solid-js";
import { isServer } from "solid-js/web";
import { VALIDITY, getAfterValidityColor } from "~/components/homepage/utils";
import Scheduler from "~/components/scheduler";
import SchedulerSkeleton from "~/components/scheduler/SchedulerSkeleton";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useI18n } from "~/i18n";
import { useIsMobile } from "~/lib/hooks";
import { usePostHog } from "~/lib/posthog";
import { cn } from "~/lib/utils";
import { useScheduler } from "~/providers/SchedulerProvider";
import { createProjection } from "~/utils/store/projection";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { tabs, type Tab } from "./tab";
import TimeSpan from "./TimeSpan";

export default function Home() {
  const { t, locale } = useI18n();
  const { store } = useScheduler();
  const posthog = usePostHog();
  const [searchParams, setSearchParams] = useSearchParams<Tab>();
  const [isAllCollapsed, setIsAllCollapsed] = createSignal(false);
  const [showSkeleton, setShowSkeleton] = createSignal(true);

  onMount(() => {
    // Wait for next tick to allow localStorage hydration
    queueMicrotask(() => setShowSkeleton(false));
  });

  const filteredStore = createProjection(store, (store) => ({
    data: store.checkedData,
  }));

  const allCoursesValidity = createMemo((): VALIDITY => {
    // if all courses are valid, return VALID
    // if any courses are invalid, return INVALID
    // if all are partial or there is at least one partial between valid return PARTIAL
    return store.courses.every((course) => store.coursesTimeSpan[course.detail.id].validity === VALIDITY.VALID)
      ? VALIDITY.VALID
      : store.courses.some((course) => store.coursesTimeSpan[course.detail.id].validity === VALIDITY.INVALID)
        ? VALIDITY.INVALID
        : VALIDITY.PARTIAL;
  });

  createEffect(() => {
    if (store.courses.length && allCoursesValidity() === VALIDITY.VALID) posthog().capture("timespan-all-courses-selected");
  });

  const collapseAll = (expand = false) =>
    batch(() => {
      for (const dayEvent of Object.values(store.data)) {
        for (const eventStore of dayEvent.events) {
          eventStore.event.collapsed = expand;
        }
      }
    });

  const tab = createMemo(() => searchParams.tab ?? tabs.workSchedule);
  const setTab = (tabValue: string) => setSearchParams({ tab: tabValue }, { replace: true });
  const isMobile = useIsMobile();

  return (
    <Tabs value={tab()} onChange={setTab} class="contents">
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
                    `after:absolute after:right-0 after: top-0 after:size-2 after:rounded-full after:self-start ${getAfterValidityColor(allCoursesValidity())}`
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
        <div class={cn("flex h-16 shrink-0 items-center gap-2 -mr-1", { "*:hidden": tab() === tabs.timeSpan })}>
          <Separator orientation="vertical" class="mr-2 !h-4" />
          <Button variant="outline" on:click={() => collapseAll(setIsAllCollapsed((p) => !p))} class="h-8">
            {(isAllCollapsed() ? t("scheduler.tabActions.expandAll") : t("scheduler.tabActions.collapseAll"))
              .split(" ")
              .slice(0, 2 - Number(isMobile()))
              .join(" ")}
          </Button>
        </div>
      </div>
      <Show when={tab() === tabs.workSchedule || tab() === tabs.resultSchedule}>
        <div class="w-auto max-w-full h-full !mt-0 overflow-auto border-t-4 border-t-background p-2 mx-auto">
          <Show
            when={showSkeleton()}
            fallback={<Scheduler store={tab() === tabs.resultSchedule ? filteredStore : store} />}
          >
            <SchedulerSkeleton store={store} />
          </Show>
        </div>
      </Show>
      <TabsContent value={tabs.timeSpan} class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background pb-4">
        <Suspense>
          <TimeSpan store={store} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
