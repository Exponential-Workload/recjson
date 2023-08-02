import { Deserializer } from './Deserializer';

describe('Deserializer', () => {
  let deserializer: Deserializer;

  beforeEach(() => {
    deserializer = new Deserializer();
  });

  it('should deserialize a simple object', () => {
    const serialized = {
      root: 0,
      obj: [
        { a: 1, b: 2, c: 3 },
        1,
        'hello',
        true,
      ],
    };
    const deserialized = deserializer.deserialize(serialized);
    expect(deserialized).toEqual({ a: 1, b: 'hello', c: true });
  });

  it('should deserialize an object with nested objects', () => {
    const serialized = {
      root: 0,
      obj: [
        { a: 1 },
        { b: 2 },
        { c: 3 },
        1,
      ],
    };
    const deserialized = deserializer.deserialize(serialized as any);
    expect(deserialized).toEqual({ a: { b: { c: 1 } } });
  });

  it('should deserialize an array', () => {
    const serialized = {
      root: 0,
      obj: [
        [1, 2, 3],
        1,
        'hello',
        true,
      ],
    };
    const deserialized = deserializer.deserialize(serialized);
    expect(deserialized).toEqual([1, 'hello', true]);
  });

  it('should deserialize an object with circular references', () => {
    const serialized = {
      root: 0,
      obj: [
        { a: 1, b: 0 },
        1,
      ],
    };
    const deserialized = deserializer.deserialize(serialized);
    expect(deserialized).toEqual({ a: 1, b: deserialized });
  });

  it('should deserialize an object with nested circular references', () => {
    const serialized = {
      root: 0,
      obj: [
        { child: 1, child2: 2 },
        { parent: 0, name: 3, },
        { parent: 0, name: 4, },
        'child-1',
        'child-2',
      ],
    };
    const deserialized = deserializer.deserialize(serialized as any);
    const expected = {
      child: null as any,
      child2: null as any,
    };
    expected.child = {
      parent: expected,
      name: 'child-1',
    };
    expected.child2 = {
      parent: expected,
      name: 'child-2',
    };
    expect(deserialized).toEqual(expected);
  });

  it('should deserialize an array with circular references', () => {
    const serialized = {
      root: 0,
      obj: [
        [0]
      ],
    };
    const deserialized = deserializer.deserialize(serialized);
    const expected: any[] = [];
    expected.push(expected);
    expect(deserialized).toEqual(expected);
  });
});