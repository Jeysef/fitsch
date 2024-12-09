import { css } from "@emotion/css";
import Lightbulb from "lucide-solid/icons/lightbulb";
import TriangleAlert from "lucide-solid/icons/triangle-alert";
import { ObjectTyped } from "object-typed";
import { For } from "solid-js";
import { Typography, typographyVariants } from "~/components/typography";
import Heading from "~/components/typography/heading";
import Text from "~/components/typography/text";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { buttonVariants } from "~/components/ui/button";
import { Contributor } from "~/components/ui/contributor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import InstallButton from "~/components/ui/InstallButton";
import { parityColors, subjectTypeColors } from "~/config/colors";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";

export default function AppInfo() {
  const { t } = useI18n();
  return (
    <Dialog>
      <DialogTrigger>
        <Lightbulb size={32} color="white" />
      </DialogTrigger>
      <DialogContent class="max-w-screen-lg">
        <DialogHeader class="relative space-y-0">
          <DialogTitle class={typographyVariants({ variant: "h2" })}>Info k aplikaci</DialogTitle>
          <InstallButton class="absolute top-0 right-10 hidden md:block lg:hidden" />
        </DialogHeader>
        <InstallButton class="sm:hidden" />
        <div class="max-h-[calc(100vh-10rem)] overflow-auto space-y-2">
          <div class="flex flex-col md:grid md:grid-cols-2 ">
            <div class="max-w-prose w-full flex flex-col">
              <Heading variant="h3">{t("info.appInfo.title")}</Heading>
              <Text>{t("info.appInfo.overview.description")}</Text>
              <Heading variant="h4" class="mt-8">
                Lekce
              </Heading>
              <Text class="inline-block text-lg font-semibold">Barevná konvence</Text>
              <Text variant={"smallText"} class="inline">
                {" "}
                (podle mobilní aplikace)
              </Text>
              <Text class="mt-2 list-none flex flex-wrap gap-1">
                <For each={ObjectTyped.entries(subjectTypeColors)}>
                  {([type, color]) => {
                    const colorClass = css`background-color: ${color}`;
                    return (
                      <div class={cn("px-4 py-2 rounded border", colorClass)}>{t(`scheduler.timeSpan.type.${type}`)}</div>
                    );
                  }}
                </For>
              </Text>
              <Text class="text-lg font-semibold">Parita týdne</Text>
              <Text class="mt-2 list-none flex flex-wrap gap-1">
                <For each={ObjectTyped.entries(parityColors)}>
                  {([parity, color]) => {
                    const colorClass = css`border-color: ${color}`;
                    return (
                      <div class={cn("px-4 py-2 rounded border-dashed border-2", colorClass)}>
                        {t(`course.detail.weeks.${parity}`)}
                      </div>
                    );
                  }}
                </For>
              </Text>
              <Heading variant="h4" class="mt-8">
                Funkčnost
              </Heading>
              <Text>
                Kliknutím na zaškrtávací políčko si předmět přidáte do výsedného rozvrhu.
                <br />V kartě "Rozsahy" je kontrola vyklikání všech přednášek a cvičení dle rozsahů předmětu.
                <br />
                Rozvrh je automaticky ukládán do prohlížeče.
              </Text>
              <Heading variant="h4" class="mt-8">
                Odkazy
              </Heading>
              <Text>
                Pokud si chcete svůj rozvrh skládat sami, zde jsou odkazy na užitečné stránky:
                <Typography as="ul" class="list-disc ml-6">
                  <li>
                    <a
                      href="https://www.fit.vut.cz/study/programs"
                      target="_blank"
                      rel="noreferrer"
                      class={buttonVariants({ variant: "link" })}
                    >
                      Studijní programy
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.fit.vut.cz/study/courses/"
                      target="_blank"
                      rel="noreferrer"
                      class={buttonVariants({ variant: "link" })}
                    >
                      Seznam předmětů
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.fit.vut.cz/study/calendar"
                      target="_blank"
                      rel="noreferrer"
                      class={buttonVariants({ variant: "link" })}
                    >
                      Časový plán
                    </a>
                  </li>
                </Typography>
              </Text>
              <Heading variant="h4" class="mt-8">
                Poděkování
              </Heading>
              <Text>
                Děkuji všem, kteří se podíleli na vzniku předchozí aplikace nalezitelné na
                "https://www.kubosh.net/apps/fitsch/", kerá mi poskytla předlohu a přiměla mě udělat tuto aplikaci jako její
                náhradu.
              </Text>
              <div class="flex-1" />
              <span class="space-x-2">
                <Text class="text-muted-foreground text-xs inline-block">Vytvořil:</Text>
                <Contributor name="Jeysef" href="https://github.com/Jeysef" class="w-max" />
              </span>
            </div>
            <div>
              <Heading variant="h3">{t("info.fitInfo.title")}</Heading>
              <Text variant={"lead"}>{t("info.fitInfo.description")}</Text>
              <For each={ObjectTyped.entries(t("info.fitInfo.content"))}>
                {([theme, { title, description }]) => (
                  <>
                    <Heading variant="h4" class="mt-8">
                      {title}
                    </Heading>
                    <Text>{description}</Text>
                  </>
                )}
              </For>
            </div>
          </div>
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>Opakování</AlertTitle>
            <AlertDescription>
              Neručím za správnost dat ani za fungování programu. Data si vždy ověřte na stránkách školy.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
}
