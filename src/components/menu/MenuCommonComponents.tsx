import { splitProps, type FlowComponent, type ValidComponent } from "solid-js";
import type { StrictOmit } from "ts-essentials";
import Heading, { type HeadingProps } from "~/components/typography/heading";
import Text, { type TextProps } from "~/components/typography/text";
import { cn } from "~/lib/utils";

export const SectionHeading: FlowComponent<StrictOmit<HeadingProps<"h3">, "variant">> = (props) => {
  const [local, others] = splitProps(props, ["children", "class"]);
  return (
    <Heading as="h3" variant="h5" class={cn("mb-1", local.class)} {...others}>
      {local.children}
    </Heading>
  );
};

export const SubSectionHeading: FlowComponent<StrictOmit<HeadingProps<"p">, "variant">> = (props) => {
  const [local, others] = splitProps(props, ["children", "class"]);
  return (
    <Heading as="p" variant="h6" class={cn("mb-1", local.class)} {...others}>
      {local.children}
    </Heading>
  );
};

export const ItemText: FlowComponent<StrictOmit<TextProps<ValidComponent>, "variant">> = (props) => {
  const [local, others] = splitProps(props, ["children", "class"]);
  return (
    <Text variant={null} class={cn("text-sm leading-6", local.class)} {...others}>
      {local.children}
    </Text>
  );
};
