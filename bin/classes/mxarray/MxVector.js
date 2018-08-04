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
var MxNdArray_1 = require("./MxNdArray");
var MxVector = /** @class */ (function (_super) {
    __extends(MxVector, _super);
    function MxVector(wi, array, simple_type, class_type, complex, column, byte_size) {
        if (simple_type === void 0) { simple_type = 0; }
        if (class_type === void 0) { class_type = 0; }
        if (complex === void 0) { complex = 0; }
        if (column === void 0) { column = false; }
        if (byte_size === void 0) { byte_size = 0; }
        var _this = _super.call(this) || this;
        _this._wi = wi;
        if (typeof array != "undefined") {
            if (typeof array == 'number') {
                _this._arr_ptr = _this._wi.create_mxvector(array, simple_type, class_type, complex, column, byte_size);
            }
            else if (array instanceof MxVector) {
                _this._arr_ptr = _this._wi.clone(array._arr_ptr);
            }
            else {
                // if ( array.length == 1 ) {
                //     this._arr_ptr = this._wi.create_mxvector(array.length, simple_type, class_type, complex, column, byte_size);
                // }
                _this._arr_ptr = _this._wi.create_mxvector(array.length, simple_type, class_type, complex, column, byte_size);
                array.forEach(function (val, idx) {
                    _this._wi.set_array_index_f64(_this._arr_ptr, idx + 1, val);
                });
            }
        }
        return _this;
    }
    MxVector.prototype.get_indices = function (indices) {
        return new MxVector(this._wi, _super.prototype.get_indices.call(this, indices));
    };
    MxVector.prototype.get = function (indices) {
        return new MxVector(this._wi, _super.prototype.get.call(this, indices));
    };
    MxVector.prototype.clone = function () {
        return new MxVector(this._wi, this);
    };
    MxVector.prototype.reshape = function (new_dimensions) {
        var _this = this;
        var dim_ptr = this._wi.create_mxvector(new_dimensions.length);
        new_dimensions.forEach(function (item, idx) {
            _this._wi.set_array_index_f64(dim_ptr, idx + 1, item);
        });
        return new MxNdArray_1.MxNDArray(this._wi, this._wi.reshape(this._arr_ptr, dim_ptr));
    };
    MxVector.prototype.size = function () {
        return new MxNdArray_1.MxNDArray(this._wi, _super.prototype.size.call(this));
    };
    return MxVector;
}(MxArray_1.MxArray));
exports.MxVector = MxVector;
