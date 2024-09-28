import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { splitProps, type ValidComponent } from "solid-js";
import {
  Typography,
  type ExtractTypographyVariantType,
  type TypographyProps
} from ".";

// Specify the variants you want to allow (linting error will be thrown when using exported component with a variant (1) not specified here or (2) not within TypographyVariant)
type AllowedVariants = ExtractTypographyVariantType<"ul">;

interface ListProps<T extends ValidComponent = "ul"> extends TypographyProps<T> {
  variant?: AllowedVariants;
}

const List = <T extends ValidComponent = "ul">({ variant = "ul", ...props }: PolymorphicProps<T, ListProps<T>>) => {
  const [_, others] = splitProps(props as ListProps<any>, ["variant"]);
  return <Typography variant={variant} {...others} />;
}

List.displayName = "List";

export default List;  