import { useSearchParams } from "@solidjs/router";
import { toPng } from "html-to-image";
import CircleAlert from "lucide-solid/icons/circle-alert";
import { batch, createSignal, type Setter } from "solid-js";
import { getFileName } from "~/components/menu/menu-actions/utils";
import { ItemText } from "~/components/menu/MenuCommonComponents";
import { scheduleRef } from "~/components/scheduler";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { useI18n } from "~/i18n";
import { useScheduler } from "~/providers/SchedulerProvider";

const ScheduleScreenshot = () => {
  const { locale, t } = useI18n();
  const { store } = useScheduler();
  const [isLoading, setLoading] = createSignal(false);
  const [searchParams] = useSearchParams();

  const saveImage = async () => {
    batch(() => setLoading(true));
    setTimeout(async () => {
      const scheduleRefVal = scheduleRef();
      if (scheduleRefVal && document.body.contains(scheduleRefVal)) {
        try {
          scheduleRefVal.style.maxHeight = "unset";
          const dataUrl = await toPng(scheduleRefVal); // Convert HTML to PNG
          const a = document.createElement("a");
          a.href = dataUrl;
          const filename = getFileName({ locale, store });
          a.download = `${filename}-${searchParams.tab}.png`;
          a.click();
          a.remove();
        } catch (error) {
          console.error("Failed to capture screenshot:", error);
        } finally {
          scheduleRefVal.style.maxHeight = "100%";
          setLoading(false);
        }
      }
    }, 0);
  };

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

  return (
    <ItemText as="div">
      <Button
        type="button"
        size={null}
        variant={"ghost"}
        disabled={isLoading()}
        class="px-2 py-1 text-link hover:text-link hover:saturate-150"
        on:click={saveImage}
      >
        {t("menu.actions.saveImage.title")}
      </Button>
      <Tooltip placement="right" flip="top" gutter={12} open={tooltipOpen()} hideWhenDetached>
        <TooltipTrigger type="button" on:click={() => handleTooltip((p) => !p)}>
          <CircleAlert class="w-4 h-4 text-amber-400" />
        </TooltipTrigger>
        <TooltipContent>{t("menu.actions.saveImage.info")}</TooltipContent>
      </Tooltip>
    </ItemText>
  );
};

export default ScheduleScreenshot;
