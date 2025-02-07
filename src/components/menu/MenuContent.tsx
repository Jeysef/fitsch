import { trackStore } from "@solid-primitives/deep";
import { cookieStorage, makePersisted } from "@solid-primitives/storage";
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
  createSignal,
  createUniqueId,
  on,
  startTransition,
  useContext,
} from "solid-js";
import { unwrap } from "solid-js/store";
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
import { type NavigationSchema, type NavigationSchemaKey, navigationSchema } from "~/components/menu/schema";
import { Button } from "~/components/ui/button";
import Loader from "~/components/ui/loader";
import { useI18n } from "~/i18n";
import { useScheduler } from "~/providers/SchedulerProvider";
import { getStudyCoursesDetailsAction } from "~/server/scraper/actions";
import { DEGREE, OBLIGATION, SEMESTER } from "~/server/scraper/enums";
import { getStudyOverview } from "~/server/scraper/functions";
import type {
  DataProviderTypes,
  FunctionReturn,
  FunctionReturnError,
  GetStudyCoursesDetailsFunctionConfig,
  StudyOverview,
} from "~/server/scraper/types";

type FormGroupValues = { [K in NavigationSchemaKey]: NavigationSchema[K] };
type FormGroupControls = { [K in keyof FormGroupValues]: IFormControl<FormGroupValues[K]> };
type FormGroup = IFormGroup<FormGroupControls, FormGroupValues>;

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
/**
 * Will be prolonged every time updated
 */
const monthCookie = cookieStorage.withOptions({
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  sameSite: "Strict",
});

const emptyPersistentValue: { [K in keyof Required<NavigationSchema>]: undefined } = {
  year: undefined,
  semester: undefined,
  grade: undefined,
  degree: undefined,
  program: undefined,
  ...mapValues(OBLIGATION, () => undefined),
};

export default function Wrapper() {
  const [persistentGroupData] = makePersisted(
    createSignal<{ [K in keyof Required<NavigationSchema>]: NavigationSchema[K] | undefined }>(emptyPersistentValue),
    { name: "groupData", storage: monthCookie }
  );
  // defer, so that the loading is not shown on client
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
}

function Content({
  resource,
}: {
  resource: ResourceReturn<
    FunctionReturn<DataProviderTypes.getStudyOverviewReturn>,
    DataProviderTypes.getStudyOverviewConfig
  >;
}) {
  const [persistentGroupData, setPersistentGroupData] = makePersisted(
    createSignal<{ [K in keyof Required<NavigationSchema>]: NavigationSchema[K] | undefined }>(emptyPersistentValue),
    { name: "groupData", storage: monthCookie }
  );

  const [submittedCourses, setSubmittedCourses] = makePersisted(
    createSignal<Record<OBLIGATION, string[]>>(mapValues(OBLIGATION, () => [])),
    { name: "submittedCourses", storage: monthCookie }
  );
  const { store } = useScheduler();
  const data = resource[0];
  const cData = createMemo(() => (data.state === "refreshing" ? data.latest : data())) as Accessor<
    DataProviderTypes.getStudyOverviewReturn | undefined
  >;
  const { refetch, mutate } = resource[1];
  const submit = useAction(getStudyCoursesDetailsAction);
  const { t, locale } = useI18n();

  const loadCourses = (data: GetStudyCoursesDetailsFunctionConfig) => {
    if (!data.courses.length && !data.staleCoursesId?.length) {
      store.courses = [];
      return;
    }
    const submission = submit(data).then((res) => {
      if (Object.hasOwn(res, "statusCode")) throw new Error("Server error");
      return res;
    });

    toast.promise(submission, {
      loading: t("menu.toast.generate.loading"),
      success: t("menu.toast.generate.success"),
      error: t("menu.toast.generate.error"),
    });
  };

  function isErrorReturn<T>(data: FunctionReturn<T>): data is FunctionReturnError {
    return typeof data === "object" && data !== null && "error" in data && data.error === true;
  }
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
    if (data.state === "refreshing") return <Loader />;
    return <Button onClick={() => window.location.reload()}>Unexpected situation, click to reload</Button>;
  }

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

  const validator: <K extends NavigationSchemaKey>(
    name: K,
    value: NavigationSchema[K]
  ) => ReturnType<ValidatorFn<NavigationSchema[K]>> = (name, value) => {
    const returnType = navigationSchema
      .pick({ [name]: true } as { [K in NavigationSchemaKey]: true })
      .safeParse({ [name]: value });
    return returnType.error ? { error: returnType.error } : null;
  };

  const defaultValues = {
    semester: SEMESTER.WINTER,
    degree: DEGREE.BACHELOR,
    grade: undefined,
    [OBLIGATION.COMPULSORY]: [],
    [OBLIGATION.COMPULSORY_ELECTIVE]: [],
    [OBLIGATION.ELECTIVE]: [],
  };
  const submittedObligation = mapValues(submittedCourses(), (courses) => courses.length > 0 && courses);

  const values: FormGroupValues = {
    year: dataValues.year,
    degree: dataValues.degree,
    program: dataValues.program?.id ?? persistentGroupData()?.program,
    grade: persistentGroupData()?.grade ?? defaultValues.grade,
    semester: persistentGroupData()?.semester ?? defaultValues.semester,
    ...mapValues(OBLIGATION, (type) => submittedObligation[type] || defaultValues[type]),
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
        setPersistentGroupData(unwrap(data.rawValue));
      }
    )
  );

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
