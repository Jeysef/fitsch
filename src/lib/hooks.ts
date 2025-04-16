import { createMemo } from "solid-js";
import { useWindowSize } from "solidjs-use";

/**
 * Determines if the current window width is considered "mobile" (less than 768px).
 *
 * @returns A memoized accessor function that returns `true` if the window width is less than 768 pixels, otherwise `false`.
 *
 * @remarks
 * Uses `solidjs-use`'s `useWindowSize` to track window width reactively.
 * The initial width is set to 1080 pixels.
 * 
 * @warning
 * do not use in render
 */
export function useIsMobile() {
    const { width } = useWindowSize({
      initialWidth: 1080,
    });
    const isMobile = createMemo(() => width() < 768);
    return isMobile;
  }