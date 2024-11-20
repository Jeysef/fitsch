import LoaderCircle from "lucide-solid/icons/loader-circle";

import { type ComponentProps, splitProps } from "solid-js";

export default function Loader(props: ComponentProps<"div">) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div class={`grid place-items-center h-full ${local.class}`} {...rest}>
      <LoaderCircle class="animate-spin" />
    </div>
  );
}
