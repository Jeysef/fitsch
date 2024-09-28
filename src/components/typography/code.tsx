import type { ComponentWithRefType } from "./types/html";
import {
  Typography,
  type ExtractTypographyVariantType,
  type TypographyProps
} from ".";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { splitProps, type ValidComponent } from "solid-js";

// Specify the variants you want to allow (linting error will be thrown when using exported component with a variant (1) not specified here or (2) not within TypographyVariant)
type AllowedVariants = ExtractTypographyVariantType<"inlineCode">;

interface CodeProps
  extends TypographyProps {
  variant?: AllowedVariants;
}

const Code = <T extends ValidComponent = "code">({ variant = "inlineCode", ...props }: PolymorphicProps<T, CodeProps>) => {
  const [_, others] = splitProps(props as CodeProps, ["variant"])
  return <Typography variant={variant} {...others} />;
}

Code.displayName = "Code";

export default Code;
