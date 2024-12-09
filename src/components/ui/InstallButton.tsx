import { Button, type buttonProps } from "~/components/ui/button";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import { useInstallation } from "~/providers/InstallationProvider";

export default function InstallButton(props: buttonProps) {
  const { canInstall, install } = useInstallation();
  const { t } = useI18n();

  return (
    <Button
      onClick={install}
      disabled={!canInstall()}
      class={cn("text-white hover:text-primary-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed", {
        hidden: !canInstall(),
      })}
      title="Nainstalovat aplikaci"
      {...props}
    >
      {t("header.install")}
    </Button>
  );
}
