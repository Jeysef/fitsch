import ChevronDown from "lucide-solid/icons/chevron-down";
import AddCustomEventAction from "~/components/menu/menu-actions/AddCustomEventAction";
import ExportImportJsonAction from "~/components/menu/menu-actions/ExportImportJsonAction";
import GenerateScheduleAction from "~/components/menu/menu-actions/GenerateScheduleAction";
import ScheduleScreenshot from "~/components/menu/menu-actions/SaveImageAction";
import { SectionHeading } from "~/components/menu/MenuCommonComponents";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { useI18n } from "~/i18n";
import { SidebarGroup } from "../ui/sidebar";
import ChevronRight from "lucide-solid/icons/chevron-right";

export function Actions() {
  const { t } = useI18n();

  return (
    <Collapsible defaultOpen class="group/collapsible">
      <SidebarGroup>
        <CollapsibleTrigger class="flex w-full overflow-hidden items-center">
          <SectionHeading>{t("menu.actions.title")}</SectionHeading>
          <ChevronRight class="ml-auto transition-transform group-data-[expanded]/collapsible:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ScheduleScreenshot />
          <ExportImportJsonAction />
          <GenerateScheduleAction />
          <AddCustomEventAction />
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
