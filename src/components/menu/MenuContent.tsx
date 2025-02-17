import { trackStore } from "@solid-primitives/deep";
import { useAction } from "@solidjs/router";
import { flatMap, forEach, mapValues } from "lodash-es";
import { ObjectTyped } from "object-typed";
import { type IFormControl, type IFormGroup, type ValidatorFn, createFormControl, createFormGroup } from "solid-forms";
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
  createUniqueId,
  on,
  startTransition,
  useContext,
} from "solid-js";
import { isServer } from "solid-js/web";
import { toast } from "solid-sonner";
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
import { useLocalMenuData } from "~/components/menu/MenuLocalDataProvider";
import { type NavigationSchema, type NavigationSchemaKey, navigationSchema } from "~/components/menu/schema";
import type { SchedulerStore } from "~/components/scheduler/store";
import { Button } from "~/components/ui/button";
import { type tType, useI18n } from "~/i18n";
import { useScheduler } from "~/providers/SchedulerProvider";
import { DEGREE, OBLIGATION, SEMESTER } from "~/server/scraper/enums";
import type { DataProviderTypes, GetStudyCoursesDetailsFunctionConfig, StudyOverview } from "~/server/scraper/types";
import { getStudyCoursesDetailsAction } from "~/server/server-fns/getCourses/actions";
import { getStudyOverviewResource } from "~/server/server-fns/getOverview/resource";
import { type FunctionReturn, isErrorReturn } from "~/server/server-fns/utils/errorHandeler";
import { LoadingState } from "./MenuSkeletons";

type FormGroupValues = { [K in NavigationSchemaKey]: NavigationSchema[K] };
type FormGroupControls = { [K in keyof FormGroupValues]: IFormControl<FormGroupValues[K]> };
type FormGroup = IFormGroup<FormGroupControls, FormGroupValues>;

// ----- Context and Cookie Setup -----
const GroupContext = createContext<FormGroup>();
export const getGroup = () => {
  const group = useContext(GroupContext);
  if (!group) throw new Error("GroupContext not found");
  return group;
};

const DataContext = createContext<Accessor<StudyOverview | undefined>>();
export const getData = () => {
  const data = useContext(DataContext);
  if (!data) throw new Error("DataContext not found");
  return data;
};

// Default values for persistent data and form
const defaultFormValues = {
  semester: SEMESTER.WINTER,
  degree: DEGREE.BACHELOR,
  grade: undefined,
  [OBLIGATION.COMPULSORY]: [],
  [OBLIGATION.COMPULSORY_ELECTIVE]: [],
  [OBLIGATION.ELECTIVE]: [],
};

function useLoadCourses(
  submit: (data: GetStudyCoursesDetailsFunctionConfig) => ReturnType<typeof getStudyCoursesDetailsAction>,
  t: tType,
  store: SchedulerStore
) {
  const loadCourses = (data: GetStudyCoursesDetailsFunctionConfig) => {
    if (!data.courses.length && !data.staleCoursesId?.length) {
      store.courses = [];
      return;
    }
    const submission = submit(data).then((result) => {
      if (isErrorReturn(result)) throw new Error(result.errorMessage);
      return result;
    });
    toast.promise(submission, {
      loading: t("menu.toast.generate.loading"),
      success: t("menu.toast.generate.success"),
      error: t("menu.toast.generate.error"),
    });
  };

  return loadCourses;
}

