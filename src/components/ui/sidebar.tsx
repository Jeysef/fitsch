// sidebar.tsx
import {
  createContext,
  useContext,
  createSignal,
  createMemo,
  type JSX,
  splitProps,
  Show,
  type ValidComponent,
  type Setter,
  type Accessor,
  type ComponentProps,
  children,
} from "solid-js";
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic";
import { cn } from "~/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import PanelLeft from "lucide-solid/icons/panel-left";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./sheet";
import { Skeleton } from "./skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { createShortcut } from "@solid-primitives/keyboard";
import type { TooltipContentProps } from "@kobalte/core/tooltip";
import { useIsMobile } from "~/lib/hooks";

// Constants
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "15rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

// Context
type SidebarContextProps = {
  state: Accessor<"expanded" | "collapsed">;
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
  openMobile: Accessor<boolean>;
  setOpenMobile: Setter<boolean>;
  isMobile: Accessor<boolean>;
  toggleSidebar: () => void;
};
const SidebarContext = createContext<SidebarContextProps>();

function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider.");
  return ctx;
}


// Provider
function SidebarProvider(props: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  class?: string;
  style?: JSX.CSSProperties;
  children: JSX.Element;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = createSignal(false);
  const [_open, _setOpen] = makePersisted(createSignal(props.open ?? props.defaultOpen ?? true), {
    name: SIDEBAR_COOKIE_NAME,
    storage: cookieStorage.withOptions({ maxAge: SIDEBAR_COOKIE_MAX_AGE }),
  });
  const open = () => (props.open !== undefined ? props.open : _open());
  const setOpen: Setter<boolean> = (value) => {
    const openState: boolean = typeof value === "function" ? value(open()) : value;
    if (props.onOpenChange) props.onOpenChange(openState);
    else _setOpen(openState);
  };
  const toggleSidebar = () => (isMobile() ? setOpenMobile((v) => !v) : setOpen((v) => !v));
  // Keyboard shortcut
  createShortcut(["Control", SIDEBAR_KEYBOARD_SHORTCUT], () => toggleSidebar(), { preventDefault: true });
  const state = createMemo(() => (open() ? "expanded" : "collapsed"));
  const context: SidebarContextProps = {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  };
  return (
    <SidebarContext.Provider value={context}>
      <div
        style={{
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...props.style,
        }}
        class={cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", props.class)}
      >
        {props.children}
      </div>
    </SidebarContext.Provider>
  );
}

// Sidebar
function Sidebar(props: {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
  class?: string;
  children?: JSX.Element;
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  const side = props.side ?? "left";
  const variant = props.variant ?? "sidebar";
  const collapsible = props.collapsible ?? "offcanvas";
  const resolved = children(() => props.children)
  return (
    <Show
      when={collapsible !== "none"}
      fallback={
        <div class={cn("flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground", props.class)}>
          {props.children}
        </div>
      }
    >
      <Show
        when={!isMobile()}
        fallback={
          <Sheet open={openMobile()} onOpenChange={setOpenMobile}>
            <SheetContent
              data-sidebar="sidebar"
              data-mobile="true"
              class="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
              style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE }}
              side={side}
            >
              <SheetHeader class="sr-only">
                <SheetTitle>Sidebar</SheetTitle>
                <SheetDescription>Displays the mobile sidebar.</SheetDescription>
              </SheetHeader>
              <div class="flex h-full w-full flex-col">{resolved()}</div>
            </SheetContent>
          </Sheet>
        }
      >
        <div
          class="group peer hidden text-sidebar-foreground md:block"
          data-state={state()}
          data-collapsible={state() === "collapsed" ? collapsible : ""}
          data-variant={variant}
          data-side={side}
        >
          <div
            class={cn(
              "relative w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[side=right]:rotate-180",
              variant === "floating" || variant === "inset"
                ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
                : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
            )}
          />
          <div
            class={cn(
              "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
              side === "left"
                ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
                : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
              // Adjust the padding for floating and inset variants.
              variant === "floating" || variant === "inset"
                ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
                : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
              props.class
            )}
          >
            <div
              data-sidebar="sidebar"
              class="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
            >
              {resolved()}
            </div>
          </div>
        </div>
      </Show>
    </Show>
  );
}

