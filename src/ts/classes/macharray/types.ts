import { MachArray } from "./Macharray";

// Array Values
export type ArrayValue = FloatArray | IntArray;
export type FloatArray = Float32Array | Float64Array;
export type IntArray = SIntArray | UIntArray;
export type SIntArray = Int16Array | Int8Array | Int32Array;
export type UIntArray = Uint16Array | Uint8Array | Uint32Array;

