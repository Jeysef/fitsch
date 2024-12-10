import { trackStore } from "@solid-primitives/deep";
import { useLocation, useNavigate, useSubmission } from "@solidjs/router";
import { ObjectTyped } from "object-typed";
import { For, createComputed, createEffect, createMemo, on } from "solid-js";
import TimeSpanPage from "~/components/homepage/TimeSpan";
import { openend } from "~/components/menu/MenuBase";
import Scheduler from "~/components/scheduler";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import { useScheduler } from "~/providers/SchedulerProvider";
import { getStudyCoursesDetailsAction } from "~/server/scraper/actions";

export default function Home() {
  const { t, locale } = useI18n();
  const data = useSubmission(getStudyCoursesDetailsAction);
  const { store, setPersistedShedulerStore } = useScheduler();
  const navigate = useNavigate();

  const checkedDataMemo = createMemo(() => {
    return store.checkedData;
  });

  const filteredStore = new Proxy(store, {
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

  createComputed(
    on(
      () => data.result,
      (result) => {
        if (!result) return;
        store.newCourses = result;
      }
    ),
    undefined,
    { name: "addCoursesToStore" }
  );

  createEffect(
    on(
      () => trackStore(store),
      (store, _, firstEffect) => {
        if (firstEffect) return false;
        setPersistedShedulerStore(store);
        return false;
      }
    ),
    true,
    { name: "persistStore" }
  );

  const location = useLocation();

  // Function to handle tab change
  const handleTabChange = (tab: string) => {
    requestIdleCallback(
      () => {
        navigate(`#${tab}`, { replace: true });
      },
      { timeout: 1000 }
    );
  };

  // Get the initial tab from the URL anchor

  const tabs = {
    workSchedule: "workSchedule",
    resultSchedule: "resultSchedule",
    timeSpan: "timeSpan",
  } as const;

  const initialTab = location.hash.slice(1) || tabs.workSchedule;

  return (
    <Tabs
      as="nav"
      defaultValue={initialTab}
      onChange={handleTabChange}
      class="items-center h-full w-full overflow-auto flex flex-col"
    >
      {/* not the best solution, coz it shrinks it from the right side too */}
      <TabsList
        class={cn("h-14 max-w-full w-auto bg-background flex-shrink-0 overflow-auto justify-start z-0", {
          "-ml-16 max-w-[calc(100%+64px)]": openend(),
        })}
      >
        <div class="w-14 -left-2 h-full box-content bg-background shrink-0 z-20 sticky" />
        <div class="flex gap-x-4 h-full items-center">
          <For each={ObjectTyped.entries(tabs)}>
            {([key, value]) => (
              <TabsTrigger class="w-auto whitespace-break-spaces" value={value}>
                {t(`scheduler.tabs.${key}`)}
              </TabsTrigger>
            )}
          </For>
        </div>
        <TabsIndicator variant="underline" data-lang={locale()} />
        {/* data-lang for rerendering */}
      </TabsList>
      <TabsContent
        value={tabs.workSchedule}
        as="main"
        class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background"
      >
        <Scheduler store={store} />
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
        <TimeSpanPage store={filteredStore} />
      </TabsContent>
    </Tabs>
  );
}
