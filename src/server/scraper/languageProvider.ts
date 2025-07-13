import { LANGUAGE } from "../../enums";
import type cs from "./locales/cs";

export type LanguageSetDictionary = typeof cs;

const dictionaries = {
  [LANGUAGE.ENGLISH]: () => import("./locales/en").then((m) => m.default),
  [LANGUAGE.CZECH]: () => import("./locales/cs").then((m) => m.default),
};

export class LanguageProvider {
  public readonly languageSet: LanguageSetDictionary;

  private constructor(
    public readonly language: LANGUAGE,
    languageSet: LanguageSetDictionary
  ) {
    this.languageSet = languageSet;
  }

  public static async create(language: LANGUAGE): Promise<LanguageProvider> {
    const languageSet = await dictionaries[language]();

    return new LanguageProvider(language, languageSet);
  }
}
