import { MachArray } from "../MachArray";



export interface IMachObject {

    // Accessing elements
    get_index(...args:number[]): number;// Set Index
    set_index(args:number[], value:number): number;// Get Index
    index(...args:number[]):number; // Returns index into the linear array.  
    get(...args:number[][]): IMachObject; // Creates view of array
    set(args:number[][],values:number[]): void; // Creates view of array

    // Query information
    numel(): number;
    size(): Float64Array;
    ndims(): number;
    
    // Boolean Properties
    isrow(): Boolean
    is_scalar(): Boolean;
    iscolumn(): Boolean;
    ismatrix(): Boolean;
    isvector(): Boolean;
    isempty(): Boolean;

    // Methods
    clone(): IMachObject;
}