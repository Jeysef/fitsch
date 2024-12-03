import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic";
import { type VariantProps, cva } from "class-variance-authority";
import { type JSX, type ValidComponent, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

const typographyVariants = cva("text-foreground transition-[border-color]", {
  variants: {
    emVariant: {
      h1: "em:scroll-m-20 em:text-4xl em:font-extrabold em:tracking-tight em:lg:text-5xl",
      h2: "em:scroll-m-20 em:border-b em:pb-2 em:text-3xl em:font-semibold em:tracking-tight em:first:mt-0",
      h3: "em:scroll-m-20 em:text-2xl em:font-semibold em:tracking-tight",
      h4: "em:scroll-m-20 em:text-xl em:font-semibold em:tracking-tight",
      h5: "em:scroll-m-20 em:text-lg em:font-semibold em:tracking-tight",
      h6: "em:scroll-m-20 em:text-base em:font-semibold em:tracking-tight",
      p: "em:leading-7 em:[&:not(:first-child)]:mt-6",
      blockquote: "em:mt-6 em:border-l-2 em:pl-6 italic",
      ul: "em:my-6 em:ml-6 list-disc em:[&>li]:mt-2",
      inlineCode: "em:relative em:rounded bg-muted px-[0.3em] py-[0.2em] font-mono em:text-sm em:font-semibold",
      lead: "em:text-xl text-muted-foreground",
      largeText: "em:text-lg font-semibold",
      smallText: "em:text-sm font-medium leading-none",
      mutedText: "em:text-sm text-muted-foreground",
    },
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight",
      h6: "scroll-m-20 text-base font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      ul: "my-6 ml-6 list-disc [&>li]:mt-2",
      inlineCode: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
      largeText: "text-lg font-semibold",
      smallText: "text-sm font-medium leading-none",
      mutedText: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

type VariantPropType = VariantProps<typeof typographyVariants>;

const variantElementMap: Record<NonNullable<VariantPropType["variant"]>, string> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  blockquote: "blockquote",
  inlineCode: "code",
  largeText: "div",
  smallText: "small",
  lead: "p",
  mutedText: "p",
  ul: "ul",
};

export interface TypographyProps<T extends ValidComponent = "p">
  extends JSX.HTMLAttributes<HTMLElement>,
    TypographyVariantsType {
  as?: T;
  em?: boolean;
}

const Typography = <T extends ValidComponent = "p">(props: PolymorphicProps<T, TypographyProps<T>>) => {
  const [local, others] = splitProps(props, ["variant", "as", "class", "em"]);
  const variant = local.variant;
  const type = local.em ? "emVariant" : "variant";
  const comp = local.as || (variant && variantElementMap[variant]) || "p";

  return (
    <Polymorphic as={comp} class={cn(typographyVariants({ variant: null, [type]: variant }), local.class)} {...others} />
  );
};

Typography.displayName = "Typography";

type TypographyVariantsType = VariantProps<typeof typographyVariants>;

export type ExtractTypographyVariantType<Union extends Partial<TypographyVariantsType["variant"]>> = Union | null;

export { Typography, typographyVariants };
