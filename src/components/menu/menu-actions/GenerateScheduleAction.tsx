import CircleAlert from "lucide-solid/icons/circle-alert";
import { createSignal, type Setter } from "solid-js";
import { ItemText } from "~/components/menu/MenuCommonComponents";
import { SchedulerGenerator } from "~/components/scheduler/generator";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { useI18n } from "~/i18n";

function GenerateScheduleAction() {
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

  const generator = SchedulerGenerator();
  return (
    <>
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
          <TooltipTrigger type="button" on:click={() => handleTooltip((p) => !p)} name="generate-schedule-tooltip">
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
    </>
  );
}
export default GenerateScheduleAction;
