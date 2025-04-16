import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useI18n } from "~/i18n";
import { SectionHeading, SubSectionHeading } from "./MenuCommonComponents";
import { SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu } from "../ui/sidebar";

export function YearSelectSkeleton() {
  const t = useI18n().t;
  return (
    <>
      <SectionHeading>{t("menu.year.title")}</SectionHeading>
      <Skeleton class="h-9 w-full" />
    </>
  );
}

export function DegreeSelectSkeleton() {
  const t = useI18n().t;
  return (
    <>
      <SectionHeading>{t("menu.degree.title")}</SectionHeading>
      <Skeleton class="h-5 w-3/4 my-1" />
      <Skeleton class="h-5 w-1/2 my-1" />
      <Skeleton class="h-5 w-1/2 my-1" />
    </>
  );
}

export function ProgramSelectSkeleton() {
  const t = useI18n().t;
  return (
    <>
      <SectionHeading>{t("menu.program.title")}</SectionHeading>
      <div class="ml-2">
        <Skeleton class="h-5 w-3/4 my-1" />
      </div>
    </>
  );
}

export function GradeSelectSkeleton() {
  const t = useI18n().t;
  return (
    <>
      <SectionHeading>{t("menu.grade.title")}</SectionHeading>
      <Skeleton class="h-5 w-2/3 my-1" />
      <Skeleton class="h-5 w-3/4 my-1" />
      <Skeleton class="h-5 w-1/2 my-1" />
    </>
  );
}

export function SemesterSelectSkeleton() {
  const t = useI18n().t;
  return (
    <>
      <SectionHeading>{t("menu.semester.title")}</SectionHeading>
      <Skeleton class="h-5 w-1/2 my-1" />
      <Skeleton class="h-5 w-2/3 my-1" />
    </>
  );
}

export function CoursesSelectSkeleton() {
  const t = useI18n().t;
  return (
    <>
      <SectionHeading>{t("menu.courses.title")}</SectionHeading>
      <div class="ml-2">
        <div>
          <SubSectionHeading>{t("menu.courses.COMPULSORY")}</SubSectionHeading>
          <Skeleton class="h-5 w-3/4 my-1" />
          <Skeleton class="h-5 w-2/3 my-1" />
          <Skeleton class="h-5 w-1/2 my-1" />
        </div>
        <div>
          <SubSectionHeading>{t("menu.courses.COMPULSORY_ELECTIVE")}</SubSectionHeading>
          <Skeleton class="h-5 w-2/3 my-1" />
          <Skeleton class="h-5 w-1/2 my-1" />
        </div>
        <div>
          <SubSectionHeading>{t("menu.courses.ELECTIVE")}</SubSectionHeading>
          <Skeleton class="h-5 w-3/4 my-1" />
          <Skeleton class="h-5 w-1/2 my-1" />
        </div>
      </div>
    </>
  );
}

export function SubmitButtonSkeleton() {
  const t = useI18n().t;
  return (
    <Button disabled class="w-full" type="button">
      {t("menu.load")}
    </Button>
  );
}

export function LoadingState() {
  return (
    <form class="h-full relative contents">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <YearSelectSkeleton />
            <SemesterSelectSkeleton />
            <DegreeSelectSkeleton />
            <ProgramSelectSkeleton />
            <GradeSelectSkeleton />
            <CoursesSelectSkeleton />
          </SidebarMenu>
        </SidebarGroup>
        {/* Actions and Settings skeletons could be added here if needed */}
      </SidebarContent>
      <SidebarFooter>
        <SubmitButtonSkeleton />
      </SidebarFooter>
    </form>
  );
}
