import { LANGUAGE } from "~/enums";
import cs from "../../locales/cs";
import en from "../../locales/en";

export const getLanguageSet = (language: LANGUAGE = LANGUAGE.ENGLISH) => {
  switch (language) {
    case LANGUAGE.ENGLISH:
      return en;
    case LANGUAGE.CZECH:
      return cs;
    default:
      throw new Error(`Unsupported language provided: ${language}`);
  }
};
