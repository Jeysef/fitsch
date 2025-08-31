import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import {
  type Accessor,
  createComputed,
  createContext,
  createMemo,
  createSignal,
  type ParentProps,
  type Setter,
  untrack,
  useContext,
} from "solid-js";
import { menuSchema, type MenuSchema } from "~/components/menu/schema";
import type { MenuSelected } from "~/components/menu/types";
import { isObligationData } from "~/components/menu/utils";
import { useI18n } from "~/i18n";
import type { DataProviderTypes } from "~/server/scraper/types/data.types";

type persistantGroupData = Partial<MenuSchema>;
type SubmittedData = MenuSchema["selected"] | undefined;

interface MenuDataContextType {
  persistentGroupData: Accessor<persistantGroupData>;
  setPersistentGroupData: Setter<persistantGroupData>;
  submittedData: Accessor<SubmittedData>;
  setSubmittedData: Setter<SubmittedData>;
  initialConfigSignal: Accessor<DataProviderTypes.getStudyOverviewConfig>;
}

const MenuLocalDataContext = createContext<MenuDataContextType>();
const emptyPersistentValue: persistantGroupData = {
  year: undefined,
  semester: undefined,
  grade: undefined,
  degree: undefined,
  program: undefined,
  selected: undefined,
};

const monthCookie = cookieStorage.withOptions({
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
});

export function MenuLocalDataProvider(props: ParentProps) {
  const [persistentGroupData, setPersistentGroupData] = makePersisted(
    createSignal<persistantGroupData>(emptyPersistentValue),
    { name: "groupData", storage: monthCookie }
  );

  const isCreatedFromOldSymbol = Symbol("isCreatedFromOld");

  const deserialize = (data: string): MenuSelected => {
    console.log("🚀 ~ deserialize ~ data:", data);
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(data);
      console.log(
        "🚀 ~ deserialize ~ menuSchema.pick({ selected: true }).parse({ selected: parsedData }).selected:",
        menuSchema.pick({ selected: true }).parse({ selected: parsedData }).selected
      );
      return menuSchema.pick({ selected: true }).parse({ selected: parsedData }).selected;
    } catch {
      if (!parsedData) return {};
      if (isObligationData(parsedData)) {
        const degree = persistentGroupData()?.degree;
        const program = persistentGroupData()?.program;
        const grade = persistentGroupData()?.grade;
        const newData = {
          [isCreatedFromOldSymbol]: true,
          [degree!]: {
            [program!]: {
              [grade!]: parsedData,
            },
          },
        } as MenuSelected;
        console.log("🚀 ~ deserialize ~ newData:", newData);
        return newData;
      }
      return {};
    }
  };

  const [submittedData, setSubmittedData] = makePersisted(createSignal<MenuSelected>(), {
    name: "submittedCourses",
    storage: monthCookie,
    deserialize,
  });

  const createImmediateOnce = (fn: Accessor<unknown>) => createComputed(() => untrack(fn));

  createImmediateOnce(() => {
    // @ts-expect-error symbol is not typed
    if (submittedData()?.[isCreatedFromOldSymbol]) {
      setSubmittedData(submittedData());
    }
  });

  const locale = useI18n().locale;

  const initialConfigSignal = createMemo(
    () =>
      ({
        language: locale(),
        year: persistentGroupData()?.year?.value,
        faculty: persistentGroupData()?.faculty,
        degree: persistentGroupData()?.degree,
        program: persistentGroupData()?.program,
      }) as DataProviderTypes.getStudyOverviewConfig
  );

  const value: MenuDataContextType = {
    persistentGroupData,
    setPersistentGroupData,
    submittedData,
    setSubmittedData,
    initialConfigSignal,
  };

  return <MenuLocalDataContext.Provider value={value}>{props.children}</MenuLocalDataContext.Provider>;
}

export function useLocalMenuData() {
  const context = useContext(MenuLocalDataContext);
  if (!context) throw new Error("useLocalMenuData must be used within an MenuLocalDataProvider");
  return context;
}
