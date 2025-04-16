import Lightbulb from "lucide-solid/icons/lightbulb";
import { lazy, Suspense } from "solid-js";
import { Button } from "~/components/ui/button";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";

export default function AppInfo() {
  const DialogContent = lazy(() => import("./InfoDialogContent"));

  return (
    <Dialog>
      <DialogTrigger
        as={Button}
        variant="ghost"
        size="icon"
        name="info-dialog-trigger"
      >
        <Lightbulb color="currentColor" class="text-inherit" />
      </DialogTrigger>
      <Suspense>
        <DialogContent />
      </Suspense>
    </Dialog>
  );
}
