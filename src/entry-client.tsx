// @refresh reload
import { StartClient, mount } from "@solidjs/start/client";
import "~/env/client";

mount(() => <StartClient />, document.getElementById("app")!);
