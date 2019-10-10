import { IMachObject } from "./interface/IMachObject";
import { MatClass, MClass, ArrayValue } from "./types";
import {MachUtil} from "./MachUtil";
import {_wi} from "./MachRuntime";

export class MachArray implements IMachObject {
  
    // Array properties
    // public _data: Float64Array;
    public _data: ArrayValue;
    public _shape: Float64Array;
    public _strides: Float64Array;
    public _type_attribute: Uint8Array;
    public _attributes: Uint8Array;
    public _ndims: number;
    public _numel: number;
    public _headerOffset: number;
    private header: Int32Array;
    public _mat_class: string;
    public _mclass: string;
    public BYTES_PER_ELEMENT: number;
    private _gc_info: Uint8Array;

    get _order() {
        return (this._attributes[0] === 0)?"C":"R";
    }
    private instantiateDataView(): ArrayValue {
        let header = this.header;
        let mclass:  MatClass = this._type_attribute[0];
        let number_class: MClass = this._type_attribute[2];
        switch(mclass){
            case MatClass.CellArray:
            case MatClass.FunctionHandle:
            case MatClass.String:
                return new Int32Array(_wi.mem.buffer, header[2], header[1]);
            default:// Array Class
                switch(number_class){
                    case MClass.float64:

                        return (header[1] == 0)? new Float64Array(0)
                            :new Float64Array(_wi.mem.buffer,header[2],header[1]);
                    case MClass.float32:
                        return  (header[1] == 0)? new Float32Array(0)
                            :new Float32Array(_wi.mem.buffer,header[2],header[1]);
                    case MClass.int16:
                        return (header[1] == 0)? new Int16Array(0)
                            :new Int16Array(_wi.mem.buffer,header[2],header[1]);
                    case MClass.int8:
                        return  (header[1] == 0)? new Int8Array(0)
                        :new Int8Array(_wi.mem.buffer,header[2],header[1]);
                    case MClass.int64:
                        throw new Error("Int64 MachArray class not supported by the interface ");
                    case MClass.int32:
                        return  (header[1] == 0)? new Int32Array(0)
                        :new Int32Array(_wi.mem.buffer,header[2],header[1]);
                    case MClass.uint16:
                        return  (header[1] == 0)? new Uint16Array(0)
                            :new Uint16Array(_wi.mem.buffer,header[2],header[1]);
                    case MClass.uint8:
                        return  (header[1] == 0)? new Uint8Array(0)
                            :new Uint8Array(_wi.mem.buffer,header[2],header[1]);
                    case MClass.uint64:
                        throw new Error("UInt64 MachArray class not supported by the interface ");
                    case MClass.uint32:
                        return  (header[1] == 0)? new Uint32Array(0)
                            :new Uint32Array(_wi.mem.buffer,header[2],header[1]);
                    case MClass.char:
                        return  (header[1] == 0)? new Uint8Array(0)
                            :new Uint8Array(_wi.mem.buffer,header[2],header[1]);
                    default:
                        return  (header[1] == 0)? new Uint8Array(0)
                            :new Uint8Array(_wi.mem.buffer,header[2],header[1]);
                }
        }
        

        
    }
    constructor( arr_ptr:number){
        this.header = new Int32Array(_wi.mem.buffer, arr_ptr, 7);
        this._type_attribute = new Uint8Array(_wi.mem.buffer, arr_ptr,4);       
        this._data = this.instantiateDataView();
        this._attributes = new Uint8Array(_wi.mem.buffer, arr_ptr+24,4);
        this._numel = this.header[1];
        this._ndims = this.header[3];
        this._headerOffset = arr_ptr;
        this._shape = new Float64Array(_wi.mem.buffer,
            this.header[4], this._ndims);
        this._strides =  new Float64Array(_wi.mem.buffer,
            this.header[5], this._ndims);
        this.BYTES_PER_ELEMENT = this._data.BYTES_PER_ELEMENT;
        this._mclass = MClass[this._type_attribute[2]];
        this._mat_class =  MatClass[this._type_attribute[0]];
        this._gc_info =  new Uint8Array(_wi.mem.buffer, arr_ptr+24, 2);
    }
    getGCInfo():Uint8Array{
        return this._gc_info;
    }
    clone(): MachArray {
        let new_arr_ptr = _wi.clone(this._headerOffset);
        return new MachArray(new_arr_ptr);
    }
    get_index(...args:number[]): number {
        let index = this.index(...args);
        if(index >= this._numel) throw new Error("Index exceeds matrix dimensions.");
        return this._data[index];
    }
    set_index(args:number[], value:number): number {
       return this._data[this.index(...args)] = value; 
    }

