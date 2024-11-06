import { css } from "@emotion/css";
import Info from "lucide-solid/icons/info";
import TriangleAlert from "lucide-solid/icons/triangle-alert";
import { ObjectTyped } from "object-typed";
import { For } from "solid-js";
import { Typography, typographyVariants } from "~/components/typography";
import Heading from "~/components/typography/heading";
import Text from "~/components/typography/text";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { subjectTypeColors } from "~/config/colors";
import { cn } from "~/lib/utils";

export default function AppInfo() {
  return (
    <Dialog open>
      <DialogTrigger><Info size={32} color='white' /></DialogTrigger>
      <DialogContent class="max-w-screen-lg w-11/12">
        <DialogHeader>
          <DialogTitle class={typographyVariants({ variant: "h2" })}>Info k aplikaci</DialogTitle>
          <DialogDescription >
            <div class="grid grid-cols-2">
              <div class="max-w-prose w-full">
                <Heading variant="h3">Přehled</Heading>
                <Text>
                  Vlevo je menu, kde se vybírají předměty, ročníky, atd.
                  Data s rozvrhem se načítají ze stránek FITu z karet předmětů, tyto termíny nemusí vždy sedět s realitou nebo studisem.
                  Některé data jsou dopočítávány pro lepší přehlednost, např. týdny lekcí nebo parita.
                </Text>
                <Heading variant="h3">Lekce</Heading>
                <Text variant="largeText">Barevná konvence (podle mobilní aplikace)</Text>
                <section>
                  <Typography variant={"ul"} class='list-["\25AC"] mt-0'
                  >
                    <For each={ObjectTyped.entries(subjectTypeColors)} >
                      {([type, color]) => {
                        const colorClass = css`&::marker { color: ${color}; }`
                        return <li class={cn("marker:font-medium marker:text-2xl marker:border marker:border-solid", colorClass)}>{type}</li>
                      }}
                    </For>
                  </Typography>
                </section>
                <Heading variant="h3">Funkčnost</Heading>
                <Text>
                  Kliknutím na zaškrtávací políčko si předmět přidáte do výsedného rozvrhu.
                  <br />
                  V kartě "Rozsahy" je kontrola vyklikání všech přednášek a cvičení dle rozsahů předmětu.
                </Text>
              </div>
              <div>

              </div>
            </div>
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertTitle>Opakování</AlertTitle>
              <AlertDescription>
                Neručím za správnost dat ani za fungování programu. Data si vždy ověřte na stránkách školy.
              </AlertDescription>
            </Alert>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}