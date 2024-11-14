import { createMemo } from "solid-js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Locale } from "~/i18n";
import { locales, useI18n } from "~/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  const flags: Record<Locale, string> = {
    en: "🇺🇸",
    cs: "🇨🇿",
  };

  const options = createMemo(() => locales.map((lang) => ({
    value: lang,
    label: t(`language.${lang}`),
    flag: flags[lang],
  })))

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
      <SelectTrigger class="text-primary-foreground border-muted-foreground">
        <SelectValue<Options>>
          {({ selectedOption }) => (<SelectItemContent {...selectedOption()} />)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
}

function SelectItemContent(props: { label: string; flag: string; }) {
  return (
    <div class="flex items-center gap-2">
      <span>{props.flag}</span>
      <span>{props.label}</span>
    </div>
  )
}