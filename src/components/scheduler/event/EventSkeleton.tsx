import { EventTitle } from "~/components/scheduler/event/Event";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

export default function EventSkeleton() {
  return (
    <Card
      // style={{ "background-color": color().bg, border: `2px solid ${color().border}` }}
      // on:dblclick={() => {
      //   if (!(typeof window !== "undefined" && "ontouchstart" in window)) local.handleCheck();
      // }}
      // on:click={() => {
      //   if (typeof window !== "undefined" && "ontouchstart" in window) local.handleCheck();
      // }}
      // {...rest}
      class={cn(
        "event", // needed for linked outline
        "flex flex-col h-full hover:shadow-md transition-shadow overflow-auto",
        // "text-colored-event-foreground",
        // "event relative w-full h-full min-h-min rounded flex flex-col items-center em:p-2 em:pt-1 *:text-center overflow-hidden",
        "outline-2 outline-offset-2 hover:outline-strongLinked hover:outline"
        // if hidden, make the event more transparent
      )}
    >
      <Skeleton class="h-full w-full">
        <CardHeader class="flex-row w-full p-3 relative space-y-0">
          <EventTitle title={""} />
        </CardHeader>
        <CardContent></CardContent>
      </Skeleton>
    </Card>
  );
}
