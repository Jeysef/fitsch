import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { splitProps, type ValidComponent } from "solid-js";
import {
  Typography,
  type ExtractTypographyVariantType,
  type TypographyProps
} from ".";

// Specify the variants you want to allow (linting error will be thrown when using exported component with a variant (1) not specified here or (2) not within TypographyVariant)
type AllowedVariants = ExtractTypographyVariantType<
  "p" | "lead" | "largeText" | "mutedText" | "smallText"
>;

interface TextProps<T extends ValidComponent = "p"> extends TypographyProps<T> {
  variant?: AllowedVariants;
}

const Text = <T extends ValidComponent = "p">({ variant = "p", ...props }: PolymorphicProps<T, TextProps<T>>) => {
  const [_, others] = splitProps(props as TextProps<any>, ["variant"])
  return <Typography variant={variant} {...others} />;
}
Text.displayName = "Text";

export default Text;