// SidebarTrigger
function SidebarTrigger(props: { class?: string } & Omit<Parameters<typeof Button>[0], "onClick">) {
  const { toggleSidebar } = useSidebar();
  const [local, rest] = splitProps(props, ["class", "onClick"]);
  return (
    <Button
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      class={cn("h-7 w-7", local.class)}  
      onClick={(e) => {
        local.onClick?.(e);
        toggleSidebar();
      }}
      {...rest}
    >
      <PanelLeft />
      <span class="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

// SidebarRail
function SidebarRail(props: { class?: string } & JSX.HTMLAttributes<HTMLButtonElement>) {
  const [local, rest] = splitProps(props, ["class"]);
  const { toggleSidebar } = useSidebar();
  return (
    <button
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      class={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        local.class
      )}
      {...rest}
    />
  );
}

// SidebarInset
function SidebarInset(props: { class?: string } & JSX.HTMLAttributes<HTMLElement>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <main
      class={cn(
        "relative flex w-full flex-1 flex-col bg-background",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        local.class
      )}
      {...rest}
    />
  );
}

// SidebarInput
function SidebarInput(props: { class?: string } & Parameters<typeof Input>[0]) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <Input
      data-sidebar="input"
      class={cn("h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", local.class)}
      {...rest}
    />
  );
}

// SidebarHeader
function SidebarHeader(props: { class?: string } & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, rest] = splitProps(props, ["class"]);
  return <div data-sidebar="header" class={cn("flex flex-col gap-2 p-2", local.class)} {...rest} />;
}

// SidebarFooter
function SidebarFooter(props: { class?: string } & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, rest] = splitProps(props, ["class"]);
  return <div data-sidebar="footer" class={cn("flex flex-col gap-2 p-2", local.class)} {...rest} />;
}

// SidebarSeparator
function SidebarSeparator(props: { class?: string } & Parameters<typeof Separator>[0]) {
  const [local, rest] = splitProps(props, ["class"]);
  return <Separator data-sidebar="separator" class={cn("mx-2 w-auto bg-sidebar-border", local.class)} {...rest} />;
}

// SidebarContent
function SidebarContent(props: { class?: string } & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-sidebar="content"
      class={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        local.class
      )}
      {...rest}
    />
  );
}

// SidebarGroup
function SidebarGroup(props: { class?: string } & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, rest] = splitProps(props, ["class"]);
  return <div data-sidebar="group" class={cn("relative flex w-full min-w-0 flex-col p-2", local.class)} {...rest} />;
}

// SidebarGroupLabel
type SidebarGroupLabelProps<T extends ValidComponent = "div"> = PolymorphicProps<T, { class?: string }>;

function SidebarGroupLabel<T extends ValidComponent = "div">(props: SidebarGroupLabelProps<T>) {
  const [local, rest] = splitProps(props, ["class", "as"]);
  return (
    <Polymorphic
      data-sidebar="group-label"
      class={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        local.class
      )}
      as={local.as ?? "div"}
      {...rest}
    />
  );
}

// SidebarGroupAction
type SidebarGroupActionProps<T extends ValidComponent = "button"> = PolymorphicProps<T, { class?: string }>;

function SidebarGroupAction<T extends ValidComponent = "button">(props: SidebarGroupActionProps<T>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <button
      data-sidebar="group-action"
      class={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        local.class
      )}
      {...rest}
      as={props.as}
    />
  );
}

// SidebarGroupContent
function SidebarGroupContent(props: { class?: string } & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, rest] = splitProps(props, ["class"]);
  return <div data-sidebar="group-content" class={cn("w-full text-sm", local.class)} {...rest} />;
}

// SidebarMenu
function SidebarMenu(props: { class?: string } & JSX.HTMLAttributes<HTMLUListElement>) {
  const [local, rest] = splitProps(props, ["class"]);
  return <ul data-sidebar="menu" class={cn("flex w-full min-w-0 flex-col gap-1", local.class)} {...rest} />;
}

// SidebarMenuItem
function SidebarMenuItem(props: { class?: string } & JSX.HTMLAttributes<HTMLLIElement>) {
  const [local, rest] = splitProps(props, ["class"]);
  return <li data-sidebar="menu-item" class={cn("group/menu-item relative", local.class)} {...rest} />;
}

