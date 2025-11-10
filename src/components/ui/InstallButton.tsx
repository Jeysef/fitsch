import { Show } from "solid-js";
import { Button, type ButtonProps } from "~/components/ui/button";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import { useInstallation } from "~/providers/instalation/instalation-hooks";

export default function InstallButton(props: ButtonProps) {
  const { canInstall, install } = useInstallation();
  const { t } = useI18n();

  return (
    <Show when={canInstall()}>
      <Button
        onClick={install}
        variant="outline"
        title="Nainstalovat aplikaci"
        class={cn("h-full w-full p-1 rounded-none", props.class)}
        {...props}
      >
        {t("header.install")}
      </Button>
    </Show>
  );
}
