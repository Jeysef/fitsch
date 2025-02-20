import { ErrorMessage as TextFieldErrorMessage } from "@kobalte/core/text-field";
import { createFormControl, createFormGroup } from "solid-forms";
import type { Setter } from "solid-js";
import { createRenderEffect, For } from "solid-js";
import { v4 } from "uuid";
import type { z } from "zod";
import { customEventSchema } from "~/components/menu/storeJsonValidator";
import type { CustomEvent } from "~/components/scheduler/event/types";
import { Time, TimeSpan } from "~/components/scheduler/time";
import Text from "~/components/typography/text";
import { Button } from "~/components/ui/button";
import { DialogFooter } from "~/components/ui/dialog";
// import { DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { TextField, TextFieldLabel, TextFieldRoot } from "~/components/ui/textfield";
import { customColors } from "~/config/colors";
import { days, end, start } from "~/config/scheduler";
import { useI18n } from "~/i18n";
import { TwitterPicker } from "~/packages/solid-color/source/components/twitter";
import { DAY } from "~/server/scraper/enums";

interface FormProps {
  setOpen: Setter<boolean>;
  onSubmit: (e: CustomEvent) => void;
  onCancel?: () => void;
  defaultValue?: CustomEvent;
  isEdit?: boolean;
}

function validateTime(start: Time, end: Time) {
  const startMinutes = start.minutes;
  const endMinutes = end.minutes;

  if (endMinutes <= startMinutes) {
    return { invalidRange: true };
  }

  // Validate against config times
  const configStartMinutes = start.minutes;
  const configEndMinutes = end.minutes;

  if (startMinutes < configStartMinutes || endMinutes > configEndMinutes) {
    return { outsideAllowedRange: true };
  }

  return null;
}

const startTimeOptions = (() => {
  const options: Time[] = [];
  let current = start;
  const endTime = end;
  const stepTime = new Time({ hour: 0, minute: 30 });

  while (current.minutes <= endTime.minutes) {
    options.push(current);
    current = current.add(stepTime);
  }
  return options;
})();

const endTimeOptions = (() => {
  const options: Time[] = [];
  const endTime = end;
  const stepTime = new Time({ hour: 0, minute: 30 });
  let current = Time.fromMinutes(start.minutes + stepTime.minutes);

  while (current.minutes <= endTime.minutes) {
    options.push(current);
    const nextMinutes = current.minutes + stepTime.minutes;
    current = Time.fromMinutes(nextMinutes % 60 === 0 ? nextMinutes - 10 : nextMinutes + 10);
  }
  return options;
})();

