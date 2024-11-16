import { trackStore } from "@solid-primitives/deep";
import { makePersisted } from "@solid-primitives/storage";
import { useLocation, useNavigate, useSubmission } from "@solidjs/router";
import { merge } from "lodash-es";
import { ObjectTyped } from "object-typed";
import { createComputed, createEffect, createMemo, createSignal, For, on, untrack } from "solid-js";
import { createMutable } from "solid-js/store";
import TimeSpanPage from "~/components/homepage/TimeSpan";
import { openend } from "~/components/menu/Menu";
import Scheduler from "~/components/scheduler";
import { days } from "~/components/scheduler/constants";
import { createColumns, recreateColumns, SchedulerStore } from "~/components/scheduler/store";
import { TimeSpan } from "~/components/scheduler/time";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import { getStudyCoursesDetailsAction } from "~/server/scraper/actions";
import { DAY, LECTURE_TYPE } from "~/server/scraper/enums";
import type { MCourseLecture } from "~/server/scraper/lectureMutator";


const formatTime = (start: { hour: number, minute: number }, end: { hour: number, minute: number }) =>
  `${start.hour.toString().padStart(2, '0')}:${start.minute.toString().padStart(2, '0')} - ${end.hour.toString().padStart(2, '0')}:${end.minute.toString().padStart(2, '0')}`
const formatDay = (day: DAY) => ({ day })
const filter = (event: MCourseLecture) => !(event.note || event.type === LECTURE_TYPE.EXAM)
const schedulerStore = new SchedulerStore({
  columns: createColumns({ start: { hour: 7, minute: 0 }, step: { hour: 1, minute: 0 }, end: { hour: 20, minute: 0 }, getTimeHeader: formatTime }),
  rows: days.map(formatDay),
}, filter)

export default function Home() {
  const { t, locale } = useI18n()
  const data = useSubmission(getStudyCoursesDetailsAction)
  const [persistedStore, setPersistedStore] = makePersisted(createSignal(schedulerStore), { name: 'schedulerStore', })
  const navigate = useNavigate();

  const untrackedStore = untrack(persistedStore);
  untrackedStore.settings.columns = recreateColumns(untrackedStore.settings.columns)
  untrackedStore.courses.map(course => Object.values(course.data).forEach(dayData => { dayData.events.forEach(event => event.event.timeSpan = TimeSpan.fromPlain(event.event.timeSpan)) }))
  const store = createMutable(merge(schedulerStore, untrackedStore));
  // link data to courses
  store.data = store.combineData(store.courses.map(c => c.data))

  const checkedDataMemo = createMemo(() => {
    return store.checkedData;
  })

  const filteredStore = new Proxy(store, {
    get(store, prop) {
      if (prop === 'data') return checkedDataMemo()
      // Forward all other property access to original store
      // @ts-ignore
      return store[prop]
    },
    set(store, prop, value) {
      // Forward all property sets to original store
      // @ts-ignore
      store[prop] = value
      return true
    }
  })

  createComputed(on(() => data.result, (result) => {
    if (!result) return;
    store.newCourses = result
  }), undefined, { name: "addCoursesToStore" })

  createEffect(on(() => trackStore(store), (store, _, firstEffect) => {
    if (firstEffect) return false;
    setPersistedStore(store)
    return false;
  }), true, { name: "persistStore" })

  const location = useLocation();

  // Function to handle tab change
  const handleTabChange = (tab: string) => {
    requestIdleCallback(() => {
      navigate(`#${tab}`, { replace: true });
    }, { timeout: 1000 });
  };

  // Get the initial tab from the URL anchor

  const tabs = {
    workSchedule: "workSchedule",
    resultSchedule: "resultSchedule",
    timeSpan: "timeSpan",
  } as const;

  const initialTab = location.hash.slice(1) || tabs.workSchedule;

  return (
    <Tabs as="nav" defaultValue={initialTab} onChange={handleTabChange} class="items-center h-full w-full overflow-auto flex flex-col">
      {/* not the best solution, coz it shrinks it from the right side too */}
      <TabsList class={cn("gap-x-4 h-14 w-auto  bg-background flex-shrink-0 overflow-auto justify-start", { "left-32 max-w-[calc(100%-8rem)] -translate-x-32": !openend() })}>
        <For each={ObjectTyped.entries(tabs)}>
          {([key, value]) => <TabsTrigger class="w-auto whitespace-break-spaces" value={value}>{t(`scheduler.tabs.${key}`)}</TabsTrigger>}</For>
        <TabsIndicator variant="underline" data-lang={locale()} />{/* data-lang for rerendering */}
      </TabsList>
      <TabsContent value={tabs.workSchedule} as="main" class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background px-4">
        <Scheduler store={store} />
      </TabsContent>
      <TabsContent value={tabs.resultSchedule} as="main" class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background px-4">
        <Scheduler store={filteredStore} />
      </TabsContent>
      <TabsContent value={tabs.timeSpan} as="main" class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background px-4 pb-4">
        <TimeSpanPage store={filteredStore} />
      </TabsContent>
    </Tabs>
  )
}

