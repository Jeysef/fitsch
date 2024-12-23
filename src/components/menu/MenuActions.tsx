import ChevronDown from "lucide-solid/icons/chevron-down";
import { ItemText, SectionHeading } from "~/components/menu/MenuCommonComponents";
import SchedulerGenerator from "~/components/scheduler/generator";
import { Button } from "~/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { useI18n } from "~/i18n";
import { useScheduler } from "~/providers/SchedulerProvider";

export function Actions() {
  const { store, recreateStore } = useScheduler();
  // const store = persistedStore();
  const { t } = useI18n();
  // const [tooltipOpen, setTooltipOpen] = createSignal(false);
  // const [tooltipTimer, setTooltipTimer] = createSignal<NodeJS.Timeout>();

  // const openTooltip = () => {
  //   setTooltipOpen(true);
  //   startTooltipTimer();
  // };

  // const closeTooltip = () => {
  //   setTooltipOpen(false);
  //   const timer = tooltipTimer();
  //   if (timer) clearTimeout(timer);
  // };

  // const startTooltipTimer = () => {
  //   const existingTimer = tooltipTimer();
  //   if (existingTimer) {
  //     clearTimeout(existingTimer);
  //   }
  //   const timer = setTimeout(() => setTooltipOpen(false), 3000);
  //   setTooltipTimer(timer);
  // };

  // const handleTooltip = (value: Parameters<Setter<boolean>>[number]) => {
  //   let val = value;
  //   if (typeof value === "function") val = value(tooltipOpen());
  //   if (val) openTooltip();
  //   else closeTooltip();
  // };

  const exportJSON = () => {
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(store)], { type: "application/json" });
    a.href = URL.createObjectURL(file);
    a.download = "schedule.json";
    a.click();
    a.remove();
  };

  const importJSON = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.accept = ".json";
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          recreateStore(data);
        } catch (e) {
          console.error(e);
        }
      };
      reader.readAsText(file);
    };
    input.remove();
  };

  const generator = SchedulerGenerator();

  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger class="flex w-full overflow-hidden items-center">
        <SectionHeading>{t("menu.actions.title")}</SectionHeading>
        <ChevronDown />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ItemText as="div">
          <Button
            type="button"
            size={null}
            variant={"ghost"}
            class="px-2 py-1 text-link hover:text-link hover:saturate-150"
            on:click={exportJSON}
          >
            {t("menu.actions.exportJson")}
          </Button>
        </ItemText>
        <ItemText as="div">
          <Button
            type="button"
            size={null}
            variant={"ghost"}
            class="px-2 py-1 text-link hover:text-link hover:saturate-150"
            on:click={importJSON}
          >
            {t("menu.actions.importJson")}
          </Button>
        </ItemText>
        {/* <ItemText as="div" class="flex items-center gap-1">
          <Button
            type="button"
            size={null}
            variant={"ghost"}
            class="px-2 py-1"
            on:click={() => generator.generateNext()}
            disabled={generator.isGenerating()}
          >
            {generator.isGenerating() ? t("menu.actions.generate.generating") : t("menu.actions.generate.next")}
          </Button>
          <Tooltip placement="right" flip="top" gutter={12} open={tooltipOpen()} hideWhenDetached>
            <TooltipTrigger type="button" on:click={() => handleTooltip((p) => !p)}>
              <CircleAlert class="w-4 h-4 text-amber-400" />
            </TooltipTrigger>
            <TooltipContent>{t("menu.actions.generate.warning")}</TooltipContent>
          </Tooltip>
        </ItemText>
        <ItemText as="div">
          <Button
            type="button"
            size={null}
            variant={"ghost"}
            class="px-2 py-1"
            on:click={() => generator.generatePrevious()}
            disabled={!generator.canGeneratePrevious() || generator.isGenerating()}
          >
            {generator.isGenerating() ? t("menu.actions.generate.generating") : t("menu.actions.generate.previous")}
          </Button>
        </ItemText> */}
      </CollapsibleContent>
    </Collapsible>
  );
}
