<div align="center">

![RecJSON 🔄🔢](https://github.com/Exponential-Workload/recjson/blob/master/social.png?raw=true)

  [![📝 Documentation](https://img.shields.io/badge/📝-Documentation-blue)](https://gh.expo.moe/recjson)
  [![📦 NPM](https://img.shields.io/npm/v/recjson?label=📦%20NPM)](https://npmjs.com/package/recjson)
  [![🧪 Tests](https://img.shields.io/github/actions/workflow/status/Exponential-Workload/recjson/test.yml?branch=master&label=🧪%20Tests)](https://github.com/Exponential-Workload/recjson/actions/workflows/test.yml)

🔄 JSON-based serialization with the ability to have circular/infinitely-recursive references 🔗

</div>

# 📦 Table of Contents
- [📦 Table of Contents](#-table-of-contents)
- [🚀 Setup](#-setup)
- [🛠️ Usage](#️-usage)
  - [📤 Serialization](#-serialization)
  - [📥 Deserialization/Parsing](#-deserializationparsing)
- [🧙‍♂️🔮 What kind of sorcery is this?](#️-what-kind-of-sorcery-is-this)
- [📜 License](#-license)

# 🚀 Setup

```sh
pnpm i recjson
```

# 🛠️ Usage

## 📤 Serialization

```ts
import { Serializer } from 'recjson';
const serializer = new Serializer();

const recursiveObject = {
  a: 1,
  b: {
    c: {
      d: {
        backToTop: null as unknown as any,
      },
    },
  },
};

recursiveObject.b.c.d.backToTop = recursiveObject;

const serialized = serializer.serialize(recursiveObject);
// { root: 0, obj: [ { a: 1, b: 2 }, 1, { c: 3 }, { d: 4 }, { backToTop: 0 } ] } - As a JS Object

const serializedAsString = serializer.serializeToJSON(recursiveObject);
// '{"root":0,"obj":[{"a":1,"b":2},1,{"c":3},{"d":4},{"backToTop":0}]}'
```

## 📥 Deserialization/Parsing

```ts
import { Deserializer } from 'recjson';
const deserializer = new Deserializer();

const serialized = { root: 0, obj: [ { a: 1, b: 2 }, 1, { c: 3 }, { d: 4 }, { backToTop: 0 } ] }; // As a JS Object

const deserialized = deserializer.parse(serialized); // { a: 1, b: { c: { d: [Circular] } } }

const deserializedAsString = parser.parseFromJSON('{"root":0,"obj":[{"a":1,"b":2},1,{"c":3},{"d":4},{"backToTop":0}]}'); // { a: 1, b: { c: { d: [Circular] } } }
```

# 🧙‍♂️🔮 What kind of sorcery is this?

🔄📝 RecJSON is a JSON-based serialization format that allows for circular/infinitely-recursive references. It does this by using a special syntax for references.

🔢🔄 This syntax involves using an array of all objects, each with integer values, alongside primitives. When an object is referenced, it is replaced with the integer value of its index in the array. If it doesn't exist, it is added to the array.

🔄🔄 This allows for circular/infinitely-recursive references, as the object is only referenced by its index in the array, not by the object itself.

🔄📥 When deserializing, the array is used to replace the integer values with the actual objects.

# 📜 License

This project is licensed under the [📄 MIT License](./LICENSE)
