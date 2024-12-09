import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { type ValidComponent, splitProps } from "solid-js";
import { type ExtractTypographyVariantType, Typography, type TypographyProps } from ".";

// Specify the variants you want to allow (linting error will be thrown when using exported component with a variant (1) not specified here or (2) not within TypographyVariant)
type AllowedVariants = ExtractTypographyVariantType<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">;

export interface HeadingProps<T extends ValidComponent> extends TypographyProps<T> {
  variant: AllowedVariants;
}

const Heading = <T extends ValidComponent>(props: PolymorphicProps<T, HeadingProps<T>>) => {
  const [local, others] = splitProps(props as HeadingProps<ValidComponent>, ["variant"]);
  return <Typography variant={local.variant} {...others} />;
};

Heading.displayName = "Heading";

export default Heading;
