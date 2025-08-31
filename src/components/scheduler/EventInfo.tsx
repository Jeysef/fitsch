// import { Clock, Users, Link, MapPin, Info, Calendar, BookOpen } from 'lucide-solid';
import BookOpen from "lucide-solid/icons/book-open";
import Calendar from "lucide-solid/icons/calendar";
import Clock from "lucide-solid/icons/clock";
import Info from "lucide-solid/icons/info";
import Link from "lucide-solid/icons/link";
import MapPin from "lucide-solid/icons/map-pin";
import Trash2 from "lucide-solid/icons/trash-2";
import Users from "lucide-solid/icons/users";
import { createSignal, Show, type Accessor, type ParentComponent } from "solid-js";
import type { ScheduleEvent } from "~/components/scheduler/event/types";
import Text from "~/components/typography/text";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import type { CourseDetail } from "~/server/scraper/types/types";

interface EventPopupProps {
  event: ScheduleEvent;
  courseDetail: Accessor<CourseDetail>;
  onHide: () => void;
}

const EventPopup: ParentComponent<EventPopupProps> = (props) => {
  const { t } = useI18n();
  const { timeSpan, room, type, capacity, lectureGroup, groups, info, note, weeks, hidden } = props.event;

  const [courseDetail, setCourseDetail] = createSignal<CourseDetail>(undefined!);

  const onChangeOpen = (isOpen: boolean) => {
    if (!isOpen) return;
    if (courseDetail()) return;
    setCourseDetail(props.courseDetail());
  };

  return (
    <Popover flip placement="left-start" onOpenChange={onChangeOpen}>
      <PopoverTrigger
        on:dblclick={(e) => e.stopPropagation()}
        class={cn(
          "relative",
          note &&
            "after:absolute after:-top-1 after:-right-1 after:w-2 after:h-2 after:rounded-full after:bg-red-500 after:self-start"
        )}
      >
        {props.children}
      </PopoverTrigger>
      <PopoverContent class="w-80">
        <Show when={courseDetail()}>
          {/* Header */}
          <div class="space-y-1 mb-4 mr-8">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold">{courseDetail().abbreviation}</h3>
              <Badge variant="outline">{t(`course.detail.type.${type}`)}</Badge>
            </div>
            <p class="text-sm text-muted-foreground line-clamp-2">{courseDetail().name}</p>
          </div>

          {/* Content */}
          <div class="space-y-4">
            {/* hide button */}
            <div>
              <Button variant="ghost" size="sm" class="text-sm space-x-2 -ml-3" onClick={props.onHide}>
                <Trash2 class="h-4 w-4" />
                <Text variant="smallText" class="text-destructive">
                  {hidden ? t("course.detail.popover.unhide") : t("course.detail.popover.hide")}
                </Text>
              </Button>
            </div>

            {/* Time Information */}
            <div class="flex items-start space-x-2">
              <Clock class="h-4 w-4 mt-1 text-muted-foreground" />
              <div class="flex-1">
                <p class="text-sm font-medium">{t("course.detail.popover.time")}</p>
                <p class="text-sm text-muted-foreground">
                  {timeSpan.start.formatted()} - {timeSpan.end.formatted()}
                </p>
              </div>
            </div>

            {/* Location */}
            <div class="flex items-start space-x-2">
              <MapPin class="h-4 w-4 mt-1 text-muted-foreground" />
              <div class="flex-1">
                <p class="text-sm font-medium">{t("course.detail.popover.room")}</p>
                <p class="text-sm text-muted-foreground">{room}</p>
              </div>
            </div>

            {/* Capacity */}
            <div class="flex items-start space-x-2">
              <Users class="h-4 w-4 mt-1 text-muted-foreground" />
              <div class="flex-1">
                <p class="text-sm font-medium">{t("course.detail.popover.capacity")}</p>
                <p class="text-sm text-muted-foreground">{capacity}</p>
              </div>
            </div>

            {/* Groups */}
            <Show when={lectureGroup?.length > 0 || groups}>
              <div class="flex items-start space-x-2">
                <BookOpen class="h-4 w-4 mt-1 text-muted-foreground" />
                <div class="flex-1">
                  <p class="text-sm font-medium">{t("course.detail.popover.groups")}</p>
                  <div class="flex flex-wrap gap-1">
                    {lectureGroup?.map((group) => (
                      <Badge variant="secondary" class="text-xs">
                        {group}
                      </Badge>
                    ))}
                    {groups && (
                      <Badge variant="secondary" class="text-xs">
                        {groups}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Show>

            {/* Weeks */}
            <div class="flex items-start space-x-2">
              <Calendar class="h-4 w-4 mt-1 text-muted-foreground" />
              <div class="flex-1">
                <p class="text-sm font-medium">{t("course.detail.popover.weeks")}</p>
                <p class="text-sm text-muted-foreground">
                  {typeof weeks.weeks === "string" ? weeks.weeks : weeks.weeks.join(", ")}
                  {weeks.parity && ` (${t(`course.detail.weeks.${weeks.parity}`)})`}
                  {weeks.calculated && ` (${t("course.detail.popover.computed")})`}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <Show when={info || note}>
              <div class="flex items-start space-x-2">
                <Info class="h-4 w-4 mt-1 text-muted-foreground" />
                <div class="flex-1">
                  <p class="text-sm font-medium">{t("course.detail.popover.info")}</p>
                  {info && <p class="text-sm text-muted-foreground">{info}</p>}
                  {note && <p class="text-sm text-destructive italic">{note}</p>}
                </div>
              </div>
            </Show>

            {/* Course Link */}
            <Show when={courseDetail().url}>
              <a
                href={courseDetail().url}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-2 text-sm mt-2"
              >
                <Link class="h-4 w-4" />
                <span>{t("course.detail.popover.detail")}</span>
              </a>
            </Show>
            <Show when={import.meta.env.DEV}>
              {/* copy event to clipboard */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(props.event, null, 2));
                }}
              >
                Copy Event
              </Button>
            </Show>
          </div>
        </Show>
      </PopoverContent>
    </Popover>
  );
};

export default EventPopup;
