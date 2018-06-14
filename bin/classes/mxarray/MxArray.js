"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MxArray {
    getContents() {
        return new Float64Array(this.wi.mem, this.arr_ptr, this.numel());
    }
    set_index(ind, val) {
        return this.wi.set_array_index_f64(this.arr_ptr, ind, val);
    }
    get_index(ind) {
        return this.wi.get_array_index_f64(this.arr_ptr, ind);
    }
    numel() {
        return this.wi.numel(this.arr_ptr);
    }
    ndims() {
        return this.wi.ndims(this.arr_ptr);
    }
    length() {
        return this.wi.length(this.arr_ptr);
    }
    isrow() {
        return this.wi.isrow(this.arr_ptr) === 1;
    }
    iscolumn() {
        return this.wi.isvector(this.arr_ptr) === 1;
    }
    ismatrix() {
        return this.wi.ismatrix(this.arr_ptr) === 1;
    }
    isvector() {
        return this.wi.isvector(this.arr_ptr) === 1;
    }
    isempty() {
        return this.wi.isempty(this.arr_ptr) === 1;
    }
}
exports.MxArray = MxArray;
//# sourceMappingURL=MxArray.js.map