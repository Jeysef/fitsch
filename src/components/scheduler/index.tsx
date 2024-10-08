import { useSubmission } from "@solidjs/router";
import { createEffect } from "solid-js";
import type ScheduleEvent from "~/components/scheduler/Event";
import { days, type IScheduleData, type ISchedulerSettings } from "~/components/scheduler/types";
import { getStudyCoursesDetailsAction } from "~/server/scraper/actions";
import { getStudyCoursesDetails } from "~/server/scraper/functions";

export interface WorkScheduleProps {
  scheduleSettings: ISchedulerSettings;
  data: IScheduleData;
  event: typeof ScheduleEvent;
}


export default function Scheduler(props: WorkScheduleProps) {
  const { data, scheduleSettings, event } = props;
  const submission = useSubmission(getStudyCoursesDetailsAction);
  createEffect(() => {
    if (submission.result) {
      console.log("🚀 ~ file: index.tsx:17 ~ Scheduler ~ submission:", submission.result)
    }
  })
  return (
    <div
      class="relative grid overflow-auto h-full w-full justify-start"
      style={{
        "grid-template-columns": `max-content repeat(${scheduleSettings.columns}, minmax(5.5rem, 10rem))`,
        "grid-template-rows": `auto repeat(${scheduleSettings.rows}, auto)`,
      }}
    >
      <div class="relative grid grid-rows-subgrid grid-cols-subgrid row-span-full col-span-full border inset-0 h-full w-full isolate">
        <Corner />
        <Heading />
        <Days />
        <Week />
        <ColumnLines />
      </div>
    </div>
  );

  function Heading() {
    return <div class="grid grid-cols-subgrid row-span-1 col-[2/-1] outline-1 sticky top-px outline outline-border z-10 bg-background">
      {scheduleSettings.timeBlocks.map((hour) => (
        <div class="hour border-l flex items-center justify-center [text-align-last:right] p-1">{hour}</div>
      ))}
    </div>;
  }

  function Days() {
    return <div class="grid grid-rows-subgrid row-[2/-1] col-span-1 border-r sticky left-0 z-10 bg-background">
      {days.map((day) => (
        <div class="items-center justify-center p-4 flex border-t">{day}</div>
      ))}
    </div>;
  }

  function Week() {
    return <div class="schedule grid grid-cols-subgrid grid-rows-subgrid row-[2/-1] col-[2/-1] border-l">
      <WeekSchedule data={data} event={event} />
    </div>;
  }

  function ColumnLines() {
    return <div class="grid grid-cols-subgrid row-start-2 -row-end-1 col-[2/-1] select-none">
      {Array.from({ length: scheduleSettings.columns }, (_, i) => (
        <div class="border-l border-dashed" />
      ))}
    </div>;
  }

  function Corner() {
    return <div class="row-span-1 col-span-1 border-r border-b sticky top-0 left-0 z-20 bg-background" />;
  }
}


interface WeekScheduleProps {
  data: IScheduleData;
  event: typeof ScheduleEvent;
}

function WeekSchedule(props: WeekScheduleProps) {
  const { data, event: Event } = props;
  return Object.entries(data).map(([day, dayConfig]) => (
    <div
      class="schedule-row grid grid-cols-subgrid col-span-full py-2 gap-y-2 border-t"
      style={{
        "grid-row": `${dayConfig.row} / span 1`,
        "grid-template-rows": `repeat(${dayConfig.rows}, minmax(0, auto))`,
      }}
    >
      {dayConfig.events.map((event) => (
        <div
          style={{
            "grid-row": `${event.row} / span 1`,
            "grid-column": `${event.colStart} / ${event.colEnd}`,
          }}
        >
          <Event event={event} />
        </div>
      ))}
    </div>
  ));
}

