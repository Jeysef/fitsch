import { useSubmission } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
import { openend } from "~/components/menu/Menu";
import Scheduler from "~/components/scheduler";
import { createColumns, SchedulerStore } from "~/components/scheduler/store2";
import { days } from "~/components/scheduler/types";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { getStudyCoursesDetailsAction } from "~/server/scraper/actions";




export default function Home() {
  const data = useSubmission(getStudyCoursesDetailsAction)
  const formatTime = (start: { hour: number, minute: number }, end: { hour: number, minute: number }) =>
    `${start.hour.toString().padStart(2, '0')}:${start.minute.toString().padStart(2, '0')} - ${end.hour.toString().padStart(2, '0')}:${end.minute.toString().padStart(2, '0')}`

  const schedulerStore = new SchedulerStore({
    columns: createColumns({ start: { hour: 7, minute: 0 }, step: { hour: 1, minute: 0 }, end: { hour: 20, minute: 0 }, getTimeHeader: formatTime }),
    rows: days.map(day => ({ title: day, day })),
  })

  const [store, setStore] = createSignal({
    settings: schedulerStore.settings,
    data: schedulerStore.getEmptyData(),
  })


  createEffect(() => {
    if (!data.result) return;
    console.log("🚀 ~ file: index.tsx:35 ~ createEffect ~ data.result:", data.result)
    const newData = schedulerStore.parseCourses(data.result);
    setStore(prev => ({ ...prev, data: newData }));
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
        <Scheduler store={store()} />
      </TabsContent>
      <TabsContent value="finalResult" class="w-full h-full !mt-0 pt-2">
        <div class="grid items-center" >
          {store().data.TUE.events.length}
        </div>
      </TabsContent>
      <TabsContent value="rules" class="w-full h-full !mt-0 pt-2">
        <div class="grid items-center" >
          NOT YET IMPLEMENTED
        </div>
      </TabsContent>
    </Tabs>
  )
}