export default function Form(props: FormProps) {
  const { t } = useI18n();
  const setOpen = props.setOpen;
  const onCancel = props.onCancel;
  const {
    title = "",
    day = DAY.MON,
    info = "",
    color = customColors[0],
    timeSpan,
    checked = true,
    id = v4(),
    type = "CUSTOM",
  } = props.defaultValue ?? {};

  const { start = startTimeOptions[2], end = endTimeOptions[5] } = timeSpan ?? {};

  const form = createFormGroup({
    title: createFormControl(title, { required: true }),
    day: createFormControl(day),
    info: createFormControl(info),
    color: createFormControl(color),
    start: createFormControl(start),
    end: createFormControl(end),
  });

  // time validation
  createRenderEffect(() => {
    const source = "timeValidation";
    const errors = validateTime(form.controls.start.value, form.controls.end.value);

    if (errors) {
      if (errors.invalidRange) {
        form.controls.end.setErrors(
          { invalidRange: t("menu.actions.addCustomEvent.form.errors.endBeforeStart") },
          { source }
        );
      } else if (errors.outsideAllowedRange) {
        form.controls.start.setErrors(
          { outsideRange: t("menu.actions.addCustomEvent.form.errors.outsideAllowedRange") },
          { source }
        );
        form.controls.end.setErrors(
          { outsideRange: t("menu.actions.addCustomEvent.form.errors.outsideAllowedRange") },
          { source }
        );
      }
    } else {
      form.controls.start.setErrors(null, { source });
      form.controls.end.setErrors(null, { source });
    }
  });

  // title validation
  createRenderEffect(() => {
    const source = "titleValidation";
    if (form.controls.title.value.length < 1 && form.controls.title.isTouched) {
      form.controls.title.setErrors({ required: t("menu.actions.addCustomEvent.form.errors.titleRequired") }, { source });
    } else {
      form.controls.title.setErrors(null, { source });
    }
  });

  const onSubmit = (e: Event) => {
    e.preventDefault();
    if (!form.isValid) return;

    const value = {
      ...form.value,
      timeSpan: form.value.start && form.value.end && new TimeSpan(form.value.start, form.value.end),
      id: id,
      checked: checked,
      type: type,
    } as z.infer<typeof customEventSchema>;

    const result = customEventSchema.safeParse(value);
    if (!result.success) {
      console.error(result.error);
      return;
    }

    setOpen(false);
    props.onSubmit(result.data);
  };

  return (
    <form onSubmit={onSubmit} class="space-y-4">
      <div>
        <TextFieldRoot validationState={form.controls.title.errors ? "invalid" : "valid"}>
          <TextFieldLabel>{t("menu.actions.addCustomEvent.form.title")}</TextFieldLabel>
          <TextField
            type="text"
            name="title"
            required={form.controls.title.isRequired}
            value={form.controls.title.value}
            onInput={(e) => {
              form.controls.title.markTouched(true);
              form.controls.title.setValue(e.currentTarget.value);
            }}
          />
          <TextFieldErrorMessage>
            <For each={Object.values(form.controls.title.errors ?? {})}>
              {(value) => <Text class="text-destructive text-xs">{value}</Text>}
            </For>
          </TextFieldErrorMessage>
        </TextFieldRoot>
      </div>

      <div>
        <Text>{t("menu.actions.addCustomEvent.form.day")}</Text>
        <Select
          value={form.controls.day.value}
          onChange={(value) => value && form.controls.day.setValue(value)}
          validationState={form.controls.day.errors ? "invalid" : "valid"}
          options={days}
          placeholder={t("menu.actions.addCustomEvent.form.dayPlaceholder")}
          selectionBehavior="replace"
          name="day"
          itemComponent={(props) => (
            <SelectItem item={props.item}>
              <Text>{t(`scheduler.days.${props.item.rawValue}`)}</Text>
            </SelectItem>
          )}
        >
          <Select.HiddenSelect />
          <SelectTrigger>
            <SelectValue<DAY>>{({ selectedOption }) => <Text>{t(`scheduler.days.${selectedOption()}`)}</Text>}</SelectValue>
          </SelectTrigger>
          <Select.ErrorMessage>
            <For each={Object.entries(form.controls.day.errors ?? {})}>
              {([key, value]) => <Text class="text-destructive text-xs">{value}</Text>}
            </For>
          </Select.ErrorMessage>
          <SelectContent class="max-h-96 overflow-auto" />
        </Select>
      </div>
      <div>
        <TextFieldRoot>
          <TextFieldLabel>{t("menu.actions.addCustomEvent.form.info")}</TextFieldLabel>
          <TextField
            type="text"
            name="info"
            value={form.controls.info.value}
            onInput={(e) => form.controls.info.setValue(e.currentTarget.value)}
          />
        </TextFieldRoot>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <Text>{t("menu.actions.addCustomEvent.form.start")}</Text>
          <Select
            options={startTimeOptions}
            value={form.controls.start.value}
            onChange={(value) => value && form.controls.start.setValue(value)}
            validationState={form.controls.start.errors ? "invalid" : "valid"}
            optionValue="minutes"
            optionTextValue="minutes"
            selectionBehavior="replace"
            name="startTime"
            itemComponent={(props) => (
              <SelectItem item={props.item}>
                <Text>{props.item.rawValue.formatted()}</Text>
              </SelectItem>
            )}
          >
            <Select.HiddenSelect />
            <SelectTrigger>
              <SelectValue<Time>>{({ selectedOption }) => <Text>{selectedOption().formatted()}</Text>}</SelectValue>
            </SelectTrigger>
            <Select.ErrorMessage>
              <For each={Object.values(form.controls.start.errors ?? {})}>
                {(value) => <Text class="text-destructive text-xs">{value}</Text>}
              </For>
            </Select.ErrorMessage>
            <SelectContent class="max-h-96 overflow-auto" />
          </Select>
        </div>
        <div>
          <Text>{t("menu.actions.addCustomEvent.form.end")}</Text>
          <Select
            options={endTimeOptions}
            value={form.controls.end.value}
            onChange={(value) => value && form.controls.end.setValue(value)}
            validationState={form.controls.end.errors ? "invalid" : "valid"}
            optionValue="minutes"
            optionTextValue="minutes"
            selectionBehavior="replace"
            name="endTime"
            itemComponent={(props) => (
              <SelectItem item={props.item}>
                <Text>{props.item.rawValue.formatted()}</Text>
              </SelectItem>
            )}
          >
            <Select.HiddenSelect />
            <SelectTrigger>
              <SelectValue<Time>>{({ selectedOption }) => <Text>{selectedOption().formatted()}</Text>}</SelectValue>
            </SelectTrigger>
            <Select.ErrorMessage>
              <For each={Object.values(form.controls.end.errors ?? {})}>
                {(value) => <Text class="text-destructive text-xs">{value}</Text>}
              </For>
            </Select.ErrorMessage>
            <SelectContent class="max-h-96 overflow-auto" />
          </Select>
        </div>
      </div>
      <TwitterPicker
        triangle="hide"
        width={"auto"}
        styles={{
          card: { "background-color": "transparent" },
          hash: { "background-color": "hsl(var(--accent))" },
        }}
        colors={customColors}
        color={form.controls.color.value}
        onChange={(color) => form.controls.color.setValue(color.hex)}
      />

      <DialogFooter class="items-end">
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          {t("menu.actions.addCustomEvent.form.cancel")}
        </Button>
        <Button type="submit" class="flex-auto flex-shrink-0" onClick={onCancel}>
          {props.isEdit ? t("menu.actions.addCustomEvent.form.edit") : t("menu.actions.addCustomEvent.form.submit")}
        </Button>
      </DialogFooter>
    </form>
  );
}
