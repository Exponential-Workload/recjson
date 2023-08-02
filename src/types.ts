export type Primitive = string | number | boolean | null
export type PrimitiveWithObjects = Primitive[] | Primitive | {
  [key: string]: Primitive | Primitive[] | PrimitiveWithObjects;
  [key: number]: Primitive | Primitive[] | PrimitiveWithObjects;
} | ({
  [key: number]: Primitive | Primitive[] | PrimitiveWithObjects;
} & any[])
export type SerializedObject = {
  root: number;
  obj: (Record<string, number> | Primitive[] | Primitive)[];
}
