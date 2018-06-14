"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MxArray_1 = require("./MxArray");
class MxArrayWrapper extends MxArray_1.MxArray {
    constructor(wi, mxarray_ptr, mxarray) {
        super();
        if (mxarray) {
            this.wi.clone(mxarray.arr_ptr);
        }
        else {
            this.arr_ptr = mxarray_ptr;
        }
    }
    set_index(ind = -1, val = NaN) {
        return this.wi.set_array_index_f64(this.arr_ptr, ind);
    }
    set_indices(indices, values) {
        let indices_arr_ptr = this.wi.create_mxvector(indices.length, 5); // Create mxvector with int type
        indices.forEach((dimArr, indDim) => {
            let index_arr_ptr = this.wi.create_mxvector(dimArr.length);
            dimArr.forEach((val, indVal) => {
                this.wi.set_array_index_f64(index_arr_ptr, indVal + 1, val);
            });
            this.wi.set_array_index_f64(index_arr_ptr, indDim + 1, index_arr_ptr);
        });
        let indices_val_arr_ptr = this.wi.create_mxvector(values.length); // Create mxvector with int type
        values.forEach((val, ind) => {
            this.wi.set_array_index_f64(indices_arr_ptr, ind + 1, indices_val_arr_ptr);
        });
        this.wi.set_f64(this.arr_ptr, indices_arr_ptr, indices_val_arr_ptr);
    }
    get_indices(indices) {
        let indices_arr_ptr = this.wi.create_mxvector(indices.length, 5); // Create mxvector with int type
        indices.forEach((dimArr, indDim) => {
            let index_arr_ptr = this.wi.create_mxvector(dimArr.length);
            dimArr.forEach((val, indVal) => {
                this.wi.set_array_index_f64(index_arr_ptr, indVal + 1, val);
            });
            this.wi.set_array_index_f64(index_arr_ptr, indDim + 1, index_arr_ptr);
        });
        return new MxArrayWrapper(this.wi, this.wi.get_f64(this.arr_ptr, indices_arr_ptr));
    }
}
exports.MxArrayWrapper = MxArrayWrapper;
//# sourceMappingURL=MxArrayWrapper.js.map