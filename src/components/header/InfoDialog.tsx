import Lightbulb from "lucide-solid/icons/lightbulb";
import TriangleAlert from "lucide-solid/icons/triangle-alert";
import { ObjectTyped } from "object-typed";
import { For } from "solid-js";
import { typographyVariants } from "~/components/typography";
import Heading from "~/components/typography/heading";
import List from "~/components/typography/list";
import Text from "~/components/typography/text";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button, buttonVariants } from "~/components/ui/button";
import { Contributor } from "~/components/ui/contributor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import InstallButton from "~/components/ui/InstallButton";
import { parityColors, subjectTypeColors } from "~/config/colors";
import { useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import { LECTURE_TYPE } from "~/server/scraper/enums";

export default function AppInfo() {
  const { t } = useI18n();

  const LeftCol = () => {
    const subjectColors = ObjectTyped.entries(subjectTypeColors).filter(([type]) => type !== LECTURE_TYPE.EXAM);
    return (
      <div class="max-w-prose w-full flex flex-col">
        <Heading variant="h3">{t("info.appInfo.overview.title")}</Heading>
        <Text>{t("info.appInfo.overview.description")}</Text>
        <Heading variant="h4" class="mt-8">
          {t("info.appInfo.colors.title")}
        </Heading>
        <Text variant={"smallText"} class="inline">
          {t("info.appInfo.colors.description")}
        </Text>
        <div class="mt-6 list-none flex flex-wrap gap-1">
          <For each={subjectColors}>
            {([type, color]) => (
              <div
                class={cn("px-4 py-2 rounded border text-colored-event-foreground")}
                style={{ "background-color": color }}
              >
                {t(`scheduler.timeSpan.type.${type}`)}
              </div>
            )}
          </For>
        </div>
        <Heading variant="h4" class="mt-8">
          {t("info.appInfo.weekParity.title")}
        </Heading>
        <Text>{t("info.appInfo.weekParity.description")}</Text>

        <div class="mt-6 list-none flex flex-wrap gap-1">
          <For each={ObjectTyped.entries(parityColors)}>
            {([parity, color]) => (
              <div class={cn("px-4 py-2 rounded border-dashed border-2")} style={{ "border-color": color }}>
                {t(`course.detail.weeks.${parity}`)}
              </div>
            )}
          </For>
        </div>
        <Heading variant="h4" class="mt-8">
          {t("info.appInfo.functionality.title")}
        </Heading>
        <List>
          <For each={t("info.appInfo.functionality.description")}>{(text) => <li>{text}</li>}</For>
        </List>
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{t("info.appInfo.liabilityWarning.title")}</AlertTitle>
          <AlertDescription innerHTML={t("info.appInfo.liabilityWarning.description")} />
        </Alert>
        <Heading variant="h4" class="mt-8">
          {t("info.appInfo.links.title")}
        </Heading>
        <Text>
          {t("info.appInfo.links.description")}
          <List>
            <For each={t("info.appInfo.links.links")}>
              {({ title, link }) => (
                <li>
                  <a href={link} target="_blank" rel="noreferrer" class={buttonVariants({ variant: "link" })}>
                    {title}
                  </a>
                </li>
              )}
            </For>
          </List>
        </Text>
        <Heading variant="h4" class="mt-8">
          {t("info.appInfo.thanks.title")}
        </Heading>
        <Text>{t("info.appInfo.thanks.description")}</Text>
        <div class="flex-1" />
        <span class="space-x-2">
          <Text class="text-muted-foreground text-xs inline-block">{t("info.appInfo.createdBy.title")}</Text>
          <Contributor name="Jeysef" href="https://github.com/Jeysef" class="w-max" />
        </span>
      </div>
    );
  };

  const RightCol = () => {
    return (
      <div class="max-w-prose w-full flex flex-col">
        <Heading variant="h3">{t("info.fitInfo.title")}</Heading>
        <Text innerHTML={t("info.fitInfo.description")} />
        <For each={ObjectTyped.entries(t("info.fitInfo.content"))}>
          {([_, { title, description }]) => (
            <>
              <Heading variant="h4" class="mt-8">
                {title}
              </Heading>
              <Text innerHTML={description} />
            </>
          )}
        </For>
        <Text
          class="text-lg font-bold text-transparent mt-8 bg-clip-text"
          style={{ "background-image": "linear-gradient(in oklch to right, #e4002b,  #00a9e0)" }}
        >
          {t("info.fitInfo.welcome")}
        </Text>
        <Text innerHTML={t("info.fitInfo.ask")} />
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger
        as={Button}
        variant="ghost"
        size="icon"
        class="hover:bg-muted-foreground text-inherit hover:text-inherit"
      >
        <Lightbulb color="currentColor" class="text-inherit" />
      </DialogTrigger>
      <DialogContent class="max-w-screen-lg">
        <DialogHeader class="relative space-y-0">
          <DialogTitle class={typographyVariants({ variant: "h2" })}>{t("info.heading")}</DialogTitle>
          <InstallButton class="absolute top-0 right-10 hidden md:block lg:hidden" />
        </DialogHeader>
        <InstallButton class="sm:hidden" />
        <div class="max-h-[calc(100svh-10rem)] overflow-auto space-y-2">
          <div class="flex flex-col md:grid md:grid-cols-2 gap-x-6 px-3 ">
            <LeftCol />
            <RightCol />
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
