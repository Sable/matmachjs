export interface MX {
    set_index(ind: any, val: any): number;
    get_index(ind: any): number;
    getContents(): Float64Array;
    numel(): number;
    ndims(): number;
    length(): number;
    isrow(): boolean;
    iscolumn(): boolean;
    ismatrix(): boolean;
    isvector(): boolean;
    isempty(): boolean;
}
