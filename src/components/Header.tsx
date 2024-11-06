import AppInfo from '~/components/AppInfo'

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

