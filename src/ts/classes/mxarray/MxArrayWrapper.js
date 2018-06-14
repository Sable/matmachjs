define("mxarray", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var MxArray = /** @class */ (function () {
        function MxArray(wi, mxarray) {
            this.wi = wi;
            this.arr_ptr = this.wi.clone(mxarray.arr_ptr);
        }
        MxArray.prototype.set_index = function (ind, val) {
            if (ind === void 0) { ind = -1; }
            if (val === void 0) { val = null; }
            return this.wi.set_array_index_f64(this.arr_ptr, ind);
        };
        MxArray.prototype.set_indices = function (indices, values) {
            var _this = this;
            var indices_arr_ptr = this.wi.create_mxvector(indices.length, 5); // Create mxvector with int type
            indices.forEach(function (dimArr, indDim) {
                var index_arr_ptr = _this.wi.create_mxvector(dimArr.length);
                dimArr.forEach(function (val, indVal) {
                    _this.wi.set_array_index_f64(index_arr_ptr, indVal + 1, val);
                });
                _this.wi.set_array_index_f64(index_arr_ptr, indDim + 1, index_arr_ptr);
            });
            var indices_val_arr_ptr = this.wi.create_mxvector(values.length); // Create mxvector with int type
            values.forEach(function (val, ind) {
                _this.wi.set_array_index_f64(indices_arr_ptr, ind + 1, indices_val_arr_ptr);
            });
            this.wi.set_f64(this.arr_ptr, indices_arr_ptr, indices_val_arr_ptr);
        };
        MxArray.prototype.get_indices = function (indices, values) {
            var _this = this;
            var indices_arr_ptr = this.wi.create_mxvector(indices.length, 5); // Create mxvector with int type
            indices.forEach(function (dimArr, indDim) {
                var index_arr_ptr = _this.wi.create_mxvector(dimArr.length);
                dimArr.forEach(function (val, indVal) {
                    _this.wi.set_array_index_f64(index_arr_ptr, indVal + 1, val);
                });
                _this.wi.set_array_index_f64(index_arr_ptr, indDim + 1, index_arr_ptr);
            });
            this.wi.get_f64(this.arr_ptr, indices_arr_ptr);
        };
        MxArray.prototype.getContents = function () {
            return new Float64Array(this.wi.mem, this.arr_ptr, this.numel());
        };
        MxArray.prototype.get_index = function (ind) {
            return this.wi.get_array_index_f64(this.arr_ptr, ind);
        };
        MxArray.prototype.numel = function () {
            return this.wi.numel(this.arr_ptr);
        };
        MxArray.prototype.ndims = function () {
            return this.wi.ndims(this.arr_ptr);
        };
        MxArray.prototype.length = function () {
            return this.wi.length(this.arr_ptr);
        };
        MxArray.prototype.isrow = function () {
            return this.wi.isrow(this.arr_ptr) === 1;
        };
        MxArray.prototype.iscolumn = function () {
            return this.wi.isvector(this.arr_ptr) === 1;
        };
        MxArray.prototype.ismatrix = function () {
            return this.wi.ismatrix(this.arr_ptr) === 1;
        };
        MxArray.prototype.isvector = function () {
            return this.wi.isvector(this.arr_ptr) === 1;
        };
        MxArray.prototype.isempty = function () {
            return this.wi.isempty(this.arr_ptr) === 1;
        };
        return MxArray;
    }());
    exports.MxArray = MxArray;
});
