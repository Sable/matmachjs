"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const MachUtil_1 = require("./MachUtil");
class MachArray extends Float64Array {
    get _mat_class() {
        return types_1.MatClass[this._type_attribute[0]];
    }
    get BYTES_PER_ELEMENT() {
        return this._type_attribute[1];
    }
    get _mclass() {
        return types_1.MClass[this._type_attribute[2]];
    }
    get _order() {
        return (this._attributes[0] === 0) ? "C" : "R";
    }
    new(wi, arr, offset) {
    }
    constructor(wi, arr_ptr) {
        super(wi.mem.buffer, wi.mxarray_core_get_array_ptr(arr_ptr), wi.numel(arr_ptr));
        this._header = new Uint32Array(wi.mem.buffer, arr_ptr, 7);
        this._type_attribute = new Uint8Array(wi.mem.buffer, arr_ptr, 3);
        this._attributes = new Uint8Array(wi.mem.buffer, arr_ptr + 24, 4);
        this._wi = wi;
        this._numel = this._header[1];
        this._ndim = this._header[3];
        this._headerOffset = arr_ptr;
        this._shape = new Float64Array(wi.mem.buffer, this._header[4], this._ndim);
        this._strides = new Float64Array(wi.mem.buffer, this._header[5], this._ndim);
    }
    clone() {
        let new_arr_ptr = this._wi.clone(this._headerOffset);
        return new MachArray(this._wi, new_arr_ptr);
    }
    get_index(...args) {
        return this[this.index(...args)];
    }
    set_index(args, value) {
        return this[this.index(...args)] = value;
    }
    index(...args) {
        if (args.length == 1)
            return args[0];
        if (args.length == 0)
            throw new Error("Must provide at least one index");
        return args.reduce((acc, val, i) => { return acc + val * this._strides[i]; }, 0);
    }
    slice_get(args) {
        let ptrs_to_free = [];
        let input_vector_ptr = this._wi.create_mxvector(args.length, 5);
        ptrs_to_free.push(input_vector_ptr);
        let vector_input = new Uint32Array(this._wi.mem.buffer, this._wi.mxarray_core_get_array_ptr(input_vector_ptr), args.length);
        args.forEach((dim_arr, dim_arr_ind) => {
            let dim_input_ptr = this._wi.create_mxvector(dim_arr.length);
            let dim_input = new Float64Array(this._wi.mem.buffer, this._wi.mxarray_core_get_array_ptr(dim_input_ptr), dim_arr.length);
            dim_arr.forEach((dim, dim_ind) => {
                dim_input[dim_ind] = dim;
            });
            vector_input[dim_arr_ind] = dim_input.byteOffset;
            ptrs_to_free.push(dim_input_ptr);
        });
        let ret = new MachArray(this._wi, this._wi.get_f64(vector_input.byteOffset));
        MachUtil_1.MachUtil.free_input_memory(this._wi, ptrs_to_free);
        return ret;
    }
    slice_set(args, values) {
        let ptrs_to_free = [];
        let input_vector_ptr = this._wi.create_mxvector(args.length, 5);
        ptrs_to_free.push(input_vector_ptr);
        let vector_input = new Uint32Array(this._wi.mem.buffer, this._wi.mxarray_core_get_array_ptr(input_vector_ptr), args.length);
        args.forEach((dim_arr, dim_arr_ind) => {
            let dim_input_ptr = this._wi.create_mxvector(dim_arr.length);
            let dim_input = new Float64Array(this._wi.mem.buffer, this._wi.mxarray_core_get_array_ptr(dim_input_ptr), dim_arr.length);
            dim_arr.forEach((dim, dim_ind) => {
                dim_input[dim_ind] = dim;
            });
            vector_input[dim_arr_ind] = dim_input.byteOffset;
            ptrs_to_free.push(dim_input_ptr);
        });
        let input_values_ptr = this._wi.create_mxvector(args.length);
        ptrs_to_free.push(input_values_ptr);
        let input_values = new Float64Array(this._wi.mem.buffer, this._wi.mxarray_core_get_array_ptr(input_values_ptr), values.length);
        values.forEach((val, index) => {
            input_values[index] = val;
        });
        this._wi.set_f64(vector_input.byteOffset);
        MachUtil_1.MachUtil.free_input_memory(this._wi, ptrs_to_free);
    }
    numel() {
        return this.length;
    }
    size() {
        return new Float64Array(this._shape);
    }
    ndims() {
        return this._shape.length;
    }
    dim_length() {
        let max = -Infinity;
        return this._shape.reduce((val) => (val > max) ? val : max, 0);
    }
    is_scalar() {
        return (this.length === 1);
    }
    isrow() {
        return this._wi.isrow(this._headerOffset) === 1;
    }
    iscolumn() {
        return this._wi.iscolumn(this._headerOffset) === 1;
    }
    ismatrix() {
        return this._wi.ismatrix(this._headerOffset) === 1;
    }
    isvector() {
        return this._wi.isvector(this._headerOffset) === 1;
    }
    isempty() {
        return this.length === 0;
    }
    reshape(newshape) {
        // TODO(dherre3): Past logic to wasm, invalid as it should also change strides and
        if (newshape.reduce((acc, dim) => dim * acc, 1) !== this._numel)
            throw new Error("New shape must have the same dimensions");
        newshape.forEach((dim, i) => {
            this._shape[i] = dim;
        });
        return this;
    }
    free() {
        this._wi.free_macharray(this._headerOffset);
    }
}
exports.MachArray = MachArray;
