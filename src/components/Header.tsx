import Info from 'lucide-solid/icons/info'
import TriangleAlert from 'lucide-solid/icons/triangle-alert'
import { Typography, typographyVariants } from '~/components/typography'
import Text from '~/components/typography/text'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'

export default function Header() {
  return (
    <header class='w-full flex h-12 p-1 items-center bg-zinc-800 justify-between pr-6'>
      <div class="flex relative h-full items-center">
        <img src="/VUTFitLogo.png" alt='VUT FIT' class="h-[40px] w-[100px] text-center content-center text-white text-2xl font-bold" $ServerOnly fetchpriority='high' width={100} height={40} />
        <h1 class="text-white text-2xl font-bold ml-2">Scheduler</h1>
      </div>
      <AppInfo />
    </header>
  )
}

function AppInfo() {
  return (
    <Dialog>
      <DialogTrigger><Info size={32} color='white' /></DialogTrigger>
      <DialogContent >
        <DialogHeader>
          <DialogTitle class={typographyVariants({ variant: "h2" })}>Info k aplikaci</DialogTitle>
          <DialogDescription >
            <span>
              <Text>
                V levo je menu, kde se vybírají předměty.
                Data s rozvrhem se načítají ze stránek FITu z karet předmětů, tyto termíny nemusí vždy sedět s realitou nebo studisem.
              </Text>
              <Text variant="largeText">
                Barevná konvence
              </Text>
              <section>
                <Typography variant={"ul"} class='list-["\25AC"] mt-0'
                >
                  <li class='marker:text-green-500 marker:font-medium marker:text-2xl'>Zelená: přednáška</li>
                  <li class='marker:text-blue-500 marker:font-medium marker:text-2xl'>Modrá: demo cvičení</li>
                  <li class='marker:text-amber-500 marker:font-medium marker:text-2xl'>žlutá: laboratoře</li>
                </Typography>
              </section>
              <Text>
                Kliknutím na zaškrtávací políčko si předmět přidáte do rozvrhu.
              </Text>
              <Text>
                V kartě "Rozsahy" je kontrola vyklikání všech přednášek a cvičení dle rozsahů předmětu.
              </Text>
              <Text as='div'>
                <Alert variant="destructive">
                  <TriangleAlert />
                  <AlertTitle>Opakování</AlertTitle>
                  <AlertDescription>
                    Neručím za správnost dat ani za fungování programu. Data si vždy ověřte na stránkách školy.
                  </AlertDescription>
                </Alert>
              </Text>
            </span>


          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}