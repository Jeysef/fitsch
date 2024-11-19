// import { Clock, Users, Link, MapPin, Info, Calendar, BookOpen } from 'lucide-solid';
import BookOpen from "lucide-solid/icons/book-open";
import Calendar from "lucide-solid/icons/calendar";
import Clock from "lucide-solid/icons/clock";
import Info from "lucide-solid/icons/info";
import Link from "lucide-solid/icons/link";
import MapPin from "lucide-solid/icons/map-pin";
import Users from "lucide-solid/icons/users";
import type { JSX } from "solid-js";
import type { Event } from "~/components/scheduler/types";
import { Badge } from "~/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { useI18n } from "~/i18n";

const EventPopup = (props: { event: Event; children: JSX.Element }) => {
  const { t } = useI18n();
  const { courseDetail, timeSpan, room, type, capacity, lectureGroup, groups, info, note, weeks } = props.event;

  return (
    <Popover>
      <PopoverTrigger>{props.children}</PopoverTrigger>
      <PopoverContent class="w-80">
        {/* Header */}
        <div class="space-y-1 mb-4 mr-8">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold">{courseDetail.abbreviation}</h3>
            <Badge variant="outline">{t(`course.detail.type.${type}`)}</Badge>
          </div>
          <p class="text-sm text-muted-foreground line-clamp-2">{courseDetail.name}</p>
        </div>

        {/* Content */}
        <div class="space-y-4">
          {/* Time Information */}
          <div class="flex items-start space-x-2">
            <Clock class="h-4 w-4 mt-1 text-muted-foreground" />
            <div class="flex-1">
              <p class="text-sm font-medium">{t("course.detail.popover.time")}</p>
              <p class="text-sm text-muted-foreground">
                {timeSpan.start.formatted} - {timeSpan.end.formatted}
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
          {(lectureGroup?.length > 0 || groups) && (
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
          )}

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
          {(info || note) && (
            <div class="flex items-start space-x-2">
              <Info class="h-4 w-4 mt-1 text-muted-foreground" />
              <div class="flex-1">
                <p class="text-sm font-medium">{t("course.detail.popover.info")}</p>
                {info && <p class="text-sm text-muted-foreground">{info}</p>}
                {note && <p class="text-sm text-muted-foreground italic">{note}</p>}
              </div>
            </div>
          )}

          {/* Course Link */}
          {courseDetail.link && (
            <a
              href={courseDetail.link}
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 mt-2"
            >
              <Link class="h-4 w-4" />
              <span>{t("course.detail.popover.detail")}</span>
            </a>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EventPopup;
