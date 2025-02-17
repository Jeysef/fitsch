import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useI18n } from "~/i18n";
import { SectionHeading, SubSectionHeading } from "./MenuCommonComponents";

export function YearSelectSkeleton() {
  const t = useI18n().t;
  return (
    <div class="">
      <SectionHeading>{t("menu.year.title")}</SectionHeading>
      <Skeleton class="h-9 w-full" />
    </div>
  );
}

export function DegreeSelectSkeleton() {
  const t = useI18n().t;
  return (
    <div class="">
      <SectionHeading>{t("menu.degree.title")}</SectionHeading>
      <Skeleton class="h-5 w-3/4 my-1" />
      <Skeleton class="h-5 w-1/2 my-1" />
      <Skeleton class="h-5 w-1/2 my-1" />
    </div>
  );
}

export function ProgramSelectSkeleton() {
  const t = useI18n().t;
  return (
    <div class="">
      <SectionHeading>{t("menu.program.title")}</SectionHeading>
      <div class="ml-2">
        <Skeleton class="h-5 w-3/4 my-1" />
      </div>
    </div>
  );
}

export function GradeSelectSkeleton() {
  const t = useI18n().t;
  return (
    <div class="">
      <SectionHeading>{t("menu.grade.title")}</SectionHeading>
      <Skeleton class="h-5 w-2/3 my-1" />
      <Skeleton class="h-5 w-3/4 my-1" />
      <Skeleton class="h-5 w-1/2 my-1" />
    </div>
  );
}

export function SemesterSelectSkeleton() {
  const t = useI18n().t;
  return (
    <div class="">
      <SectionHeading>{t("menu.semester.title")}</SectionHeading>
      <Skeleton class="h-5 w-1/2 my-1" />
      <Skeleton class="h-5 w-2/3 my-1" />
    </div>
  );
}

export function CoursesSelectSkeleton() {
  const t = useI18n().t;
  return (
    <div class="">
      <SectionHeading>{t("menu.courses.title")}</SectionHeading>
      <div class="ml-2">
        <div class="">
          <SubSectionHeading>{t("menu.courses.COMPULSORY")}</SubSectionHeading>
          <Skeleton class="h-5 w-3/4 my-1" />
          <Skeleton class="h-5 w-2/3 my-1" />
          <Skeleton class="h-5 w-1/2 my-1" />
        </div>
        <div class="">
          <SubSectionHeading>{t("menu.courses.COMPULSORY_ELECTIVE")}</SubSectionHeading>
          <Skeleton class="h-5 w-2/3 my-1" />
          <Skeleton class="h-5 w-1/2 my-1" />
        </div>
        <div class="">
          <SubSectionHeading>{t("menu.courses.ELECTIVE")}</SubSectionHeading>
          <Skeleton class="h-5 w-3/4 my-1" />
          <Skeleton class="h-5 w-1/2 my-1" />
        </div>
      </div>
    </div>
  );
}

export function SubmitButtonSkeleton() {
  const t = useI18n().t;
  return (
    <Button disabled class="w-full !mt-8 absolute bottom-0" type="button">
      {t("menu.load")}
    </Button>
  );
  // return <Skeleton class="h-10 w-full mt-8 absolute bottom-0" />;
}

export function LoadingState() {
  return (
    <form class="h-full relative">
      <YearSelectSkeleton />
      <SemesterSelectSkeleton />
      <DegreeSelectSkeleton />
      <ProgramSelectSkeleton />
      <GradeSelectSkeleton />
      <CoursesSelectSkeleton />
      <SubmitButtonSkeleton />
    </form>
  );
}
