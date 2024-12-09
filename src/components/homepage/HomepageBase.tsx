import { clientOnly } from "@solidjs/start";

const ClientOnlyComp = clientOnly(() => import("./Homepage"));

export default function IsomorphicComp() {
  return <ClientOnlyComp />;
}
