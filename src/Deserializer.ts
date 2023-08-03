import { PrimitiveWithObjects, SerializedObject } from './types';
import { JSONParser } from '@3xpo/microjson'

export class Deserializer {
  private jsonParser = new JSONParser();
  private serialized: SerializedObject = {
    root: 0,
    obj: [],
  };
  private objectMap: PrimitiveWithObjects[] = [];
  private _deserialize(index = this.serialized.root): PrimitiveWithObjects {
    const serialized = this.serialized, objectMap = this.objectMap;
    if (objectMap[index])
      return objectMap[index];
    const object = serialized.obj[index];
    if (Array.isArray(object)) {
      const obj: any[] = [];
      objectMap[index] = obj;
      for (let i = 0; i < object.length; i++) {
        const value = object[i];
        obj.push(this._deserialize(value as number));
      }
      return obj;
    } else if (typeof object === 'object' && object !== null) {
      const keys = Object.keys(object);
      const values = Object.values(object);
      const obj: Record<string, any> = {};
      objectMap[index] = obj;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = values[i];
        obj[key] = this._deserialize(value as number);
      }
      return obj;
    } else {
      objectMap[index] = object;
      return object;
    }
  }
  /**
   * Deserializes a given SerializedObject into its original object representation.
   * The `SerializedObject` is a data structure containing the serialized object
   * with object references represented by indices.
   *
   * You should probabally use {@link Deserializer.deserializeTyped} instead for typed code.
   *
   * @param {SerializedObject} serialized - The SerializedObject to be deserialized.
   * @returns {any} The deserialized object.
   *
   * @typedef {string|number|boolean|null} PrimitiveWithObjects - Represents a primitive value or an object.
   * @typedef {Object} SerializedObject - Data structure containing the serialized object.
   * @property {number} root - The index of the root object in the `objects` array.
   * @property {PrimitiveWithObjects[]} objects - Array of serialized objects.
   *
   * @example
   * // Example 1: Deserialize a simple object
   * const serializedObj1 = { root: 0, obj: [{ name: 'John', age: 30 }] };
   * const deserializer = new Deserializer();
   * const obj1 = deserializer.deserialize(serializedObj1);
   * console.log(obj1);
   * // Output: { name: 'John', age: 30 }
   *
   * @example
   * // Example 2: Deserialize an object with nested objects
   * const serializedNestedObj = { root: 0, obj: [{ prop1: 'Hello', prop2: { nestedProp: 'World' } }] };
   * const deserializedNestedObj = deserializer.deserialize(serializedNestedObj);
   * console.log(deserializedNestedObj);
   * // Output: { prop1: 'Hello', prop2: { nestedProp: 'World' } }
   *
   * @example
   * // Example 3: Deserialize an object with circular references
   * const serializedObj3 = { root: 0, obj: [{ a: 'hello', selfRef: 0 }] };
   * const obj3 = deserializer.deserialize(serializedObj3);
   * console.log(obj3);
   * // Output: { a: 'hello', selfRef: { a: 'hello', selfRef: [Circular] } }
   */
  public deserialize(serialized: SerializedObject): any {
    this.serialized = serialized;
    this.objectMap = [];
    return this._deserialize();
  }
  /**
   * Deserializes a given SerializedObject into its original object representation
   * and returns it with a specified type.
   *
   * @template T
   * @param {SerializedObject} serialized - The SerializedObject to be deserialized.
   * @returns {T} The deserialized object with the specified type.
   *
   * @see {@link deserialize}
   *
   * @typedef {string|number|boolean|null} PrimitiveWithObjects - Represents a primitive value or an object.
   * @typedef {Object} SerializedObject - Data structure containing the serialized object.
   * @property {number} root - The index of the root object in the `objects` array.
   * @property {PrimitiveWithObjects[]} objects - Array of serialized objects.
   *
   * @example
   * // Example: Deserialize with a specified type
   * const serializedObj = { root: 0, obj: [{ name: 'Alice', age: 25 }] };
   * const deserializer = new Deserializer();
   * const deserializedObj = deserializer.deserializeTyped<{ name: string; age: number }>(serializedObj);
   * console.log(deserializedObj);
   * // Output: { name: 'Alice', age: 25 }
   */
  public deserializeTyped<T extends PrimitiveWithObjects>(serialized: SerializedObject): T {
    return this.deserialize(serialized) as T;
  }
  /**
   * Deserializes a given SerializedObject into its original object representation
   * and returns it with a specified type. This version allows specifying a different
   * type than {@link deserializeTyped} allows. It's only for edge-cases.
   *
   * @template T
   * @param {SerializedObject} serialized - The SerializedObject to be deserialized.
   * @returns {T} The deserialized object with the specified type or the fallback type if not matched.
   *
   * @see {@link deserializeTyped}
   * @see {@link deserialize}
   *
   * @typedef {string|number|boolean|null} PrimitiveWithObjects - Represents a primitive value or an object.
   * @typedef {Object} SerializedObject - Data structure containing the serialized object.
   * @property {number} root - The index of the root object in the `objects` array.
   * @property {PrimitiveWithObjects[]} objects - Array of serialized objects.
   *
   * @example
   * // Example: Deserialize with a specified type and fallback type
   * const serializedObj = { root: 0, obj: [{ name: 'Bob', age: 35 }] };
   * const deserializer = new Deserializer();
   * const deserializedObj = deserializer._deserializeTyped_notPrimitive<{ name: string; age: number } | null>(serializedObj);
   * console.log(deserializedObj);
   * // Output: { name: 'Bob', age: 35 }
   */
  public _deserializeTyped_notPrimitive<T = PrimitiveWithObjects>(serialized: SerializedObject): T {
    return this.deserialize(serialized) as T;
  }
  /**
    * Variant of {@link deserialize} that parses the serialized object encoded as JSON
    * @param {string} serialized - The serialized object encoded as JSON
    * @param {boolean} [useNative=false] - Whether to use the native JSON parser instead of microjson
    */
  public deserializeFromJSON(serialized: string, useNative: boolean = false): any {
    return this.deserialize(useNative ? JSON.parse(serialized) : this.jsonParser.parse(serialized));
  }
  /**
    * Variant of {@link deserializeTyped} that parses the serialized object encoded as JSON
    * @param {string} serialized - The serialized object encoded as JSON
    * @param {boolean} [useNative=false] - Whether to use the native JSON parser instead of microjson
    */
  public deserializeFromJSONTyped<T extends PrimitiveWithObjects>(serialized: string, useNative: boolean = false): T {
    return this.deserializeTyped<T>(useNative ? JSON.parse(serialized) : this.jsonParser.parse(serialized));
  }
  // parse->serialize aliases
  /**
    * Alias to {@link deserialize}
    * @param {SerializedObject} serialized - The SerializedObject to be deserialized.
    * @returns {any} The deserialized object.
    */
  public parse(serialized: SerializedObject): any {
    return this.deserialize(serialized);
  }
  /**
    * Alias to {@link deserializeTyped}
    * @param {SerializedObject} serialized - The SerializedObject to be deserialized.
    * @returns {T} The deserialized object with the specified type.
    */
  public parseTyped<T extends PrimitiveWithObjects>(serialized: SerializedObject): T {
    return this.deserializeTyped<T>(serialized);
  }
  /**
    * Alias to {@link _deserializeTyped_notPrimitive}
    * @param {SerializedObject} serialized - The SerializedObject to be deserialized.
    * @returns {T} The deserialized object with the specified type or the fallback type if not matched.
    */
  public _parseTyped_notPrimitive<T = PrimitiveWithObjects>(serialized: SerializedObject): T {
    return this._deserializeTyped_notPrimitive<T>(serialized);
  }
  /**
    * Alias to {@link deserializeFromJSON}
    * @param {string} serialized - The serialized object encoded as JSON
    * @param {boolean} [useNative=false] - Whether to use the native JSON parser instead of microjson
    */
  public parseFromJSON(serialized: string, useNative: boolean = false): any {
    return this.deserializeFromJSON(serialized, useNative);
  }
  /**
    * Alias to {@link deserializeFromJSONTyped}
    * @param {string} serialized - The serialized object encoded as JSON
    * @param {boolean} [useNative=false] - Whether to use the native JSON parser instead of microjson
    */
  public parseFromJSONTyped<T extends PrimitiveWithObjects>(serialized: string, useNative: boolean = false): T {
    return this.deserializeFromJSONTyped<T>(serialized, useNative);
  }
  // decode->deserialize aliases
  /**
    * Alias to {@link deserialize}
    * @param {SerializedObject} serialized - The SerializedObject to be deserialized.
    * @returns {any} The deserialized object.
    */
  public decode(serialized: SerializedObject): any {
    return this.deserialize(serialized);
  }
  /**
    * Alias to {@link deserializeTyped}
    * @param {SerializedObject} serialized - The SerializedObject to be deserialized.
    * @returns {T} The deserialized object with the specified type.
    */
  public decodeTyped<T extends PrimitiveWithObjects>(serialized: SerializedObject): T {
    return this.deserializeTyped<T>(serialized);
  }
  /**
    * Alias to {@link _deserializeTyped_notPrimitive}
    * @param {SerializedObject} serialized - The SerializedObject to be deserialized.
    * @returns {T} The deserialized object with the specified type or the fallback type if not matched.
    */
  public _decodeTyped_notPrimitive<T = PrimitiveWithObjects>(serialized: SerializedObject): T {
    return this._deserializeTyped_notPrimitive<T>(serialized);
  }
  /**
    * Alias to {@link deserializeFromJSON}
    * @param {string} serialized - The serialized object encoded as JSON
    * @param {boolean} [useNative=false] - Whether to use the native JSON parser instead of microjson
    */
  public decodeFromJSON(serialized: string, useNative: boolean = false): any {
    return this.deserializeFromJSON(serialized, useNative);
  }
  /**
    * Alias to {@link deserializeFromJSONTyped}
    * @param {string} serialized - The serialized object encoded as JSON
    * @param {boolean} [useNative=false] - Whether to use the native JSON parser instead of microjson
    */
  public decodeFromJSONTyped<T extends PrimitiveWithObjects>(serialized: string, useNative: boolean = false): T {
    return this.deserializeFromJSONTyped<T>(serialized, useNative);
  }
}