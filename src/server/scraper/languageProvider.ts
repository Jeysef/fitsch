import { LANGUAGE } from "../../enums";

export class LanguageProvider {
  readonly languageSet;
  constructor(readonly language: LANGUAGE) {
    this.languageSet = this.getLanguageSet();
  }

  private getLanguageSet() {
    switch (this.language) {
      case LANGUAGE.ENGLISH:
        return import("./locales/en.json");
      case LANGUAGE.CZECH:
        return import("./locales/cs.json");
    }
  }
}