    /**
     * Returns the a mapping from a multi-dimensional index to a single index
     * @param {number} args
     * @returns {number}
     */
    index(...args:number[]): number {
        if(args.length == 0) throw new Error("Must provide at least one index.");
        if(args.length == 1) return args[0];
        return args.reduce((acc, val,i)=>{ return acc+val*this._strides[i]},0);
    }
    /**
     *
     * @param { number[] | MachArray | number} args
     * @returns { MachArray }
     */
    get(...args: (number[]|MachArray|number)[]): MachArray {
        if(args.length == 0) return new MachArray(_wi.create_mxvector(0));
        let ptrs_to_free:number[] = [];
        let input_vector_ptr = _wi.create_mxvector(args.length, 5);
        ptrs_to_free.push(input_vector_ptr);
        let vector_input = new Uint32Array(_wi.mem.buffer,
                _wi.mxarray_core_get_array_ptr(input_vector_ptr),args.length);
        args.forEach((dim_arr,dim_arr_ind )=>{
            if(typeof dim_arr == 'number' ){
                vector_input[dim_arr_ind] = _wi.convert_scalar_to_mxarray(dim_arr); 
            }else if(Array.isArray(dim_arr)){
                let dim_input_ptr = _wi.create_mxvector(dim_arr.length);

                let dim_input = new Float64Array(_wi.mem.buffer,_wi.mxarray_core_get_array_ptr(dim_input_ptr)
                    , dim_arr.length);
                dim_arr.forEach((dim, dim_ind)=>{
                    dim_input[dim_ind] = dim; 
                });
                vector_input[dim_arr_ind] = dim_input.byteOffset;
                ptrs_to_free.push(dim_input_ptr);
            }else{
                vector_input[dim_arr_ind] = dim_arr._headerOffset;
            }
        });
        let ret = new MachArray( _wi.get_f64(this._headerOffset, input_vector_ptr));
        MachUtil.free_input_memory(_wi, ptrs_to_free);
        return ret; 
    }
    set(args: (number[]|MachArray|number)[], values: number[]|MachArray|number): void {
        if(args.length == 0 ) return;
        let ptrs_to_free:number[] = [];
        let input_vector_ptr = _wi.create_mxvector(args.length, 5);
        ptrs_to_free.push(input_vector_ptr);
        let vector_input = new Uint32Array(_wi.mem.buffer,
            _wi.mxarray_core_get_array_ptr(input_vector_ptr),args.length);
        args.forEach((dim_arr,dim_arr_ind )=>{
            if(typeof dim_arr == 'number' ){
                vector_input[dim_arr_ind] = _wi.convert_scalar_to_mxarray(dim_arr); 
            }else if(Array.isArray(dim_arr)){
                let dim_input_ptr = _wi.create_mxvector(dim_arr.length);

                let dim_input = new Float64Array(_wi.mem.buffer,_wi.mxarray_core_get_array_ptr(dim_input_ptr)
                    , dim_arr.length);
                dim_arr.forEach((dim, dim_ind)=>{
                    dim_input[dim_ind] = dim; 
                });
                vector_input[dim_arr_ind] = dim_input.byteOffset;
                ptrs_to_free.push(dim_input_ptr);
            }else{
                vector_input[dim_arr_ind] = dim_arr._headerOffset;
            }
        });
        let input_values_ptr;
        if(typeof values == 'number' ){
            input_values_ptr = _wi.convert_scalar_to_mxarray(values); 
        }else if(Array.isArray(values)){
            let input_values_ptr= _wi.create_mxvector(values.length);
            ptrs_to_free.push(input_values_ptr);

            let input_values = new Float64Array(_wi.mem.buffer,
                _wi.mxarray_core_get_array_ptr(input_values_ptr),values.length);
            values.forEach((val,index)=>{
                input_values[index] = val;
            });
        }else{
            input_values_ptr = values._headerOffset;
        }
        _wi.set_f64(this._headerOffset, input_vector_ptr, input_values_ptr);
        MachUtil.free_input_memory(_wi, ptrs_to_free);
    }

    numel(): number {
        return this._numel;
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
    is_scalar(): boolean {
        return (this._numel === 1);
    }
    isrow(): boolean {
        return _wi.isrow(this._headerOffset) === 1;
    }

    iscolumn(): boolean {
        return _wi.iscolumn(this._headerOffset) === 1;
    }
    ismatrix(): boolean {
        return _wi.ismatrix(this._headerOffset) === 1;
    }
    isvector(): boolean {
        return _wi.isvector(this._headerOffset) === 1;
    }
    isempty(): boolean {
        return this._numel=== 0;
    }
    reshape(newshape:number[]){
        let that = this;
        if(newshape.reduce((acc,dim)=>dim*acc,1) !== this._numel)
            throw new Error("New shape must have the same number of elements");
        if(that._order == "C"){
            that._strides[0] = 1;
            for (let  strideIndex = 1; strideIndex < that._ndims; strideIndex++) {
                that._strides[strideIndex] = that._strides[strideIndex-1]*that._shape[strideIndex];
            }
        }else{
            that._strides[that._ndims-1] = 1;
            for (let  strideIndex = that._ndims-2; strideIndex >=0; strideIndex--) {
                that._strides[strideIndex] = that._strides[strideIndex+1]*that._shape[strideIndex];
            }
        }
        newshape.forEach((dim,i)=>{
            that._shape[i] = dim;
        });
        return that;
    }
    /**
     * 
     * @param args 
     */
    stride():Float64Array{
        return new Float64Array(this._strides);
    }
    reorder(order:string): MachArray {
        let that = new MachArray(_wi.copy_mxarray_header(this._headerOffset));
        if(order === that._order) return that;
        
        if(order ==="C"){
            that._strides[0] = 1;
            for (let  strideIndex = 1; strideIndex < that._ndims; strideIndex++) {
                that._strides[strideIndex] = that._strides[strideIndex-1]*that._shape[strideIndex];
            } 
        }else if(order === "R"){
            that._strides[that._ndims-1] = 1;
            for (let  strideIndex = that._ndims-2; strideIndex >=0; strideIndex--) {
                that._strides[strideIndex] = that._strides[strideIndex+1]*that._shape[strideIndex];
            } 
        }else{
            throw new Error(`Invalid new matrix order: ${order}, order must be either 'R' or 'C'`);
        }
        return that;
    }
    fill(value:number) {
        this._data.fill(value);
    }
    free(){
        _wi.free_macharray(this._headerOffset);
    }


}

