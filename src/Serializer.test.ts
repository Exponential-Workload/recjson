import { Serializer } from './Serializer';

describe('Serializer', () => {
  let serializer: Serializer;

  beforeEach(() => {
    serializer = new Serializer();
  });

  it('should serialize a simple object', () => {
    const obj = { a: 1, b: 'hello', c: true };
    const serialized = serializer.serialize(obj);
    expect(serialized).toEqual({
      root: 0,
      obj: [
        { a: 1, b: 2, c: 3 },
        1,
        'hello',
        true,
      ],
    });
  });

  it('should serialize an object with nested objects', () => {
    const obj = { a: { b: { c: 1 } } };
    const serialized = serializer.serialize(obj);
    expect(serialized).toEqual({
      root: 0,
      obj: [
        { a: 1 },
        { b: 2 },
        { c: 3 },
        1,
      ],
    });
  });

  it('should serialize an array', () => {
    const obj = [1, 'hello', true];
    const serialized = serializer.serialize(obj);
    expect(serialized).toEqual({
      root: 0,
      obj: [
        [1, 2, 3],
        1,
        'hello',
        true,
      ],
    });
  });

  it('should serialize an object with circular references', () => {
    const obj: any = { a: 1 };
    obj.b = obj;
    const serialized = serializer.serialize(obj);
    expect(serialized).toEqual({
      root: 0,
      obj: [
        { a: 1, b: 0 },
        1,
      ],
    });
  });

  it('should serialize an array with circular references', () => {
    const obj: any[] = [];
    obj.push(obj);
    const serialized = serializer.serialize(obj);
    expect(serialized).toEqual({
      root: 0,
      obj: [
        [0],
      ],
    });
  });

  it('should serialize an array with nested circular references', () => {
    const obj4: any = [];
    const obj3: any = [obj4];
    const obj2: any = [obj3];
    const obj1: any = [obj2];
    const obj0: any = [obj1];
    obj4.push(obj0);
    const serialized = serializer.serialize(obj0);
    expect(serialized).toEqual({
      root: 0,
      obj: [
        [1],
        [2],
        [3],
        [4],
        [0],
      ],
    });
  });

  it('should serialize a basic instance of a class', () => {
    class TestClass {
      public a = 1;
      public b = 'hello';
      public c = true;
    }
    const obj = new TestClass();
    const serialized = serializer.serialize(obj);
    expect(serialized).toEqual({
      root: 0,
      obj: [
        { a: 1, b: 2, c: 3 },
        1,
        'hello',
        true,
      ],
    });
  });
});
