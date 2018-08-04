"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="mxarray/MxNdArray.ts"/>
var MxArray_1 = require("./mxarray/MxArray");
var MxVector_1 = require("./mxarray/MxVector");
exports.MxVector = MxVector_1.MxVector;
var MxNdArray_1 = require("./mxarray/MxNdArray");
exports.MxNDArray = MxNdArray_1.MxNDArray;
// declare var wi:any;
var MatlabRuntime = /** @class */ (function () {
    function MatlabRuntime(wis) {
        this.started = false;
        this.wi = wis;
        this.started = true;
    }
    MatlabRuntime.prototype.startRuntime = function (wis) {
        this.wi = wis;
        this.started = true;
    };
    MatlabRuntime.prototype.checkForStartedRuntime = function () {
        if (!this.started) {
            throw new Error("Please initialize Matlab Runtime");
        }
    };
    MatlabRuntime.prototype.ones = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length > 0) {
            if (args.length === 1 && (args[0].constructor === MxArray_1.MxArray || args[0].constructor === Array)) {
            }
        }
        else {
            return 1;
        }
    };
    MatlabRuntime.prototype.transpose = function (arr) {
        if (typeof arr === 'number') {
            return arr;
        }
        else {
            return new MxNdArray_1.MxNDArray(this.wi, this.wi.transpose_M(arr.arr_ptr));
        }
    };
    MatlabRuntime.prototype.lit = function (arr) {
        if (typeof arr === 'undefined')
            throw new Error("Must pass a value array to construct literal");
        if (arr.length == 0) {
            // create an empty array
            return new MxNdArray_1.MxNDArray(this.wi, this.wi.create_mxarray_empty(2));
        }
        else if (arr.length > 0 && typeof arr[0] === 'number') {
            var val = [];
            var arr_ = arr;
            var dimArr = new MxVector_1.MxVector(this.wi, arr_);
            // create an mxvector
            return dimArr;
        }
        else {
            var arr_ = arr;
            var rows_1 = arr_.length;
            var cols_1 = arr_[0].length;
            var dimArr = new MxVector_1.MxVector(this.wi, [rows_1, cols_1]);
            var resArr_1 = new MxNdArray_1.MxNDArray(this.wi, dimArr);
            // create ndarray
            arr_.forEach(function (dimArr, idxRow) {
                if (!(dimArr instanceof Array) || dimArr.length !== cols_1) {
                    throw new Error("Dimensions of matrices being concatenated are not consistent.");
                }
                dimArr.forEach(function (elem, idxCol) {
                    resArr_1.set_index((idxRow + rows_1 * idxCol) + 1, elem);
                });
            });
            return resArr_1;
        }
    };
    MatlabRuntime.prototype.isRuntimeStarted = function () {
        return this.started;
    };
    MatlabRuntime.prototype.horzcat = function (args) {
        return this.concat(2, args);
    };
    MatlabRuntime.prototype.vertcat = function (args) {
        return this.concat(1, args);
    };
    MatlabRuntime.prototype.concat = function (dim, args) {
        var _this = this;
        this.checkForStartedRuntime();
        var input_vec = this.wi.create_mxvector(args.length, 5);
        args.forEach(function (arr, idx) {
            _this.wi.set_array_index_i32(input_vec, idx + 1, arr.arr_ptr);
        });
        return new MxNdArray_1.MxNDArray(this.wi, this.wi.concat(dim, input_vec));
    };
    MatlabRuntime.prototype.reshape = function (arr, dims) {
        return arr.reshape(dims);
    };
    MatlabRuntime.prototype.colon = function (start, stepEnd, end) {
        this.checkForStartedRuntime();
        var input_vec;
        if (typeof end == "undefined") {
            var dim_1 = this.wi.create_mxvector(1);
            var dim_2 = this.wi.create_mxvector(1);
            input_vec = this.wi.create_mxvector(2, 5);
            this.wi.set_array_index_f64(dim_1, 1, start);
            this.wi.set_array_index_f64(dim_2, 1, stepEnd);
            this.wi.set_array_index_i32(input_vec, 1, dim_1);
            this.wi.set_array_index_i32(input_vec, 2, dim_2);
        }
        else {
            var dim_1 = this.wi.create_mxvector(1);
            var dim_2 = this.wi.create_mxvector(1);
            var dim_3 = this.wi.create_mxvector(1);
            input_vec = this.wi.create_mxvector(3, 5);
            var param_arr = this.wi.create_mxvector(3, 5);
            this.wi.set_array_index_f64(dim_1, 1, start);
            this.wi.set_array_index_f64(dim_2, 1, stepEnd);
            this.wi.set_array_index_f64(dim_3, 1, end);
            this.wi.set_array_index_i32(input_vec, 1, dim_1);
            this.wi.set_array_index_i32(input_vec, 2, dim_2);
            this.wi.set_array_index_i32(input_vec, 3, dim_3);
        }
        return new MxNdArray_1.MxNDArray(this.wi, this.wi.colon(input_vec));
    };
    MatlabRuntime.prototype.size = function (arr) {
        this.checkForStartedRuntime();
        return arr.size();
    };
    MatlabRuntime.prototype.numel = function (arr) {
        this.checkForStartedRuntime();
        return arr.numel();
    };
    MatlabRuntime.prototype.length = function (arr) {
        this.checkForStartedRuntime();
        return arr.length();
    };
    MatlabRuntime.prototype.isrow = function (arr) {
        this.checkForStartedRuntime();
        return arr.isrow();
    };
    MatlabRuntime.prototype.iscolumn = function (arr) {
        this.checkForStartedRuntime();
        return arr.iscolumn();
    };
    MatlabRuntime.prototype.ismatrix = function (arr) {
        this.checkForStartedRuntime();
        return arr.ismatrix();
    };
    MatlabRuntime.prototype.isvector = function (arr) {
        this.checkForStartedRuntime();
        return arr.isvector();
    };
    MatlabRuntime.prototype.isempty = function (arr) {
        this.checkForStartedRuntime();
        return arr.isempty();
    };
    MatlabRuntime.prototype.clone = function (arr) {
        this.checkForStartedRuntime();
        return arr.clone();
    };
    return MatlabRuntime;
}());
exports.MatlabRuntime = MatlabRuntime;
