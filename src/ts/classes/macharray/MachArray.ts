import { IMachObject } from "./interface/IMachObject";
import { MatClass, MClass } from "./types";

export class MachArray extends Float64Array implements IMachObject {
    private _wi:any;
    // Array properties
    // public _data: Float64Array;
    public _shape: Float64Array;
    readonly _type_attribute: Uint8Array; 
    readonly _attributes: Uint8Array;
    readonly _ndim: number;
    readonly _numel: number;
    readonly _byteOffset: number;
    readonly _strides: Float64Array;

    get _mat_class(){
        return MatClass[this._type_attribute[0]];
    }
    get BYTES_PER_ELEMENT(){
        return this._type_attribute[1];
    }
    get _mclass(){
        return MClass[this._type_attribute[2]];
    }
    get _order() {
        return (this._attributes[0] === 0)?"C":"R";
    }
    
    constructor(wi:any, arr_ptr:number){
        super(wi.mem.buffer,wi.mxarray_core_get_array_ptr(arr_ptr), wi.numel(arr_ptr)); 
        let header = new Uint32Array(wi.mem.buffer, arr_ptr, 7);
        this._type_attribute = new Uint8Array(wi.mem.buffer, arr_ptr,3);
        this._attributes = new Uint8Array(wi.mem.buffer, arr_ptr+24,4);
        // console.log(this._attributes);
        this._wi = wi;
        this._numel = header[1];
        this._ndim = header[3];
        // if(header[2]!= 0 && header[2]!= -1) this._data = new Float64Array(wi.mem.buffer, 
        //     header[2], this._numel);
        // else this._data = new Float64Array(0); 
        this._byteOffset = arr_ptr;
        this._shape = new Float64Array(wi.mem.buffer,
            header[4], this._ndim);
        this._strides =  new Float64Array(wi.mem.buffer,
            header[5], this._ndim); 
    }
    clone(): MachArray {
        let new_arr_ptr = this._wi.clone(this._byteOffset);
        return new MachArray(this._wi, new_arr_ptr);
    }
    get_index(...args:number[]): number {
        return this[this.index(...args)];
    }
    set_index(args:number[], value:number): number {
       return this[this.index(...args)] = value; 
    }
    index(...args:number[]): number {
        if(args.length == 1) return args[0];
        if(args.length == 0) throw new Error("Must provide at least one index");
        return args.reduce((acc, val,i)=>{ return acc+val*this._strides[i]},0);
    }
    slice_get(...args: number[][]): IMachObject {
        // throw new Error("Method not implemented.");
        let vector_input = new Uint32Array(this._wi.mem.buffer,
                this._wi.create_mxvector(args.length, 5), args.length);
        args.forEach((dim_arr,dim_arr_ind )=>{
            let dim_input = new Uint32Array(this._wi.mem.buffer,
                this._wi.create_mxvector(dim_arr.length), dim_arr.length); 
            dim_arr.forEach((dim, dim_ind)=>{
                dim_input[dim_ind] = dim; 
            });
            vector_input[dim_arr_ind] = dim_input.byteOffset;
        });
        
        let ret = new MachArray(this._wi, this._wi.get_f64(vector_input.byteOffset));
        return ret; 
    }
    slice_set(args: number[][], values: number[]): number {
        throw new Error("Method not implemented.");
    }
    numel(): number {
        return this.length;
    }
    size(): Float64Array {
        return new Float64Array(this._shape);
    }
    ndims(): number {
        return this._shape.length;
    }
    dim_length(): number {
        let max = -Infinity;
        return this._shape.reduce((val)=>(val>max)?val:max,0);
    }
    is_scalar(): Boolean {
        return (this.length === 1);
    }
    isrow(): Boolean {
        return this._wi.isrow(this._byteOffset) === 1;
    }

    iscolumn(): Boolean {
        return this._wi.iscolumn(this._byteOffset) === 1; 
    }
    ismatrix(): Boolean {
        return this._wi.ismatrix(this._byteOffset) === 1;
    }
    isvector(): Boolean {
        return this._wi.isvector(this._byteOffset) === 1;
    }
    isempty(): Boolean {
        return this.length === 0;
    }
    reshape(newshape:number[]){
        if(newshape.reduce((acc,dim)=>dim+acc,0) !== this._numel)
            throw new Error("New shape must have the same dimensions");
        newshape.forEach((dim,i)=>{
            this._shape[i] = dim;
        });
    }
    free(){
        this._wi.free_macharray(this._byteOffset);
    }
   
}

