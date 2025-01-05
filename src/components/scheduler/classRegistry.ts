export interface Serializable {
  toJSON(): { __type: string; [key: string]: any };
}

export interface SerializableConstructor {
  new (...args: any[]): Serializable;
  fromJSON(json: any): Serializable;
  readonly __type: string;
}

// biome-ignore lint/complexity/noStaticOnlyClass: <singleton>
export class ClassRegistry {
  // private static classMap = new Map<string, new (...args: any[]) => Serializable>();
  private static classMap = new Map<string, SerializableConstructor>();

  static register<T extends SerializableConstructor>(className: string, classConstructor: T) {
    // biome-ignore lint/complexity/noThisInStatic: <not confusing>
    this.classMap.set(className, classConstructor);
  }

  static fromJSON(json: any): Serializable | any {
    // biome-ignore lint/complexity/noThisInStatic: <not confusing>
    if (json?.__type && this.classMap.has(json.__type)) {
      // biome-ignore lint/complexity/noThisInStatic: <not confusing>
      const ClassConstructor = this.classMap.get(json.__type)!;
      return ClassConstructor.fromJSON(json);
    }
    return json;
  }

  static reviver(key: string, value: any) {
    return ClassRegistry.fromJSON(value);
  }
}
