

export interface MXObject {
    numel():number;
    ndims():number;
    length():number;
    isrow():boolean;
    iscolumn():boolean;
    ismatrix():boolean;
    isvector():boolean;
    isempty():boolean;
}
