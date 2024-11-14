import * as i18n from "@solid-primitives/i18n";
import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { createContext, createMemo, createSignal, useContext, type Accessor, type FlowProps, type Setter } from "solid-js";
import en from "~/locales/en";
import cs from "./locales/cs";

/** sort matters for lang. switcher */
export const locales = ["cs", "en"] as const;
export type Locale = typeof locales[number];
export type RawDictionary = typeof cs;
export type Dictionary = i18n.Flatten<RawDictionary>;
export type I18nContext = {
  locale: Accessor<Locale>;
  setLocale: Setter<Locale>;
  t: i18n.Translator<Dictionary>;
}
// for keeping the switching being able on server from cookie I included all dictionaries. Also makes switching faster
const dictionaries = {
  en,
  cs
};


const I18nContext = createContext<I18nContext>();
export const useI18n = () => {
  const dict = useContext(I18nContext);
  if (!dict) throw new Error("i18n context not provided");
  return dict;
};

export function I18nProvider(props: FlowProps) {
  const [locale, setLocale] = makePersisted(createSignal<Locale>("cs"), { storage: cookieStorage, name: "locale" });

  const dict = createMemo(() => i18n.flatten(dictionaries[locale()]));
  const t = i18n.translator(dict);

  return (
    <I18nContext.Provider value={{
      t,
      locale,
      setLocale
    }}>
      {props.children}
    </I18nContext.Provider>
  );
};
