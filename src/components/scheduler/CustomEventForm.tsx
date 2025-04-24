import type { OverrideProps, PolymorphicProps } from "@kobalte/core";
import type { DialogTriggerProps } from "@kobalte/core/dialog";
import type { ValidComponent } from "solid-js";
import { createSignal, lazy, splitProps, Suspense } from "solid-js";
import type { z } from "zod";
import type { customEventSchema } from "~/components/menu/storeJsonValidator";
import type { CustomEvent } from "~/components/scheduler/event/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { useI18n } from "~/i18n";
import Loader from "../ui/loader";

const Form = lazy(() => import("./CustomEventFormContent"));

export type EventFormData = z.infer<typeof customEventSchema>;

interface EventFormProps {
  defaultValue?: CustomEvent;
  triggerText?: string;
  onSubmit: (data: CustomEvent) => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

export default function EventForm<T extends ValidComponent = "button">(
  props: OverrideProps<PolymorphicProps<T, DialogTriggerProps<T>>, EventFormProps>
) {
  const { t } = useI18n();
  const [open, setOpen] = createSignal(false);

  const [local, rest] = splitProps(props, ["defaultValue", "triggerText", "onSubmit", "onCancel", "isEdit"]);

  return (
    <Dialog
      open={open()}
      onOpenChange={(state) => {
        setOpen(state);
        if (!state) local.onCancel?.();
      }}
    >
      <DialogTrigger {...(rest as unknown as PolymorphicProps<T, DialogTriggerProps<T>>)} />
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {local.isEdit ? t("menu.actions.addCustomEvent.form.edit") : t("menu.actions.addCustomEvent.title")}
          </DialogTitle>
          <Suspense fallback={<Loader  class="h-52"/>}>
            <Form setOpen={setOpen} {...local} />
          </Suspense>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
