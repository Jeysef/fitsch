export interface SerializedClass<T = string> {
  __type: T;
  [key: string]: unknown;
}

export interface Serializable<T = string> {
  toJSON(): { __type: T; [key: string]: unknown };
}

// static properties
export interface SerializableClass<T = string> {
  fromJSON(json: unknown): Serializable<T>;
  readonly __type: T;
}

function isSerializedClass(value: unknown): value is SerializedClass {
  return typeof value === "object" && value !== null && "__type" in value;
}

export class ClassRegistry {
  private static classMap = new Map<string, SerializableClass>();

  static register<T extends SerializableClass>(serializableClass: T) {
    this.classMap.set(serializableClass.__type, serializableClass);
  }

  static fromJSON(value: unknown): SerializableClass | unknown {
    if (isSerializedClass(value)) {
      if (!this.classMap.has(value.__type)) {
        throw new Error(`Class ${value.__type} is not registered`);
      }
      const ClassConstructor = this.classMap.get(value.__type)!;
      return ClassConstructor.fromJSON(value);
    }
    return value;
  }

  static reviver(_key: string, value: unknown) {
    return ClassRegistry.fromJSON(value);
  }
}
