import { trackStore } from "@solid-primitives/deep";
import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { useAction } from "@solidjs/router";
import { mapValues } from "lodash-es";
import {
  type Accessor,
  ErrorBoundary,
  type JSX,
  type ResourceReturn,
  Suspense,
  batch,
  createContext,
  createEffect,
  createMemo,
  createRenderEffect,
  createResource,
  createSignal,
  createUniqueId,
  on,
  startTransition,
  useContext,
} from "solid-js";
import { isServer } from "solid-js/web";
import { Actions } from "~/components/menu/MenuActions";
import {
  CoursesSelect,
  DegreeSelect,
  GradeSelect,
  ProgramSelect,
  SemesterSelect,
  SubmitButton,
  YearSelect,
} from "~/components/menu/MenuComponents";
import ErrorFallback from "~/components/menu/MenuErrorFallback";
import { type NavigationSchema, navigationSchema } from "~/components/menu/schema";
import Loader from "~/components/ui/loader";
import { useI18n } from "~/i18n";
import {
  type IFormControl,
  type IFormGroup,
  type ValidatorFn,
  createFormControl,
  createFormGroup,
} from "~/packages/solid-forms/";
import { toast } from "~/packages/solid-sonner";
import { getStudyCoursesDetailsAction } from "~/server/scraper/actions";
import { DEGREE, SEMESTER } from "~/server/scraper/enums";
import { getStudyOverview } from "~/server/scraper/functions";
import type {
  DataProviderTypes,
  GradeKey,
  StudyCourseObligation,
  StudyOverview,
  StudyOverviewYear,
  StudyProgram,
} from "~/server/scraper/types";

const GroupContext =
  createContext<IFormGroup<{ [K in keyof Required<NavigationSchema>]: IFormControl<NavigationSchema[K]> }>>();
export const getGroup = () => useContext(GroupContext)!;
const DataContext = createContext<Accessor<StudyOverview | undefined>>();
export const getData = () => useContext(DataContext)!;
/**
 * Will be prolonged every time updated
 */
const monthCookie = cookieStorage.withOptions({
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  sameSite: "Strict",
});

