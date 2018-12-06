export interface MxArray {
    type: TypeAttribute;
    length: number;
    data_ptr: ArrayData | CellArrayData | StructData | StringData | FunctionHandleData;
    dim_number: number;
    dim_ptr: Array<number>;
    stride_ptr: Array<number>;
    attributes:Attributes;
}
interface TypeAttribute {
    class: Class;
    element_bytesize:ByteSize;
    number_class?: NumberClass;// Only if Array class
}
enum Class { Array, CellArray, Struct, FunctionHandle, String, Colon }
enum ByteSize { one=1, two=2,four=4, eight=8}
enum NumberClass {
    double=0, single=1,int16=2,int8=3,int64=4,int32=5,uint16=6,
    uint8=7,uint64=8,uint32=9,char=11,string=13,logical=15
}

interface Attributes {
    sparse: Boolean;
    real: Boolean;
}
// Array Value Type defition
type ArrayValueType = Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Uint32Array|Float32Array|Float64Array;
// Data Arrays
export interface ArrayData {
    pdata:ArrayValueType
}
export interface StringData{
    pdata:Array<string>
}
export interface CellArrayData {
    pdata: Array<MxArray>;// Must be numeric array
}
export interface StructData {
    field_names:Array<string>;
    pdata: Array<MxArray>;
}
export interface FunctionHandleData {
    pdata: Array<Function>;
}

