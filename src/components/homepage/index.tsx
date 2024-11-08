import { trackStore } from "@solid-primitives/deep";
import { makePersisted } from "@solid-primitives/storage";
import { useSubmission } from "@solidjs/router";
import { mapValues, merge } from "lodash-es";
import { createEffect, createMemo, createSignal, untrack } from "solid-js";
import { createMutable, unwrap } from "solid-js/store";
import TimeSpanPage from "~/components/homepage/TimeSpan";
import { openend } from "~/components/menu/Menu";
import Scheduler from "~/components/scheduler";
import { days } from "~/components/scheduler/constants";
import { createColumns, recreateColumns, SchedulerStore } from "~/components/scheduler/store";
import { TimeSpan } from "~/components/scheduler/time";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { getStudyCoursesDetailsAction } from "~/server/scraper/actions";
import { DAY, LECTURE_TYPE } from "~/server/scraper/enums";
import type { MCourseLecture } from "~/server/scraper/lectureMutator";


const formatTime = (start: { hour: number, minute: number }, end: { hour: number, minute: number }) =>
  `${start.hour.toString().padStart(2, '0')}:${start.minute.toString().padStart(2, '0')} - ${end.hour.toString().padStart(2, '0')}:${end.minute.toString().padStart(2, '0')}`
const formatDay = (day: DAY) => ({ title: day, day })
const filter = (event: MCourseLecture) => !(event.note || event.type === LECTURE_TYPE.EXAM)
const schedulerStore = new SchedulerStore({
  columns: createColumns({ start: { hour: 7, minute: 0 }, step: { hour: 1, minute: 0 }, end: { hour: 20, minute: 0 }, getTimeHeader: formatTime }),
  rows: days.map(formatDay),
}, filter)

export default function Home() {
  const data = useSubmission(getStudyCoursesDetailsAction)
  const [persistedStore, setPersistedStore] = makePersisted(createSignal(schedulerStore), { name: 'schedulerStore', })

  const untrackedStore = untrack(persistedStore);
  untrackedStore.settings.columns = recreateColumns(untrackedStore.settings.columns)
  untrackedStore.courses.map(course => Object.values(course.data).forEach(dayData => { dayData.events.forEach(event => event.event.timeSpan = TimeSpan.fromPlain(event.event.timeSpan)) }))
  console.log("🚀 ~ file: index.tsx:36 ~ Home ~ untrackedStore:", untrackedStore)
  const store = createMutable(merge(schedulerStore, untrackedStore));

  const checkedDataMemo = createMemo(() => {
    const checkedData = mapValues(unwrap(store.checkedData), (dayData) => ({
      ...dayData, // unlink dayData
      // link events to the original store except for the row
      events: dayData.events.map(e => ({ ...e, row: unwrap(e.row) }))
    }))
    return store.sortData(checkedData)
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


  createEffect(() => {
    if (!data.result) return;
    store.newCourses = data.result
  })

  createEffect(() => {
    const updatedStore = trackStore(store)
    console.log("🚀 ~ file: index.tsx:75 ~ createEffect ~ updatedStore:", updatedStore)
    // console.log("🚀 ~ file: index.tsx:96 ~ createEffect ~ updatedStore:", unwrap(updatedStore))
    // setPersistedStore(unwrap(updatedStore))
  })


  return (
    <Tabs as="main" defaultValue="account" class="items-center h-full w-full overflow-auto flex flex-col">
      {/* not the best solution, coz it shrinks it from the right side too */}
      <TabsList class={cn("gap-x-4 h-14 w-auto  bg-background flex-shrink-0 overflow-auto justify-start", { "left-32 max-w-[calc(100%-8rem)] -translate-x-32": !openend() })}>
        <TabsTrigger class="w-auto whitespace-break-spaces" value="workSchedule">Pracovní rozvrh</TabsTrigger>
        <TabsTrigger class="w-auto whitespace-break-spaces" value="finalResult">Výsledný rozvrh</TabsTrigger>
        <TabsTrigger class="w-auto whitespace-break-spaces" value="rules">Rozsahy</TabsTrigger>
        <TabsIndicator variant="underline" />
      </TabsList>
      <TabsContent value="workSchedule" class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background px-4">
        <Scheduler store={store} />
      </TabsContent>
      <TabsContent value="finalResult" class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background px-4">
        <Scheduler store={filteredStore} />
      </TabsContent>
      <TabsContent value="rules" class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background px-4">
        <TimeSpanPage store={filteredStore} />
      </TabsContent>
    </Tabs>
  )
}

