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
var MxObject_1 = require("./MxObject");
var MxArray = /** @class */ (function (_super) {
    __extends(MxArray, _super);
    function MxArray() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MxArray.prototype.set_index = function (ind, val) {
        if (ind === void 0) { ind = -1; }
        if (val === void 0) { val = NaN; }
        return this._wi.set_array_index_f64(this._arr_ptr, ind, val);
    };
    MxArray.prototype.get_index = function (ind) {
        if (ind === void 0) { ind = -1; }
        return this._wi.get_array_index_f64(this._arr_ptr, ind);
    };
    MxArray.prototype.get_indices = function (indices) {
        var _this = this;
        var indices_arr_ptr = this._wi.create_mxvector(indices.length, 5); // Create mxvector with int type
        indices.forEach(function (dimArr, indDim) {
            var index_arr_ptr = _this._wi.create_mxvector(dimArr.length);
            dimArr.forEach(function (val, indVal) {
                _this._wi.set_array_index_f64(index_arr_ptr, indVal + 1, val);
            });
            _this._wi.set_array_index_i32(indices_arr_ptr, indDim + 1, index_arr_ptr);
        });
        return this._wi.get_f64(this._arr_ptr, indices_arr_ptr);
    };
    MxArray.prototype.get = function (indices) {
        if (typeof indices === 'number') {
            return this._wi.get_array_index_f64(this._arr_ptr, indices);
        }
        else if (indices.length === 1 && indices[0].length == 1) {
            return this._wi.get_array_index_f64(this._arr_ptr, indices[0][0]);
        }
        else {
            return this.get_indices(indices);
        }
    };
    MxArray.prototype.set = function (indices, values) {
        if (indices.length == 0 && values.length == 0) {
            return this._wi.clone(this._arr_ptr);
        }
        else if (indices.length === 1 && indices[0].length == 1 && values.length == 1) {
            this._wi.set_array_index_f64(this._arr_ptr, indices[0][0], values[0]);
        }
        else {
            this.set_indices(indices, values);
        }
    };
    MxArray.prototype.set_indices = function (indices, values) {
        var _this = this;
        var indices_arr_ptr = this._wi.create_mxvector(indices.length, 5); // Create mxvector with int type
        indices.forEach(function (dimArr, indDim) {
            var index_arr_ptr = _this._wi.create_mxvector(dimArr.length);
            _this._wi.set_array_index_i32(indices_arr_ptr, indDim + 1, index_arr_ptr);
            dimArr.forEach(function (val, indVal) {
                _this._wi.set_array_index_f64(index_arr_ptr, indVal + 1, val);
            });
        });
        var indices_val_arr_ptr = this._wi.create_mxvector(values.length);
        values.forEach(function (val, ind) {
            _this._wi.set_array_index_f64(indices_val_arr_ptr, ind + 1, val);
        });
        this._wi.set_f64(this._arr_ptr, indices_arr_ptr, indices_val_arr_ptr);
    };
    return MxArray;
}(MxObject_1.MxObject));
exports.MxArray = MxArray;
