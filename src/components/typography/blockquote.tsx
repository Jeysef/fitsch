import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { type ValidComponent, splitProps } from "solid-js";
import { type ExtractTypographyVariantType, Typography, type TypographyProps } from ".";

// Specify the variants you want to allow (linting error will be thrown when using exported component with a variant (1) not specified here or (2) not within TypographyVariant)
type AllowedVariants = ExtractTypographyVariantType<"blockquote">;

export interface BlockquoteProps<T extends ValidComponent = "blockquote"> extends TypographyProps<T> {
  variant?: AllowedVariants;
}

const Blockquote = <T extends ValidComponent = "blockquote">({
  variant = "blockquote",
  ...props
}: PolymorphicProps<T, BlockquoteProps<T>>) => {
  const [_, others] = splitProps(props as BlockquoteProps<ValidComponent>, ["variant"]);
  return <Typography variant={variant} {...others} />;
};

Blockquote.displayName = "Blockquote";

export default Blockquote;
