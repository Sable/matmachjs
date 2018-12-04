
// Array Values
export type ArrayValue = FloatArray | IntArray;
export type FloatArray = Float32Array | Float64Array;
export type IntArray = SIntArray | UIntArray;
export type SIntArray = Int16Array | Int8Array | Int32Array;
export type UIntArray = Uint16Array | Uint8Array | Uint32Array;

export enum MatClass {
    Array,
    CellArray,
    Struct,
    FunctionHandle,
    String,
    Colon        
}
export enum MClass {
    float64, 
    float32,
    uint8,
    int8,
    uint16,
    int16,
    uint32,
    int32,
    uint64,
    int64
}