export default function Wrapper() {
  const { initialConfigSignal } = useLocalMenuData();
  const resource = createResource(initialConfigSignal(), getStudyOverviewResource, { deferStream: false });

  return (
    <>
      <div class="w-44 min-h-full">
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
          <Suspense fallback={<LoadingState />}>
            <Content resource={resource} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}

function Content({
  resource,
}: {
  resource: ResourceReturn<
    FunctionReturn<DataProviderTypes.getStudyOverviewReturn>,
    DataProviderTypes.getStudyOverviewConfig
  >;
}) {
  const { persistentGroupData, setPersistentGroupData, setSubmittedCourses, submittedCourses } = useLocalMenuData();
  const { store } = useScheduler();
  const data = resource[0];
  const cData = createMemo(() => (data.state === "refreshing" ? data.latest : data())) as Accessor<
    DataProviderTypes.getStudyOverviewReturn | undefined
  >;
  const { refetch } = resource[1];
  const submit = useAction(getStudyCoursesDetailsAction);
  const { t, locale } = useI18n();

  const loadCourses = useLoadCourses(submit, t, store);

  // ----- Error Handling -----
  const resolvedData = data();
  if (isErrorReturn(resolvedData)) {
    // wait for toast to initialize
    setTimeout(() => {
      toast.error(resolvedData.errorMessage);
    }, 1000);
    return (
      <Button
        onClick={async () => {
          const res = await refetch();
          if (res && isErrorReturn(res)) {
            toast.error(res.errorMessage);
          }
        }}
        disabled={data.state === "refreshing"}
        class="h-auto flex-col"
      >
        {resolvedData.errorMessage}
        <span class="h-[2ch]" />
        Click to reload menu
      </Button>
    );
  }
  const dataValues = resolvedData?.values;
  if (!dataValues) {
    if (data.state === "refreshing") return <LoadingState />;
    return <Button onClick={() => window.location.reload()}>Unexpected situation, click to reload</Button>;
  }

  // ----- Helpers for Data Submission -----
  const getDataToRefetch = () => {
    const c = group.controls;
    return {
      year: c.year.value?.value,
      language: locale(),
      degree: c.degree.value,
      program: c.program.value,
    } satisfies DataProviderTypes.getStudyOverviewConfig;
  };

  const getDataToSubmit = (makeStale = true) => {
    const c = group.controls;
    const currentCoursesId = makeStale ? store.courses.map((c) => c.detail.id) : [];
    const selectedCourses = flatMap(OBLIGATION, (type) => c[type].value);
    const staleCoursesId = currentCoursesId.filter((id) => selectedCourses.includes(id));
    const courses = selectedCourses.filter((id) => !staleCoursesId.includes(id));
    return {
      language: locale(),
      year: c.year.value.value,
      semester: c.semester.value,
      courses,
      staleCoursesId,
    } satisfies GetStudyCoursesDetailsFunctionConfig;
  };

  // ----- Update Language Effect -----
  createEffect(
    on(locale, (language, _, firstEffect) => {
      if (firstEffect) return false;
      const dataLanguage = cData()?.values.language;
      if (!dataLanguage || dataLanguage === language) return false;
      const newData = startTransition(() => refetch(getDataToRefetch()));
      const toastId = createUniqueId();
      const onRegenerate = () => {
        toast.dismiss(toastId);
        loadCourses(getDataToSubmit(false));
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

  // ----- Form Setup -----
  const validator: <K extends NavigationSchemaKey>(
    name: K,
    value: NavigationSchema[K]
  ) => ReturnType<ValidatorFn<NavigationSchema[K]>> = (name, value) => {
    const returnType = navigationSchema
      .pick({ [name]: true } as { [K in NavigationSchemaKey]: true })
      .safeParse({ [name]: value });
    return returnType.error ? { error: returnType.error } : null;
  };

  const submittedObligation = mapValues(submittedCourses(), (courses) => courses.length > 0 && courses);

  const values: FormGroupValues = {
    year: dataValues.year,
    degree: dataValues.degree,
    program: dataValues.program?.id ?? persistentGroupData()?.program,
    grade: persistentGroupData()?.grade ?? defaultFormValues.grade,
    semester: persistentGroupData()?.semester ?? defaultFormValues.semester,
    ...mapValues(OBLIGATION, (type) => submittedObligation[type] || defaultFormValues[type]),
  };

  const formGroupControls = ObjectTyped.fromEntries(
    ObjectTyped.entries(values).map(
      <K extends keyof FormGroupValues>([key, value]: [K, FormGroupValues[K]]) =>
        [
          key,
          createFormControl(value, {
            required: true,
            validators: (value) => validator(key, value),
          }) as FormGroupControls[K],
        ] as [K, FormGroupControls[K]]
    )
  ) as FormGroupControls;

  const group: FormGroup = createFormGroup(formGroupControls);

  // // TODO: find something better
  createEffect(
    on(
      () => trackStore(group),
      (data) => {
        console.log("🚀 ~ setPersistentGroupData:");
        setPersistentGroupData(data.rawValue);
      }
    )
  );

  // ----- Refetch and Clear Effects -----
  const getFetchableData = () => ({
    year: group.controls.year.value?.value,
    program: group.controls.program.value,
  });

  /** refetch data */
  createRenderEffect(
    on(getFetchableData, (_, __, firstEffect) => {
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
        forEach(OBLIGATION, (type) => group.controls[type].setValue([]));
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

  // ----- Submission Handler -----
  const onSubmit: JSX.EventHandlerUnion<HTMLFormElement, SubmitEvent> | undefined = (e) => {
    e.preventDefault();
    group.markSubmitted(true);
    const dataToSubmit = getDataToSubmit();
    loadCourses(dataToSubmit);
    setSubmittedCourses(mapValues(OBLIGATION, (type) => group.controls[type].value));
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
        <DataContext.Provider value={data as Accessor<DataProviderTypes.getStudyOverviewReturn | undefined>}>
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