export default function Wrapper() {
  // defer, so that the loading is not shown on client
  const [persistentGroupData, setPersistentGroupData] = makePersisted(
    createSignal<{ [K in keyof Required<NavigationSchema>]: NavigationSchema[K] }>(),
    { name: "groupData", storage: monthCookie }
  );
  const [submittedCourses, setSubmittedCourses] = makePersisted(
    createSignal<Record<StudyCourseObligation, string[]>>({ compulsory: [], voluntary: [] }),
    { name: "submittedCourses", storage: monthCookie }
  );
  const locale = useI18n().locale;
  const initialConfig: DataProviderTypes.getStudyOverviewConfig = {
    language: locale(),
    year: persistentGroupData()?.year?.value,
    degree: persistentGroupData()?.degree,
    program: persistentGroupData()?.program,
  };
  const resource = createResource(initialConfig, getStudyOverview, { deferStream: true });

  return (
    <div class="w-44 space-y-2">
      {/* in future replace with skeleton or deferStream on resource */}
      <ErrorBoundary
        fallback={(error, reset) => (
          <ErrorFallback
            error={error}
            reset={async () => {
              await resource[1].refetch();
              reset();
            }}
          />
        )}
      >
        <Suspense fallback={<Loader />}>
          <Content resource={resource} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
  function Content({ resource }: { resource: ResourceReturn<StudyOverview, DataProviderTypes.getStudyOverviewConfig> }) {
    const data = resource[0];
    const cData = createMemo(() => (data.state === "refreshing" ? data.latest : data()));
    const { refetch, mutate } = resource[1];
    const _submit = useAction(getStudyCoursesDetailsAction);
    const { t } = useI18n();

    const submit: typeof _submit = (data) => {
      const submission = _submit(data);
      toast.promise(submission, {
        loading: t("menu.toast.generate.loading"),
        success: t("menu.toast.generate.success"),
        error: t("menu.toast.generate.error"),
      });
      return submission;
    };

    const getDataToRefetch = () => {
      const c = group.controls;
      return {
        year: c.year.value?.value,
        language: locale(),
        degree: c.degree.value,
        program: c.program.value,
      } satisfies DataProviderTypes.getStudyOverviewConfig;
    };
    const getDataToSubmit = () => {
      const c = group.controls;
      return {
        language: locale(),
        year: c.year.value!.value,
        semester: c.semester.value,
        courses: [...c.coursesCompulsory.value, ...c.coursesVoluntary.value].map((id) => ({ courseId: id })),
      } satisfies DataProviderTypes.getStudyCoursesDetailsConfig;
    };

    createEffect(
      on(locale, (language, _, firstEffect) => {
        if (firstEffect) return false;
        const dataLanguage = cData()?.values.language;
        if (!dataLanguage || dataLanguage === language) return false;
        const newData = startTransition(() => refetch(getDataToRefetch()));
        const toastId = createUniqueId();
        const onRegenerate = () => {
          toast.dismiss(toastId);
          submit(getDataToSubmit());
        };
        toast.promise(newData, {
          loading: t("menu.toast.languageChanged.loading"),
          success: t("menu.toast.languageChanged.success"),
          error: t("menu.toast.languageChanged.error"),
          description: t("menu.toast.languageChanged.description", { language: t(`language.${language}`) }),
          action: { label: t("menu.load"), onClick: onRegenerate },
          id: toastId,
          duration: 5000,
        });
        return false;
      }),
      true
    );

    const validator: <K extends keyof NavigationSchema>(
      name: K,
      value: NavigationSchema[K]
    ) => ReturnType<ValidatorFn<NavigationSchema[K]>> = (name, value) => {
      const returnType = navigationSchema
        .pick({ [name]: true } as { [K in keyof NavigationSchema]: true })
        .safeParse({ [name]: value });
      return returnType.error ? { error: returnType.error } : null;
    };

    const defaultValues = {
      semester: SEMESTER.WINTER,
      degree: DEGREE.BACHELOR,
      grade: undefined,
      coursesCompulsory: [],
      coursesVoluntary: [],
    };
    const isSubmittedCompulsory = submittedCourses().compulsory.length > 0;
    const isSubmittedOptional = submittedCourses().voluntary.length > 0;

    const values: { [K in keyof Required<NavigationSchema>]: NavigationSchema[K] } = {
      year: data()?.values.year ?? persistentGroupData()?.year,
      degree: data()?.values.degree ?? persistentGroupData()?.degree ?? defaultValues.degree,
      program: data()?.values.program?.id ?? persistentGroupData()?.program,
      grade: persistentGroupData()?.grade ?? defaultValues.grade,
      semester: persistentGroupData()?.semester ?? defaultValues.semester,
      coursesCompulsory:
        (isSubmittedCompulsory && submittedCourses().compulsory) ||
        persistentGroupData()?.coursesCompulsory ||
        defaultValues.coursesCompulsory,
      coursesVoluntary:
        (isSubmittedOptional && submittedCourses().voluntary) ||
        persistentGroupData()?.coursesVoluntary ||
        defaultValues.coursesVoluntary,
    };

    const group = createFormGroup({
      year: createFormControl<StudyOverviewYear | undefined>(values.year, {
        required: true,
        validators: validator.bind(null, "year"),
      }),
      degree: createFormControl<DEGREE>(values.degree, { required: true, validators: validator.bind(null, "degree") }),
      program: createFormControl<StudyProgram["id"] | undefined>(values.program, {
        required: true,
        validators: validator.bind(null, "program"),
      }),
      grade: createFormControl<GradeKey>(values.grade, { required: true, validators: validator.bind(null, "grade") }),
      semester: createFormControl<(typeof SEMESTER)[SEMESTER]>(values.semester, {
        required: true,
        validators: validator.bind(null, "semester"),
      }),
      coursesCompulsory: createFormControl<string[]>(values.coursesCompulsory, {
        required: true,
        validators: validator.bind(null, "coursesCompulsory"),
      }),
      coursesVoluntary: createFormControl<string[]>(values.coursesVoluntary, {
        required: true,
        validators: validator.bind(null, "coursesVoluntary"),
      }),
    } satisfies {
      [K in keyof Required<NavigationSchema>]: IFormControl<NavigationSchema[K]>;
    });

    // TODO: find something better
    createEffect(() => {
      setPersistentGroupData(
        mapValues(trackStore(group).controls, (value) => value.rawValue) as {
          [K in keyof Required<NavigationSchema>]: NavigationSchema[K];
        }
      );
    });

    const getFetchableData = () => ({
      year: group.controls.year.value?.value,
      program: group.controls.program.value,
    });

    /** refetch data */
    createRenderEffect(
      on(getFetchableData, (data, _, firstEffect) => {
        if (firstEffect) return false;
        void refetch(getDataToRefetch());
        return false;
      }),
      true
    );

    const clearCoursesDeps = () => ({
      year: group.controls.year.value,
      degree: group.controls.degree.value,
    });
    createRenderEffect(
      on(clearCoursesDeps, (_, __, firstEffect) => {
        if (isServer) return true;
        if (firstEffect) return false;
        batch(() => {
          group.controls.coursesCompulsory.setValue([]);
          group.controls.coursesVoluntary.setValue([]);
        });
        return false;
      }),
      true
    );

    /** Check changed degree grade */
    createRenderEffect(
      on(
        () => group.controls.degree.value,
        (degree, prevDegree) => {
          if (degree && degree === prevDegree) return false;
          const dataProgram = cData()?.data.programs[degree];
          if (!dataProgram || dataProgram.flatMap((e) => [e, ...e.specializations]).length !== 1) return;
          const programId = dataProgram[0].id;
          if (programId !== group.controls.program.value) group.controls.program.setValue(programId);
        }
      )
    );

    const onSubmit: JSX.EventHandlerUnion<HTMLFormElement, SubmitEvent> | undefined = async (e) => {
      e.preventDefault();
      group.markSubmitted(true);
      submit(getDataToSubmit());
      const c = group.controls;
      setSubmittedCourses({ compulsory: c.coursesCompulsory.value, voluntary: c.coursesVoluntary.value });
    };

    return (
      <form onSubmit={onSubmit}>
        <GroupContext.Provider value={group}>
          <DataContext.Provider value={cData}>
            <YearSelect />
            {/* semester up top coz it dosn't change much */}
            <SemesterSelect />
            <DegreeSelect />
            <ProgramSelect />
          </DataContext.Provider>
          <DataContext.Provider value={data}>
            <GradeSelect />
            <Suspense>
              <CoursesSelect />
            </Suspense>
          </DataContext.Provider>
          <Actions />
          <SubmitButton />
        </GroupContext.Provider>
      </form>
    );
  }
}

// function ErrorMessage({ control }: { control: IFormControl<string> }) {
//   const { isTouched, errors } = control;
//   console.log("🚀 ~ file: NavigationContent.tsx:267 ~ ErrorMessage ~ control.errors:", errors, !!errors, isTouched)
//   return (
//     <div>
//       <Show when={isTouched}>
//         <small><Dynamic component={(errors?.error as ZodError<NavigationSchema>)?.message} /></small>
//       </Show>
//     </div>
//   )
// }
