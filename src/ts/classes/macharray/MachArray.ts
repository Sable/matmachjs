import { IMachObject } from "./interface/IMachObject";
import { MatClass, MClass } from "./types";
import {MachUtil} from "./MachUtil";
import {_wi} from "./MachRuntime";

export class MachArray extends Float64Array implements IMachObject {
    // Array properties
    // public _data: Float64Array;
    public _shape: Float64Array;
    public _type_attribute: Uint8Array;
    public _attributes: Uint8Array;
    public _ndim: number;
    public _numel: number;
    public _headerOffset: number;
    public _strides: Float64Array;
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

    constructor( arr_ptr:number){
        super(_wi.mem.buffer,_wi.mxarray_core_get_array_ptr(arr_ptr),_wi.numel(arr_ptr));
        let header = new Uint32Array(_wi.mem.buffer, arr_ptr, 7);
        this._type_attribute = new Uint8Array(_wi.mem.buffer, arr_ptr,3);
        this._attributes = new Uint8Array(_wi.mem.buffer, arr_ptr+24,4);
        this._numel = header[1];
        this._ndim = header[3];
        this._headerOffset = arr_ptr;
        this._shape = new Float64Array(_wi.mem.buffer,
            header[4], this._ndim);
        this._strides =  new Float64Array(_wi.mem.buffer,
            header[5], this._ndim);
    }
    clone(): MachArray {
        let new_arr_ptr = _wi.clone(this._headerOffset);
        return new MachArray(new_arr_ptr);
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
    slice_get(args: number[][]): IMachObject {
        let ptrs_to_free:number[] = [];
        let input_vector_ptr = _wi.create_mxvector(args.length, 5);
        ptrs_to_free.push(input_vector_ptr);
        let vector_input = new Uint32Array(_wi.mem.buffer,
                _wi.mxarray_core_get_array_ptr(input_vector_ptr),args.length);
        args.forEach((dim_arr,dim_arr_ind )=>{
            let dim_input_ptr = _wi.create_mxvector(dim_arr.length);

            let dim_input = new Float64Array(_wi.mem.buffer,_wi.mxarray_core_get_array_ptr(dim_input_ptr)
                , dim_arr.length);
            dim_arr.forEach((dim, dim_ind)=>{
                dim_input[dim_ind] = dim; 
            });
            vector_input[dim_arr_ind] = dim_input.byteOffset;
            ptrs_to_free.push(dim_input_ptr);
        });
        let ret = new MachArray( _wi.get_f64(vector_input.byteOffset));
        MachUtil.free_input_memory(_wi, ptrs_to_free);
        return ret; 
    }
    slice_set(args: number[][], values: number[]): void {
        let ptrs_to_free:number[] = [];
        let input_vector_ptr = _wi.create_mxvector(args.length, 5);
        ptrs_to_free.push(input_vector_ptr);
        let vector_input = new Uint32Array(_wi.mem.buffer,
            _wi.mxarray_core_get_array_ptr(input_vector_ptr),args.length);
        args.forEach((dim_arr,dim_arr_ind )=>{
            let dim_input_ptr = _wi.create_mxvector(dim_arr.length);

            let dim_input = new Float64Array(_wi.mem.buffer,_wi.mxarray_core_get_array_ptr(dim_input_ptr)
                , dim_arr.length);
            dim_arr.forEach((dim, dim_ind)=>{
                dim_input[dim_ind] = dim;
            });
            vector_input[dim_arr_ind] = dim_input.byteOffset;
            ptrs_to_free.push(dim_input_ptr);
        });
        let input_values_ptr= _wi.create_mxvector(args.length);
        ptrs_to_free.push(input_values_ptr);
        let input_values = new Float64Array(_wi.mem.buffer,
            _wi.mxarray_core_get_array_ptr(input_values_ptr),values.length);
        values.forEach((val,index)=>{
            input_values[index] = val;
        });
        _wi.set_f64(vector_input.byteOffset, );
        MachUtil.free_input_memory(_wi, ptrs_to_free);
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
        return _wi.isrow(this._headerOffset) === 1;
    }

    iscolumn(): Boolean {
        return _wi.iscolumn(this._headerOffset) === 1;
    }
    ismatrix(): Boolean {
        return _wi.ismatrix(this._headerOffset) === 1;
    }
    isvector(): Boolean {
        return _wi.isvector(this._headerOffset) === 1;
    }
    isempty(): Boolean {
        return this.length === 0;
    }
    reshape(newshape:number[]){
        // TODO(dherre3): Past logic to wasm, invalid as it should also change strides and
        if(newshape.reduce((acc,dim)=>dim*acc,1) !== this._numel)
            throw new Error("New shape must have the same dimensions");
        newshape.forEach((dim,i)=>{
            this._shape[i] = dim;
        });
        return this;
    }
    free(){
        _wi.free_macharray(this._headerOffset);
    }
   
}

