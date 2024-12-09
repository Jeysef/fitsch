import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { Component, ValidComponent } from "solid-js";

/**
 * Merge multiple components into a single component.
 * @param components ValidComponents
 * @returns the last component in the array with the rest of the components as the `as` prop
 */
export function asMerge<T extends ValidComponent, R extends Component<PolymorphicProps<T, any>>[]>(
  components: R
): R[number] {
  return components.reduceRight((AsComponent, Current) => {
    return (props) => <Current as={AsComponent} {...props} />;
  });
}
