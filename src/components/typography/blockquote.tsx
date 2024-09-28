import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { splitProps, type ValidComponent } from "solid-js";
import {
  Typography,
  type ExtractTypographyVariantType,
  type TypographyProps
} from ".";

// Specify the variants you want to allow (linting error will be thrown when using exported component with a variant (1) not specified here or (2) not within TypographyVariant)
type AllowedVariants = ExtractTypographyVariantType<"blockquote">;

export interface BlockquoteProps
  extends TypographyProps {
  variant?: AllowedVariants;
}

const Blockquote = <T extends ValidComponent = "blockquote">({ variant = "blockquote", ...props }: PolymorphicProps<T, BlockquoteProps>) => {
  const [_, others] = splitProps(props as BlockquoteProps, ["variant"])
  return <Typography variant={variant} {...others} />;
}

Blockquote.displayName = "Blockquote";

export default Blockquote;
