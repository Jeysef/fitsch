import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { splitProps, type ValidComponent } from "solid-js";
import {
  Typography,
  type ExtractTypographyVariantType,
  type TypographyProps
} from ".";

// Specify the variants you want to allow (linting error will be thrown when using exported component with a variant (1) not specified here or (2) not within TypographyVariant)
type AllowedVariants = ExtractTypographyVariantType<"inlineCode">;

interface CodeProps<T extends ValidComponent = "code">
  extends TypographyProps<T> {
  variant?: AllowedVariants;
}

const Code = <T extends ValidComponent = "code">({ variant = "inlineCode", ...props }: PolymorphicProps<T, CodeProps<T>>) => {
  const [_, others] = splitProps(props as CodeProps<any>, ["variant"])
  return <Typography variant={variant} {...others} />;
}

Code.displayName = "Code";

export default Code;
