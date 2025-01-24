import { useColorMode } from "@kobalte/core/color-mode";
import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import LaptopMinimal from "lucide-solid/icons/laptop-minimal";
import Moon from "lucide-solid/icons/moon";
import SunMedium from "lucide-solid/icons/sun-medium";
import { Button } from "~/components/ui/button";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";

const ModeToggle = () => {
  const { setColorMode } = useColorMode();

  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger
        as={Button}
        variant="ghost"
        size="icon"
        class="hover:bg-muted-foreground text-inherit hover:text-inherit"
      >
        <SunMedium class=" rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </DropdownMenuTrigger>
      <DropdownMenuContent class="min-w-[8rem]">
        <DropdownMenuItem onSelect={() => setColorMode("light")}>
          <SunMedium />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setColorMode("dark")}>
          <Moon />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setColorMode("system")}>
          <LaptopMinimal />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModeToggle;
