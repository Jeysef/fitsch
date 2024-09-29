import WorkSchedule from "~/components/homepage/WorkSchedule";
import { openend } from "~/components/menu/Menu";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";

export default function Home() {
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
        <WorkSchedule />
      </TabsContent>
      <TabsContent value="finalResult" class="w-full h-full !mt-0 pt-2">
        <div class="grid items-center" >
          NOT YET IMPLEMENTED
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
