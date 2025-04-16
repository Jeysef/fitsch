import { createMemo } from "solid-js";
import { useWindowSize } from "solidjs-use";

export function useIsMobile() {
    const { width } = useWindowSize({
      initialWidth: 1080,
    });
    const isMobile = createMemo(() => width() < 768);
    return isMobile;
  }