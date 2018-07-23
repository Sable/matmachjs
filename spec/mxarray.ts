interface TypeAttribute {
    class: Class;
    element_bytesize:ByteSize;
    number_class: NumberClass;
}
enum Class {
    array,
    cell_array,
    struct,
    function_handle,
    string
}
enum Type {
    MxObject,
    Colon
}
interface Mx {
    type: Type
    mx_ptr?:number
}


interface Attributes {
    sparse: Boolean;
    real: Boolean;
}
enum NumberClass {
    double=0,
    single=1,
    int16=2,
    int8=3,
    int64=4,
    int32=5,
    uint16=6,
    uint8=7,
    uint64=8,
    uint32=9,
    char=11,
    string=13,
    logical=15
}
enum ByteSize {
    byte=1,
    two=2,
    four=4,
    eight=8
}

export interface Mxarray {
    type: TypeAttribute;
    length: number;
    arr1_ptr: Array<number>; // pr if sparse
    arr2_ptr?: Array<number>; // complex part,
        // struct fields, or pi if sparse.
    ir?: Array<number>;
    jc?: Array<number>;
    dim_number: number;
    dim_ptr: number;
    attributes:Attributes;
}


