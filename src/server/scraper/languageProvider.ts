import { LANGUAGE } from "../../enums";
import type cs from "./locales/cs";

export type LanguageSetDictionary = typeof cs;

const dictionaries = {
  [LANGUAGE.ENGLISH]: import("./locales/en").then((e) => e.default) satisfies Promise<LanguageSetDictionary>,
  [LANGUAGE.CZECH]: import("./locales/cs").then((e) => e.default) satisfies Promise<LanguageSetDictionary>,
};

export class LanguageProvider {
  readonly languageSet;
  constructor(readonly language: LANGUAGE) {
    this.languageSet = dictionaries[this.language];
  }
}
