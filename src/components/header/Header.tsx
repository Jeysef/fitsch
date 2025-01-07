import AppInfo from "~/components/header/InfoDialog";
import { LanguageSwitcher } from "~/components/header/LanguageSwitcher";
import ModeToggle from "~/components/modeToggle";
import InstallButton from "~/components/ui/InstallButton";

export default function Header() {
  return (
    <header class="w-full flex h-12 p-1 items-center bg-zinc-800 pr-6 justify-between">
      <div class="flex relative h-full items-center">
        <svg xmlns="http://www.w3.org/2000/svg" id="icon-logo-fit" viewBox="0 0 196 80" height={40} $ServerOnly>
          <title>VUT FIT Logo</title>
          {/* numbers changed for overlaping on small size */}
          <rect fill="#fff" width="77" height="100%" /> {/* 80 - 3 */}
          <rect fill="#fff" width="110" height="100%" x="86" /> {/* 83 + 3 */}
          <path
            fill="#00a9e0"
            fill-rule="evenodd"
            d="M83 80h113V0H83v80zm68.807-59.903h29.12v5.824h-11.2v33.376h-6.721V25.921h-11.199v-5.824zm-15.68 39.2h6.72v-39.2h-6.72v39.2zm-32.759-39.2h22.96v5.824h-16.24v10.752h15.12v5.824h-15.12v16.8h-6.72v-39.2z"
          />
          <path fill="#e4002b" d="M67 32H53a5.9 5.9 0 0 0-6 5.7V69h-9V24H13v-9h25v9h29v8zM0 80h80V0H0v80z" />
        </svg>
        <h1 class="text-zinc-50 text-2xl font-bold ml-2">Scheduler</h1>
      </div>
      <div class="flex gap-x-4">
        <div class="hidden md:block">
          <InstallButton />
        </div>
        <LanguageSwitcher />
        <ModeToggle />
        <AppInfo />
      </div>
    </header>
  );
}
