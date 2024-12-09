import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { type ValidComponent, splitProps } from "solid-js";
import { type ExtractTypographyVariantType, Typography, type TypographyProps } from ".";

// Specify the variants you want to allow (linting error will be thrown when using exported component with a variant (1) not specified here or (2) not within TypographyVariant)
type AllowedVariants = ExtractTypographyVariantType<"p" | "lead" | "largeText" | "mutedText" | "smallText">;

export interface TextProps<T extends ValidComponent = "p"> extends TypographyProps<T> {
  variant?: AllowedVariants;
}

const Text = <T extends ValidComponent = "p">(props: PolymorphicProps<T, TextProps<T>>) => {
  const [local, others] = splitProps(props as TextProps<ValidComponent>, ["variant"]);
  return <Typography variant={local.variant === undefined ? "p" : local.variant} {...others} />;
};
Text.displayName = "Text";

export default Text;
