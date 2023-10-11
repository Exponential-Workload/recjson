export * as exports from './main';

if (typeof globalThis !== 'undefined')
  // @ts-ignore
  globalThis.exports = exports;
else if (typeof window !== 'undefined')
  // @ts-ignore
  window.exports = exports;
else if (typeof global !== 'undefined')
  // @ts-ignore
  global.exports = exports;

export default exports;
