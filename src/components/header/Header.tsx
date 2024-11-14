import AppInfo from '~/components/header/AppInfo'
import { LanguageSwitcher } from '~/components/header/LanguageSwitcher'

export default function Header() {
  return (
    <header class='w-full flex h-12 p-1 items-center bg-zinc-800 pr-6 justify-between'>
      <div class="flex relative h-full items-center">
        <img src="/VUTFitLogo.png" alt='VUT FIT' class="h-[40px] w-[100px] text-center content-center text-primary-foreground text-2xl font-bold" $ServerOnly fetchpriority='high' width={100} height={40} />
        <h1 class="text-primary-foreground text-2xl font-bold ml-2">Scheduler</h1>
      </div>
      <div class="flex gap-x-4">
        <LanguageSwitcher />
        <AppInfo />
      </div>
    </header>
  )
}

