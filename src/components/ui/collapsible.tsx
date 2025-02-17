import type { CollapsibleContentProps } from "@kobalte/core/collapsible";
import { Collapsible as CollapsiblePrimitive } from "@kobalte/core/collapsible";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ValidComponent } from "solid-js";
import { createSignal, onMount, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

export const Collapsible = CollapsiblePrimitive;

export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

type collapsibleContentProps<T extends ValidComponent = "div"> = CollapsibleContentProps<T> & {
  class?: string;
};

export const CollapsibleContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, collapsibleContentProps<T>>
) => {
  const [local, rest] = splitProps(props as collapsibleContentProps, ["class"]);
  const [mounted, setMounted] = createSignal(false);

  onMount(() => setMounted(true));

  return (
    <CollapsiblePrimitive.Content
      class={cn(
        mounted() ? "animate-collapsible-up data-[expanded]:animate-collapsible-down" : "",
        "overflow-hidden",
        local.class
      )}
      {...rest}
    />
  );
};
