import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { mapValues } from "es-toolkit/compat";
import {
  type Accessor,
  createContext,
  createMemo,
  createSignal,
  type ParentProps,
  type Setter,
  useContext,
} from "solid-js";
import type { MenuSchema } from "~/components/menu/schema";
import { OBLIGATION } from "~/enums/enums";
import { useI18n } from "~/i18n";
import type { DataProviderTypes } from "~/server/scraper/types/data.types";

type persistantGroupData = Partial<MenuSchema>;
type SubmittedCourses = Record<OBLIGATION, string[]>;

interface MenuDataContextType {
  persistentGroupData: Accessor<persistantGroupData>;
  setPersistentGroupData: Setter<persistantGroupData>;
  submittedCourses: Accessor<SubmittedCourses>;
  setSubmittedCourses: Setter<SubmittedCourses>;
  initialConfigSignal: Accessor<DataProviderTypes.getStudyOverviewConfig>;
}

const MenuLocalDataContext = createContext<MenuDataContextType>();
const emptyPersistentValue: persistantGroupData = {
  year: undefined,
  semester: undefined,
  grade: undefined,
  degree: undefined,
  program: undefined,
  ...mapValues(OBLIGATION, () => undefined),
};

const monthCookie = cookieStorage.withOptions({
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
});

export function MenuLocalDataProvider(props: ParentProps) {
  const [persistentGroupData, setPersistentGroupData] = makePersisted(
    createSignal<persistantGroupData>(emptyPersistentValue),
    { name: "groupData", storage: monthCookie }
  );
  const [submittedCourses, setSubmittedCourses] = makePersisted(
    createSignal<SubmittedCourses>(mapValues(OBLIGATION, () => [])),
    { name: "submittedCourses", storage: monthCookie }
  );

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
    submittedCourses,
    setSubmittedCourses,
    initialConfigSignal,
  };

  return <MenuLocalDataContext.Provider value={value}>{props.children}</MenuLocalDataContext.Provider>;
}

export function useLocalMenuData() {
  const context = useContext(MenuLocalDataContext);
  if (!context) throw new Error("useLocalMenuData must be used within an MenuLocalDataProvider");
  return context;
}
