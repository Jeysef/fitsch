import { createMemo, Show } from "solid-js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { LANGUAGE } from "~/enums";
import { locales, useI18n } from "~/i18n";
import CZ from "./CZ.svg";
import US from "./US.svg";
import { cn } from "~/lib/utils";

const flags: Record<LANGUAGE, string> = {
  [LANGUAGE.ENGLISH]: US,
  [LANGUAGE.CZECH]: CZ,
};

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  const options = createMemo(() =>
    locales.map((lang) => ({
      value: lang,
      label: t(`language.${lang}`),
      flag: flags[lang],
    }))
  );

  const value = createMemo(() => ({ value: locale(), label: t(`language.${locale()}`), flag: flags[locale()] }));

  type Options = ReturnType<typeof options>[number];

  return (
    <Select
      options={options()}
      optionValue="value"
      optionTextValue="label"
      value={value()}
      onChange={(value) => value && setLocale(value.value)}
      placeholder="Select language"
      selectionBehavior="replace"
      itemComponent={(props) => (
        <SelectItem item={props.item}>
          <SelectItemContent {...props.item.rawValue} />
        </SelectItem>
      )}
    >
      <SelectTrigger class="border-muted-foreground">
        <SelectValue<Options>>{({ selectedOption }) => <SelectItemContent {...selectedOption()} hidden />}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
}

function SelectItemContent(props: { label: string; flag: string; value: LANGUAGE; hidden?: boolean }) {
  return (
    <div class="flex items-center gap-2 text-inherit">
      <span>
        <img src={props.flag} alt={`${props.value} flag`} class="w-4" />
      </span>
      <span class={cn("text-xs sm:text-sm", { "hidden md:inline": props.hidden })}>{props.label}</span>
    </div>
  );
}
