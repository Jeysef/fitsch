import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import {
  type Accessor,
  createContext,
  createMemo,
  createSignal,
  onMount,
  type ParentProps,
  type Setter,
  useContext,
} from "solid-js";
import { toast } from "solid-sonner";
import { type MenuSchema } from "~/components/menu/schema";
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

  const [submittedData, setSubmittedData] = makePersisted(createSignal<MenuSelected>(), {
    name: "submittedData",
    storage: monthCookie,
  });

  const [submittedCourses, setSubmittedCourses] = makePersisted(createSignal<MenuSelected>(), {
    name: "submittedCourses",
    storage: monthCookie,
  });

  onMount(() => {
    if (isObligationData(submittedCourses())) {
      setTimeout(() => {
        toast.info(
          "To improve the menu, we've updated its data structure. As a one-time result, your previously selected courses have been cleared. The good news is that you can now see hidden course selections across different degrees and programs.",
          { duration: 10000 }
        );
        setSubmittedCourses(undefined);
      }, 100);
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
