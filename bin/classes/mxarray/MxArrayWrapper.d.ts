import { MxArray } from "./MxArray";
export declare class MxArrayWrapper extends MxArray {
    arr_ptr: number;
    constructor(wi: any, mxarray_ptr: number, mxarray?: MxArrayWrapper);
    set_index(ind?: number, val?: number): number;
    set_indices(indices: Array<Array<number>>, values: Array<number>): void;
    get_indices(indices: Array<Array<number>>): MxArrayWrapper;
}
