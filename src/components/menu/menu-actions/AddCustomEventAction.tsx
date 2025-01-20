import PlusCircle from "lucide-solid/icons/plus-circle";
import { ItemText } from "~/components/menu/MenuCommonComponents";
import EventForm from "~/components/scheduler/CustomEventForm";
import type { CustomEvent } from "~/components/scheduler/event/types";
import { buttonVariants } from "~/components/ui/button";
import { useI18n } from "~/i18n";
import { useScheduler } from "~/providers/SchedulerProvider";

function AddCustomEventAction() {
  const { t } = useI18n();
  const { store } = useScheduler();
  const handleAddEvent = (event: CustomEvent) => store.addCustomEvent(event);
  return (
    <ItemText as="div">
      <EventForm
        onSubmit={handleAddEvent}
        class={buttonVariants({ size: null, variant: "ghost", class: "px-2 py-1 flex items-center gap-1" })}
      >
        <PlusCircle class="w-4 h-4" />
        {t("menu.actions.addCustomEvent.title")}
      </EventForm>
    </ItemText>
  );
}
export default AddCustomEventAction;
