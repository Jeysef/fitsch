import { Button, type ButtonProps } from "~/components/ui/button";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import { useInstallation } from "~/providers/InstallationProvider";

export default function InstallButton(props: ButtonProps) {
  const { canInstall, install } = useInstallation();
  const { t } = useI18n();

  return (
    <Button
      onClick={install}
      variant="outline"
      disabled={!canInstall()}
      class={cn({
        hidden: !canInstall(),
      })}
      title="Nainstalovat aplikaci"
      {...props}
    >
      {t("header.install")}
    </Button>
  );
}
