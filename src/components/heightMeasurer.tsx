import type { Accessor } from "solid-js";

export function createElementHeightRef(disable: Accessor<boolean>, cssVariableName = "--element-height") {
  let observer: ResizeObserver | undefined;
  return (el: HTMLDivElement | null) => {
    if (el) {
      observer = new ResizeObserver((entries) => {
        if (!disable()) {
          for (const entry of entries) {
            const height = entry.contentRect.height;
            requestAnimationFrame(() => {
              el.style.setProperty(cssVariableName, `${height.toFixed(2)}px`);
            });
          }
        }
      });
      observer.observe(el);
    } else if (observer) {
      observer.disconnect();
    }
  };
}
