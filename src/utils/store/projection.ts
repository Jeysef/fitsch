type Projection<T extends object = {}> = {
  [K in keyof T]?: T[K] extends object ? Projection<T[K]> : T[K];
};

type ProjectionFn<T extends object = {}> = (store: T) => Projection<T>;

/**
 * Creates a proxy over a Solid store that projects its properties based on a projection function.
 *
 * @param {T} store The reactive state object from a `createStore` or `createMutable` call.
 * @param {ProjectionFn<T>} projection A function that takes the store as input and returns a projection object.
 * @returns {T} A proxied version of the store with projected properties.
 */
export function createProjection<T extends object = {}>(store: T, projection: ProjectionFn<T>): T {
  return new Proxy(store, {
    get(target, prop, receiver) {
      const projected = projection(target);
      if (projected[prop as keyof Projection<T>] !== undefined) {
        return projected[prop as keyof Projection<T>];
      }

      return Reflect.get(target, prop, receiver);
    },
  });
}
