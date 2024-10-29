import { useSubmission } from "@solidjs/router";
import { ObjectTyped } from "object-typed";
import { createEffect, createMemo, type Accessor } from "solid-js";
import { createMutable } from "solid-js/store";
import TimeSpan from "~/components/homepage/TimeSpan";
import { openend } from "~/components/menu/Menu";
import Scheduler from "~/components/scheduler";
import { createColumns, SchedulerStore, type Event, type ParsedDayData } from "~/components/scheduler/store";
import { days } from "~/components/scheduler/types";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { getStudyCoursesDetailsAction } from "~/server/scraper/actions";
import { DAY, LECTURE_TYPE } from "~/server/scraper/enums";


const formatTime = (start: { hour: number, minute: number }, end: { hour: number, minute: number }) =>
  `${start.hour.toString().padStart(2, '0')}:${start.minute.toString().padStart(2, '0')} - ${end.hour.toString().padStart(2, '0')}:${end.minute.toString().padStart(2, '0')}`
const formatDay = (day: DAY) => ({ title: day, day })
const filter = (event: Event) => !(event.note || event.type === LECTURE_TYPE.EXAM)

const schedulerStore = new SchedulerStore({
  columns: createColumns({ start: { hour: 7, minute: 0 }, step: { hour: 1, minute: 0 }, end: { hour: 20, minute: 0 }, getTimeHeader: formatTime }),
  rows: days.map(formatDay),
  filter
})

export default function Home() {
  const data = useSubmission(getStudyCoursesDetailsAction)

  const store = createMutable(schedulerStore)

  const filteredStoreData: Accessor<ParsedDayData> = createMemo(() => ObjectTyped.fromEntries(ObjectTyped.entries((store.data)).map(([key, value]) => [key, { ...value, events: value.events.filter((event) => event.event.checked) }])))
  const filteredStore = new Proxy(store, {
    get(store, prop) {
      if (prop === 'data') {
        // Return filtered data when accessing data property
        return filteredStoreData()
      }
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
    store.courses = data.result
    console.log("🚀 ~ file: index.tsx:46 ~ createEffect ~ filteredStore.courses:", filteredStore.courses)
    // filteredStore.data = ObjectTyped.fromEntries(ObjectTyped.entries(unwrap(store.data)).map(([key, value]) => [key, { ...value, events: value.events.filter((event) => event.event.checked) }]))
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
      <TabsContent value="workSchedule" class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background">
        <Scheduler store={store} />
      </TabsContent>
      <TabsContent value="finalResult" class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background">
        <Scheduler store={filteredStore} />
      </TabsContent>
      <TabsContent value="rules" class="w-full h-full !mt-0 overflow-auto border-t-4 border-t-background">
        <TimeSpan store={filteredStore} />
      </TabsContent>
    </Tabs>
  )
}

