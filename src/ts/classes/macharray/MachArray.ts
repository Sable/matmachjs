import { IMachObject } from "./interface/IMachObject";
export class MachArray implements IMachObject {
    private _wi:any;
    // Array properties
    _data: Float64Array;
    readonly _shape: Float64Array;
    readonly _ndim: number;
    readonly _numel: number;
    readonly _offset: number;
    readonly _strides: Float64Array;
    readonly _order:string;

    constructor(wi:any, arr_ptr:number){
        let header = new Uint32Array(wi.mem.buffer, arr_ptr, 7);
        let attr = new Uint8Array(wi.mem.buffer, header[6],4);
        this._wi = wi;
        this._numel = header[1];
        this._ndim = header[3];
        if(header[2]!= 0 && header[2]!= -1) this._data = new Float64Array(wi.mem.buffer, 
            header[2],
             this._numel);
        else this._data = new Float64Array(0); 
        
        this._offset = arr_ptr;
        let shape_ptr = header[4]; 
        this._shape = new Float64Array(wi.mem.buffer,
            shape_ptr, this._ndim);
        this._strides =  new Float64Array(wi.mem.buffer,
            header[5], this._ndim); 
        this._order = (attr[0])?"R":"C";
    }
    clone(): MachArray {
        let new_arr_ptr = this._wi.clone(this._data.byteOffset);
        return new MachArray(this._wi, new_arr_ptr);
    }
    get(...args:number[]): number {
        return this._data[this.index(...args)];
    }
    set(args:number[], value:number): number {
       return this._data[this.index(...args)] = value; 
    }
    index(...args:number[]): number {
        if(args.length == 1) return args[0];
        if(args.length == 0) throw new Error("Must provide at least one index");
        return args.reduce((acc, val,i)=>{ return acc+val*this._strides[i]},0);
    }
    slice_get(...args: number[][]): MachArray {
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
        return this._data.length;
    }
    size(): Float64Array {
        return new Float64Array(this._shape);
    }
    ndims(): number {
        return this._shape.length;
    }
    length(): number {
        let max = -Infinity;
        return this._shape.reduce((val)=>(val>max)?val:max,0);
    }
    is_scalar(): Boolean {
        return (this._data.length === 1);
    }
    isrow(): Boolean {
        return this._wi.isrow(this._offset) === 1;
    }

    iscolumn(): Boolean {
        return this._wi.iscolumn(this._offset) === 1; 
    }
    ismatrix(): Boolean {
        return this._wi.ismatrix(this._offset) === 1;
    }
    isvector(): Boolean {
        return this._wi.isvector(this._offset) === 1;
    }
    isempty(): Boolean {
        return this._data.length === 0;
    }
    reshape(newshape:number[]){
        if(newshape.reduce((acc,dim)=>dim+acc,0) !== this._numel)
            throw new Error("New shape must have the same dimensions");
        newshape.forEach((dim,i)=>{
            this._shape[i] = dim;
        });
    }
    free(){
        this._wi.free_macharray(this._offset);
    }

}