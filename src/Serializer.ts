import { PrimitiveWithObjects, SerializedObject } from './types';
import { JSONSerializer } from '@3xpo/microjson'

export class Serializer {
  private jsonSerializer = new JSONSerializer();
  private _serialize(obj: PrimitiveWithObjects): number {
    const serialized = this.currentSerialized, objectMap = this.objectMap;
    const object = objectMap.indexOf(obj);
    if (object !== -1)
      return object;
    const index = objectMap.push(obj) - 1;
    if (Array.isArray(obj)) {
      serialized.obj[index] = obj.map((value) => this._serialize(value));
      return index;
    } else if (typeof obj === 'object' && obj !== null) {
      const keys = Object.keys(obj);
      const values = Object.values(obj);
      const object: Record<string, number> = {};
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = values[i];
        object[key] = this._serialize(value);
      }
      serialized.obj[index] = object;
      return index;
    } else {
      // @ts-ignore
      serialized.obj[index] = obj;
      return index;
    }
  }
  private currentSerialized: SerializedObject = {
    root: 0,
    obj: [],
  };
  private objectMap: PrimitiveWithObjects[] = [];
  /**
  * Serializes a given object and its nested properties into a SerializedObject.
  * The `SerializedObject` is a data structure containing the serialized object
  * with object references represented by indices.
  *
  * @param {PrimitiveWithObjects} obj - The object to be serialized.
  * @returns {SerializedObject} The SerializedObject representation of the input object.
  *
  * @typedef {string|number|boolean|null} PrimitiveWithObjects - Represents a primitive value or an object.
  * @typedef {Object} SerializedObject - Data structure containing the serialized object.
  * @property {number} root - The index of the root object in the `objects` array.
  * @property {PrimitiveWithObjects[]} objects - Array of serialized objects.
  *
  * @example
  * // Example 1: Serialize a simple object
  * const obj1 = { name: 'John', age: 30 };
  * const serializer = new Serializer();
  * const serializedObj1 = serializer.serialize(obj1);
  * console.log(serializedObj1);
  * // Output: { root: 0, obj: [{ name: 'John', age: 30 }] }
  *
  * @example
  * // Example 2: Serialize an object with nested objects
  * const nestedObj = { prop1: 'Hello', prop2: { nestedProp: 'World' } };
  * const serializedNestedObj = serializer.serialize(nestedObj);
  * console.log(serializedNestedObj);
  * // Output: { root: 0, obj: [{ prop1: 'Hello', prop2: { nestedProp: 'World' } }] }
  *
  * @example
  * // Example 3: Serialize an object with circular references
  * const obj3 = { a: 'hello' };
  * obj3.selfRef = obj3; // Circular reference
  * const serializedObj3 = serializer.serialize(obj3);
  * console.log(serializedObj3);
  * // Output: { root: 0, obj: [{ a: 'hello', selfRef: 0 }] }
  */
  public serialize(obj: PrimitiveWithObjects): SerializedObject {
    this.currentSerialized = {
      root: 0,
      obj: [],
    };
    this.objectMap = [];
    this.currentSerialized.root = this._serialize(obj);
    return this.currentSerialized;
  }
  /**
    * Variant of {@link Serializer.serialize} that returns a stringified JSON representation of the serialized object.
    * @param {PrimitiveWithObjects} obj - The object to be serialized.
    * @param {boolean} [useNative=false] - Whether to use the native JSON parser instead of microjson
    */
  public serializeToJSON(obj: PrimitiveWithObjects, useNative: boolean = false): string {
    const serialized = this.serialize(obj);
    if (useNative)
      return JSON.stringify(serialized);
    return this.jsonSerializer.serialize(serialized);
  }
  // stringify->serialize aliases
  /**
    * Alias of {@link Serializer.serialize}.
    * @param {PrimitiveWithObjects} obj - The object to be serialized.
    */
  public stringify(obj: PrimitiveWithObjects): SerializedObject {
    return this.serialize(obj);
  }
  /**
    * Alias of {@link Serializer.serializeToJSON}.
    * @param {PrimitiveWithObjects} obj - The object to be serialized.
    * @param {boolean} [useNative=false] - Whether to use the native JSON parser instead of microjson
    */
  public stringifyToJSON(obj: PrimitiveWithObjects, useNative: boolean = false): string {
    return this.serializeToJSON(obj, useNative);
  }
  // encode->serialize aliases
  /**
    * Alias of {@link Serializer.serialize}.
    * @param {PrimitiveWithObjects} obj - The object to be serialized.
    */
  public encode(obj: PrimitiveWithObjects): SerializedObject {
    return this.serialize(obj);
  }
  /**
    * Alias of {@link Serializer.serializeToJSON}.
    * @param {PrimitiveWithObjects} obj - The object to be serialized.
    * @param {boolean} [useNative=false] - Whether to use the native JSON parser instead of microjson
    */
  public encodeToJSON(obj: PrimitiveWithObjects, useNative: boolean = false): string {
    return this.serializeToJSON(obj, useNative);
  }
}
export default Serializer;
