import {ArrayValue, MClass} from "./macharray/types";



export class MatmachError extends Error{
    constructor(msg){
        super(`Matmach Error: ${msg}`);
    }
}

export class ValueTypeError extends MatmachError {
    constructor(source: MClass, expected: MClass){
        super(`Invalid value type, expected: ${expected} got: ${source}`);
    } 
}
export class ArrayValueTypeError extends MatmachError {
    constructor(source: ArrayValue, expected: ArrayValue){
        super(`Invalid array type, expected: ${expected} got: ${source}`);
    } 
}