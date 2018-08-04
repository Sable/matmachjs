"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MxObject = /** @class */ (function () {
    function MxObject() {
    }
    Object.defineProperty(MxObject.prototype, "arr_ptr", {
        get: function () {
            return this._arr_ptr;
        },
        enumerable: true,
        configurable: true
    });
    MxObject.prototype.getContents = function (start, length) {
        if (start === void 0) { start = 0; }
        if (length === void 0) { length = this.numel(); }
        if (length < 0 || start < 0)
            throw new Error("View indices must be positive");
        if (length > this.numel() - start)
            throw new Error("Invalid length, index out-of-bounds");
        if (this.numel() > 0)
            return new Float64Array(this._wi.mem.buffer, this._wi.mxarray_core_get_array_ptr(this.arr_ptr) + start, length);
        else {
            return new Float64Array(0);
        }
    };
    MxObject.prototype.size = function () {
        return this._wi.size(this.arr_ptr);
    };
    MxObject.prototype.numel = function () {
        return this._wi.numel(this.arr_ptr);
    };
    MxObject.prototype.ndims = function () {
        return this._wi.ndims(this.arr_ptr);
    };
    MxObject.prototype.length = function () {
        return this._wi.length_M(this.arr_ptr);
    };
    MxObject.prototype.isrow = function () {
        return this._wi.isrow(this.arr_ptr) === 1;
    };
    MxObject.prototype.iscolumn = function () {
        return this._wi.isvector(this.arr_ptr) === 1;
    };
    MxObject.prototype.ismatrix = function () {
        return this._wi.ismatrix(this.arr_ptr) === 1;
    };
    MxObject.prototype.isvector = function () {
        return this._wi.isvector(this.arr_ptr) === 1;
    };
    MxObject.prototype.isempty = function () {
        return this._wi.isempty(this.arr_ptr) === 1;
    };
    return MxObject;
}());
exports.MxObject = MxObject;
