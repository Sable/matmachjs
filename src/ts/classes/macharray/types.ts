
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
    float64=0,
    float32=1,
    int16=2,
    int8=3,
    int64=4,
    int32=5,
    uint16=6,
    uint8=7,
    uint64=8,
    uint32=9,
    char=11,
    logical=15
}

