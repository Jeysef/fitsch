import { clientOnly } from "@solidjs/start";

const ClientOnlyComp = clientOnly(() => import("./main"));

export default function IsomorphicComp() {
  return <ClientOnlyComp />;
}
