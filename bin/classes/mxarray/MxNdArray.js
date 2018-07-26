"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var MxArray_1 = require("./MxArray");
var MxVector_1 = require("./MxVector");
var MxNDArray = /** @class */ (function (_super) {
    __extends(MxNDArray, _super);
    function MxNDArray(wi, mxarray, class_type, simple_type, complex, column, byte_size) {
        if (class_type === void 0) { class_type = 0; }
        if (simple_type === void 0) { simple_type = 0; }
        if (complex === void 0) { complex = false; }
        if (column === void 0) { column = 0; }
        if (byte_size === void 0) { byte_size = 8; }
        var _this = _super.call(this) || this;
        _this._wi = wi;
        if (typeof wi === "undefined") {
            throw Error("Error: WebAssembly Matlab module must be defined");
        }
        if (typeof mxarray == 'number') {
            _this._arr_ptr = mxarray;
        }
        else if (mxarray instanceof MxNDArray) {
            _this._arr_ptr = _this._wi.clone(mxarray._arr_ptr);
        }
        else if (mxarray instanceof MxVector_1.MxVector) {
            _this._arr_ptr = _this._wi.create_mxarray_ND(mxarray.arr_ptr, class_type, simple_type, complex, byte_size);
        }
        else {
            var vector = new MxVector_1.MxVector(_this._wi, mxarray);
            _this._arr_ptr = _this._wi.create_mxarray_ND(vector.arr_ptr, class_type, simple_type, complex, byte_size);
        }
        return _this;
    }
    MxNDArray.prototype.reshape = function (new_dimensions) {
        var _this = this;
        var dim_ptr = this._wi.create_mxvector(new_dimensions.length);
        new_dimensions.forEach(function (item, idx) {
            _this._wi.set_array_index_f64(dim_ptr, idx + 1, item);
        });
        return new MxNDArray(this._wi, this._wi.reshape(this._arr_ptr, dim_ptr));
    };
    MxNDArray.prototype.set_indices = function (indices, values) {
        var _this = this;
        var indices_arr_ptr = this._wi.create_mxvector(indices.length, 5); // Create mxvector with int type
        indices.forEach(function (dimArr, indDim) {
            var index_arr_ptr = _this._wi.create_mxvector(dimArr.length);
            _this._wi.set_array_index_i32(indices_arr_ptr, indDim + 1, index_arr_ptr);
            dimArr.forEach(function (val, indVal) {
                _this._wi.set_array_index_f64(index_arr_ptr, indVal + 1, val);
            });
        });
        var indices_val_arr_ptr;
        if (values instanceof MxNDArray) {
            indices_val_arr_ptr = values.arr_ptr;
        }
        else {
            indices_val_arr_ptr = this._wi.create_mxvector(values.length);
            values.forEach(function (val, ind) {
                _this._wi.set_array_index_f64(indices_val_arr_ptr, ind + 1, val);
            });
        }
        this._wi.set_f64(this._arr_ptr, indices_arr_ptr, indices_val_arr_ptr);
    };
    MxNDArray.prototype.size = function () {
        return new MxNDArray(this._wi, _super.prototype.size.call(this));
    };
    MxNDArray.prototype.get_indices = function (indices) {
        return new MxNDArray(this._wi, _super.prototype.get_indices.call(this, indices));
    };
    MxNDArray.prototype.get = function (indices) {
        if (typeof indices == 'number') {
            return _super.prototype.get.call(this, indices);
        }
        return new MxNDArray(this._wi, _super.prototype.get.call(this, indices));
    };
    MxNDArray.prototype.clone = function () {
        return new MxNDArray(this._wi, this);
    };
    return MxNDArray;
}(MxArray_1.MxArray));
exports.MxNDArray = MxNDArray;
