import { createTimer } from "@solid-primitives/timer";
import { useSearchParams } from "@solidjs/router";
import { toPng } from "html-to-image";
import CircleAlert from "lucide-solid/icons/circle-alert";
import { batch, createSignal } from "solid-js";
import { getFileName } from "~/components/menu/menu-actions/utils";
import { ItemText } from "~/components/menu/MenuCommonComponents";
import { scheduleRef } from "~/components/scheduler/Scheduler";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { useI18n } from "~/i18n";
import { useScheduler } from "~/providers/SchedulerProvider";
import download from "downloadjs";

const ScheduleScreenshot = () => {
  const { locale, t } = useI18n();
  const { store } = useScheduler();
  const [isLoading, setLoading] = createSignal(false);
  const [searchParams] = useSearchParams();

  const saveImage = async () => {
    batch(() => setLoading(true));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    setTimeout(async () => {
      const scheduleRefVal = scheduleRef();
      if (scheduleRefVal && document.body.contains(scheduleRefVal)) {
        try {
          const dataUrl = await toPng(scheduleRefVal, {
            style: { maxHeight: "unset" },
            height: scheduleRefVal.scrollHeight,
            width: scheduleRefVal.scrollWidth,
            skipFonts: true, // TODO: remove once html-to-image gets patched (c.f. https://github.com/bubkoo/html-to-image/issues/508)?
          }); // Convert HTML to PNG
          const filename = getFileName({ locale, store });
          download(dataUrl, `${filename}-${searchParams.tab}.png`); // Download the image
        } catch (error) {
          console.error("Failed to capture screenshot:", error);
        } finally {
          setLoading(false);
        }
      }
    }, 0);
  };

  const [tooltipOpen, setTooltipOpen] = createSignal(false);

  createTimer(
    () => {
      if (tooltipOpen()) setTooltipOpen(false);
    },
    () => (tooltipOpen() ? 3000 : false),
    setTimeout
  );

  const handleTooltip = () => setTooltipOpen((p) => !p);

  return (
    <ItemText as="div">
      <Button
        type="button"
        size={null}
        variant={"ghost"}
        disabled={isLoading()}
        class="px-2 py-1 text-link-external"
        on:click={saveImage}
      >
        {t("menu.actions.saveImage.title")}
      </Button>
      <Tooltip placement="right" flip="top" gutter={12} open={tooltipOpen()} hideWhenDetached>
        <TooltipTrigger type="button" on:click={handleTooltip} name="save-screenshot-tooltip">
          <CircleAlert class="w-4 h-4 text-amber-400" />
        </TooltipTrigger>
        <TooltipContent>{t("menu.actions.saveImage.info")}</TooltipContent>
      </Tooltip>
    </ItemText>
  );
};

export default ScheduleScreenshot;
