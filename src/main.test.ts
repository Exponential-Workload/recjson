import { Serializer, Deserializer } from './main';

describe('Overall end-user functionality', () => {
  let serializer: Serializer;
  let deserializer: Deserializer;

  beforeEach(() => {
    serializer = new Serializer();
    deserializer = new Deserializer();
  });

  it('should serialize and deserialize a simple object', () => {
    const obj = { a: 1, b: 'hello', c: true };
    const serialized = serializer.serialize(obj);
    const deserialized = deserializer.deserialize(serialized);
    expect(deserialized).toEqual(obj);
  })

  it('should serialize and deserialize an object with nested objects', () => {
    const obj = { a: { b: { c: 1 } } };
    const serialized = serializer.serialize(obj);
    const deserialized = deserializer.deserialize(serialized);
    expect(deserialized).toEqual(obj);
  })

  it('should serialize and deserialize an array', () => {
    const obj = [1, 'hello', true];
    const serialized = serializer.serialize(obj);
    const deserialized = deserializer.deserialize(serialized);
    expect(deserialized).toEqual(obj);
  })

  it('should serialize and deserialize an object with circular references', () => {
    const obj: any = { a: 1 };
    obj.b = obj;
    const serialized = serializer.serialize(obj);
    const deserialized = deserializer.deserialize(serialized);
    expect(deserialized).toEqual(obj);
  })

  it('should serialize and deserialize an object with multiple circular references', () => {
    const obj: any = { a: 1 };
    obj.b = obj;
    obj.c = obj;
    const serialized = serializer.serialize(obj);
    const deserialized = deserializer.deserialize(serialized);
    expect(deserialized).toEqual(obj);
  })

  it('should serialize and deserialize an object with an array with multiple circular references', () => {
    const obj: any = {};
    obj.a = [];
    obj.a[0] = [];
    obj.a[0][0] = obj.a[0];
    obj.a[0][1] = obj;
    obj.a[0][2] = obj.a;
    obj.b = obj.a[0];

    const serialized = serializer.serialize(obj);
    const deserialized = deserializer.deserialize(serialized);
    expect(deserialized).toEqual(obj);
  })

  it('should serialize and deserialize the items of a class', () => {
    class A {
      a: number = 69;
      b: string = 'i<3astolfo';
      c: boolean = !0;
    }
    const obj = new A();

    const serialized = serializer.serialize(obj);
    const deserialized = deserializer.deserialize(serialized);
    expect(deserialized).toEqual({
      a: 69,
      b: 'i<3astolfo',
      c: true,
    });
  })

  it('should serialize and deserialize the items of a recursive class', () => {
    class A {
      a: number = 69;
      b: string = 'i<3astolfo';
      c: boolean = !0;
      d: A = this;
    }
    const obj = new A();

    const expected = {
      a: 69,
      b: 'i<3astolfo',
      c: true,
    } as any;
    expected.d = expected;

    const serialized = serializer.serialize(obj);
    const deserialized = deserializer.deserialize(serialized);
    expect(deserialized).toEqual(expected);
  })

  it('should serialize and deserialize the items of a deeply nested recursive class', () => {
    class A {
      a: number = 69;
      b: string = 'i<3astolfo';
      c: boolean = !0;
      d: Record<string, A[][][]> = {
        a: [
          [
            [
              this,
            ],
          ],
        ],
      }
    }
    const obj = new A();

    const expected = {
      a: 69,
      b: 'i<3astolfo',
      c: true,
      d: {
        a: [[[]]]
      }
    } as any;
    expected.d.a[0][0][0] = expected;

    const serialized = serializer.serialize(obj);
    const deserialized = deserializer.deserialize(serialized);
    expect(deserialized).toEqual(expected);
  })

  it('should serialize and deserialize to json', () => {
    const obj = { a: 1, b: 'hello', c: true };
    const serialized = serializer.serializeToJSON(obj);
    console.log(serialized);

    const deserialized = deserializer.deserializeFromJSON(serialized);
    expect(deserialized).toEqual(obj);
  })

  it('should serialize and deserialize to json an object with nested objects', () => {
    const obj = { a: { b: { c: 1 } } };
    const serialized = serializer.serializeToJSON(obj);
    const deserialized = deserializer.deserializeFromJSON(serialized);
    expect(deserialized).toEqual(obj);
  })
})