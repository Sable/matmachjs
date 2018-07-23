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
    MxObject.prototype.getContents = function () {
        if (this.numel() > 0)
            return new Float64Array(this._wi.mem.buffer, this._wi.get_array_start(this.arr_ptr), this.numel());
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
        return this._wi.length(this.arr_ptr);
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
