import { MXObject } from "../../interfaces/MXObject";
export declare abstract class MxArray implements MXObject {
    protected wi: any;
    protected arr_ptr: number;
    getContents(): Float64Array;
    set_index(ind: number, val: number): number;
    get_index(ind: number): number;
    numel(): number;
    ndims(): number;
    length(): number;
    isrow(): boolean;
    iscolumn(): boolean;
    ismatrix(): boolean;
    isvector(): boolean;
    isempty(): boolean;
}
