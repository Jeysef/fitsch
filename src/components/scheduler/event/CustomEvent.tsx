import CircleEllipsis from "lucide-solid/icons/circle-ellipsis";
import { createSignal } from "solid-js";
import { modifyMutable, reconcile } from "solid-js/store";
import EventForm from "~/components/scheduler/CustomEventForm";
import { EventTitle, EventWrapper, type EventProps } from "~/components/scheduler/event/Event";
import type { CustomEvent } from "~/components/scheduler/event/types";
import Text from "~/components/typography/text";
import { Checkbox, CheckboxControl } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useI18n } from "~/i18n";

export interface CustomEventProps extends EventProps {}

export default function CustomEventComponent(props: CustomEventProps) {
  const { t } = useI18n();
  const store = props.store;
  const event = props.event.eventData.event as CustomEvent;
  const [dropdownMenuOpen, setDropdownMenuOpen] = createSignal(false);

  const removeEvent = () => store.removeCustomEvent(event.id);

  const handleCheck = (checked?: boolean) => {
    event.checked = checked ?? !event.checked;
  };

  const ActionsMenu = () => (
    <DropdownMenu flip placement="bottom" open={dropdownMenuOpen()} onOpenChange={setDropdownMenuOpen}>
      <DropdownMenuTrigger>
        <CircleEllipsis size={"1em"} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <EventForm
          isEdit
          as={DropdownMenuItem}
          closeOnSelect={false}
          defaultValue={event}
          onSubmit={(e: CustomEvent) => {
            modifyMutable(event, reconcile(e));
            setDropdownMenuOpen(false);
          }}
          onCancel={() => setDropdownMenuOpen(false)}
        >
          {t("course.detail.customAction.edit")}
        </EventForm>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={removeEvent} class="text-destructive focus:text-destructive">
          {t("course.detail.customAction.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <EventWrapper
      handleCheck={handleCheck}
      {...props}
      header={
        <>
          <ActionsMenu />
          <EventTitle title={event.title} />
          <Checkbox checked={event.checked} onChange={handleCheck}>
            <CheckboxControl class="em:size-4" />
          </Checkbox>
        </>
      }
    >
      <Text em variant="smallText" class="block">
        {event.info}
      </Text>
    </EventWrapper>
  );
}
