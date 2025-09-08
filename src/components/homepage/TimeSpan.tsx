import ChevronRight from "lucide-solid/icons/chevron-right";
import { createMemo, For, Index, Show } from "solid-js";
import { getValidityColor, VALIDITY } from "~/components/homepage/utils";
import { typographyVariants } from "~/components/typography";
import Text from "~/components/typography/text";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitleLink } from "~/components/ui/card";
import type { LECTURE_TYPE } from "~/enums/enums";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import type { Course } from "~/store/store.types";
import type { AdaptedSchedulerStore } from "~/store/storeAdapter";

export interface TimeSpanProps {
  store: AdaptedSchedulerStore;
}

export default function TimeSpan(props: TimeSpanProps) {
  const { t } = useI18n();
  const fallback = (
    <Text variant="largeText" class="text-center">
      {t("scheduler.timeSpan.empty")}
    </Text>
  );
  const coursesTimeSpan = createMemo(() => props.store.coursesTimeSpan);
  return (
    <div
      class="overflow-x-auto w-full px-4 grid grid-cols-[repeat(auto-fit,minmax(20rem,56rem))] gap-y-4 gap-x-8"
      style={{ "justify-content": "safe center" }}
    >
      <Index each={props.store.courses} fallback={fallback}>
        {(course) => <TimeSpanCourse course={course()} courseTimeSpan={coursesTimeSpan()[course().detail.id]} />}
      </Index>
    </div>
  );
}

function TimeSpanCourse(props: {
  course: Course;
  courseTimeSpan: { validity: VALIDITY; courseData: Record<LECTURE_TYPE, number> };
}) {
  const { t } = useI18n();

  return (
    <Card class="overflow-hidden">
      <CardHeader class="bg-muted space-y-0 relative">
        <div class={`absolute top-0 left-0 bottom-0 w-1 ${getValidityColor(props.courseTimeSpan.validity)} `} />
        <CardTitleLink
          href={props.course.detail.url}
          class={cn(
            buttonVariants({ variant: "link" }),
            typographyVariants({ variant: "h4" }),
            "justify-start text-card-foreground p-0"
          )}
        >
          {props.course.detail.abbreviation} <ChevronRight size={20} />
        </CardTitleLink>
        <CardDescription class="text-accent-foreground !mt-0 !mb-4">{props.course.detail.name}</CardDescription>
        <For each={props.course.detail.timeSpanText}>
          {(hours) => (
            <Text variant="smallText" class="text-sm text-muted-foreground">
              {hours}
            </Text>
          )}
        </For>
      </CardHeader>
      <CardContent class="pt-4">
        <Show
          when={Object.keys(props.course.metrics).length}
          fallback={
            <Text variant="smallText" class="text-muted-foreground">
              {t("scheduler.timeSpan.emptyCourse")}
            </Text>
          }
        >
          <h3 class="text-sm tracking-wider mb-3">{t("scheduler.timeSpan.hoursAWeek")}</h3>
          <div class="space-y-2">
            <div class="grid grid-cols-[repeat(3,_minmax(min-content,_auto)),1fr] gap-x-4 items-center justify-start overflow-auto">
              <For each={Object.entries(props.course.metrics)}>
                {([type, { weeks, weeklyLectures }]) => (
                  <>
                    <div class="flex items-center gap-2">
                      <div
                        class={`w-2 h-2 rounded-full shrink-0 ${getValidityColor(props.courseTimeSpan.courseData[type as LECTURE_TYPE] === weeklyLectures)}`}
                      />
                      <Text variant="smallText" class="text-inherit text-sm capitalize">
                        {t(`scheduler.timeSpan.type.${type as LECTURE_TYPE}`)}
                      </Text>
                    </div>
                    <Text variant="smallText" class="text-inherit text-sm">
                      {t("scheduler.timeSpan.weekly", { hours: weeklyLectures })}
                    </Text>
                    <span class="text-sm font-medium">
                      <Show when={props.courseTimeSpan.courseData[type as LECTURE_TYPE] !== weeklyLectures}>
                        {t("scheduler.timeSpan.selected", {
                          selected: props.courseTimeSpan.courseData[type as LECTURE_TYPE] || 0,
                        })}
                      </Show>
                    </span>
                    <Text variant="smallText" class="text-muted-foreground w-full flex justify-end  text-sm">
                      {t("scheduler.timeSpan.weeks", { weeks })}
                    </Text>
                  </>
                )}
              </For>
            </div>
          </div>
        </Show>
      </CardContent>
    </Card>
  );
}
