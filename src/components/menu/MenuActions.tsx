import ChevronDown from "lucide-solid/icons/chevron-down";
import ExportImportJsonAction from "~/components/menu/menu-actions/ExportImportJsonAction";
import GenerateScheduleAction from "~/components/menu/menu-actions/GenerateScheduleAction";
import ScheduleScreenshot from "~/components/menu/menu-actions/SaveImageAction";
import { SectionHeading } from "~/components/menu/MenuCommonComponents";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { useI18n } from "~/i18n";

export function Actions() {
  const { t } = useI18n();

  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger class="flex w-full overflow-hidden items-center">
        <SectionHeading>{t("menu.actions.title")}</SectionHeading>
        <ChevronDown />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ScheduleScreenshot />
        <ExportImportJsonAction />
        <GenerateScheduleAction />
      </CollapsibleContent>
    </Collapsible>
  );
}
