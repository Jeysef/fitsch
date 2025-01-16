import ChevronDown from "lucide-solid/icons/chevron-down";
import CircleAlert from "lucide-solid/icons/circle-alert";
import PlusCircle from "lucide-solid/icons/plus-circle";
import { createSignal, type Setter } from "solid-js";
import { exportJSON, importJSON } from "~/components/menu/ImportExport";
import { ItemText, SectionHeading } from "~/components/menu/MenuCommonComponents";
import { parseStoreJson } from "~/components/menu/storeJsonValidator";
import { ClassRegistry } from "~/components/scheduler/classRegistry";
import EventForm from "~/components/scheduler/CustomEventForm";
import type { CustomEvent } from "~/components/scheduler/event/types";
import { SchedulerGenerator } from "~/components/scheduler/generator";
import { Button, buttonVariants } from "~/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { useI18n } from "~/i18n";
import { toast } from "~/packages/solid-sonner";
import { storeSerializer, useScheduler } from "~/providers/SchedulerProvider";

export function Actions() {
  const { store, recreateStore } = useScheduler();
  const { t } = useI18n();
  const [tooltipOpen, setTooltipOpen] = createSignal(false);
  const [tooltipTimer, setTooltipTimer] = createSignal<NodeJS.Timeout>();

  const openTooltip = () => {
    setTooltipOpen(true);
    startTooltipTimer();
  };

  const closeTooltip = () => {
    setTooltipOpen(false);
    const timer = tooltipTimer();
    if (timer) clearTimeout(timer);
  };

  const startTooltipTimer = () => {
    const existingTimer = tooltipTimer();
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    const timer = setTimeout(() => setTooltipOpen(false), 3000);
    setTooltipTimer(timer);
  };

  const handleTooltip = (value: Parameters<Setter<boolean>>[number]) => {
    let val = value;
    if (typeof value === "function") val = value(tooltipOpen());
    if (val) openTooltip();
    else closeTooltip();
  };

  const saveJSON = () => {
    exportJSON({ obj: store, filename: "schedule", serializer: storeSerializer });
  };

  const loadJSON = () => {
    importJSON({
      onImport: (data) => {
        const parsedData = JSON.parse(data, ClassRegistry.reviver);
        const validatedData = parseStoreJson(parsedData);
        if (!validatedData.success) {
          console.error(validatedData.error);
          toast.error(t("menu.actions.importJson.error"), { description: t("menu.actions.importJson.errorDescription") });
          return;
        }
        recreateStore(validatedData.data);
      },
      onError: (err) => {
        toast.error(t("menu.actions.importJson.error"), { description: t("menu.actions.importJson.errorDescription") });
      },
    });
  };

  const generator = SchedulerGenerator();

  const handleAddEvent = (event: CustomEvent) => store.addCustomEvent(event);

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
            on:click={saveJSON}
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
            on:click={loadJSON}
          >
            {t("menu.actions.importJson.title")}
          </Button>
        </ItemText>
        <ItemText as="div" class="flex items-center gap-1">
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
        </ItemText>
        <ItemText as="div">
          <EventForm
            onSubmit={handleAddEvent}
            class={buttonVariants({ size: null, variant: "ghost", class: "px-2 py-1 flex items-center gap-1" })}
          >
            <PlusCircle class="w-4 h-4" />
            {t("menu.actions.addCustomEvent.title")}
          </EventForm>
        </ItemText>
      </CollapsibleContent>
    </Collapsible>
  );
}