// SidebarMenuButton
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type SidebarMenuButtonProps<T extends ValidComponent = "button"> = PolymorphicProps<
  T,
  {
    isActive?: boolean;
    tooltip?: string | TooltipContentProps;
    variant?: VariantProps<typeof sidebarMenuButtonVariants>["variant"];
    size?: VariantProps<typeof sidebarMenuButtonVariants>["size"];
    class?: string;
  }
>;

function SidebarMenuButton<T extends ValidComponent = "button">(props: SidebarMenuButtonProps<T>) {
  const [local, rest] = splitProps(props as SidebarMenuButtonProps, [
    "isActive",
    "tooltip",
    "variant",
    "size",
    "class",
    "as",
    "children",
  ]);
  const { isMobile, state } = useSidebar();

  // // Compose the button with polymorphic as prop
  const button = (parentProps: ComponentProps<typeof TooltipTrigger>) => {
    const as = local.as ?? "button";
    return (
      <Polymorphic
        data-sidebar="menu-button"
        data-size={local.size ?? "default"}
        data-active={local.isActive ?? false}
        class={cn(sidebarMenuButtonVariants({ variant: local.variant, size: local.size }), local.class)}
        {...rest}
        {...parentProps}
        as={as}
      >
        {local.children}
      </Polymorphic>
    );
  };

  return (
    <Show when={local.tooltip} fallback={button({})}>
      <Tooltip placement="right">
        <TooltipTrigger as={button} />
        <TooltipContent
          hidden={state() !== "collapsed" || isMobile()}
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={local.tooltip === "string" ? local.tooltip : undefined}
          {...(typeof local.tooltip !== "string" ? local.tooltip : {})}
        />
      </Tooltip>
    </Show>
  );
}

// SidebarMenuAction
type SidebarMenuActionProps<T extends ValidComponent = "button"> = PolymorphicProps<
  T,
  { class?: string; showOnHover?: boolean }
>;

function SidebarMenuAction<T extends ValidComponent = "button">(props: SidebarMenuActionProps<T>) {
  return (
    <button
      data-sidebar="menu-action"
      class={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        props.showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        props.class
      )}
      {...props}
      as={props.as}
    />
  );
}

// SidebarMenuBadge
function SidebarMenuBadge(props: { class?: string } & JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-sidebar="menu-badge"
      class={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        props.class
      )}
      {...props}
    />
  );
}

// SidebarMenuSkeleton
function SidebarMenuSkeleton(props: { class?: string; showIcon?: boolean } & JSX.HTMLAttributes<HTMLDivElement>) {
  // Random width between 50 to 90%.
  const width = `${Math.floor(Math.random() * 40) + 50}%`;
  return (
    <div data-sidebar="menu-skeleton" class={cn("flex h-8 items-center gap-2 rounded-md px-2", props.class)} {...props}>
      <Show when={props.showIcon}>
        <Skeleton class="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
      </Show>
      <Skeleton
        class="h-4 max-w-[--skeleton-width] flex-1"
        data-sidebar="menu-skeleton-text"
        style={{ "--skeleton-width": width }}
      />
    </div>
  );
}

// SidebarMenuSub
function SidebarMenuSub(props: { class?: string } & JSX.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      data-sidebar="menu-sub"
      class={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        props.class
      )}
      {...props}
    />
  );
}

// SidebarMenuSubItem
function SidebarMenuSubItem(props: JSX.HTMLAttributes<HTMLLIElement>) {
  return <li {...props} />;
}

// SidebarMenuSubButton
type SidebarMenuSubButtonProps<T extends ValidComponent = "a"> = PolymorphicProps<
  T,
  { size?: "sm" | "md"; isActive?: boolean; class?: string }
>;

function SidebarMenuSubButton<T extends ValidComponent = "a">(props: SidebarMenuSubButtonProps<T>) {
  const [local, rest] = splitProps(props as SidebarMenuSubButtonProps, ["size", "isActive", "class", "as"]);
  const size = local.size ?? "md";
  return (
    <Polymorphic
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={local.isActive}
      class={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        local.class
      )}
      {...rest}
      as={local.as ?? "a"}
    >
      {props.children}
    </Polymorphic>
  );
}

// --- Exports ---
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
