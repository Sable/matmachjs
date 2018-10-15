"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MxVector_1 = require("./mxarray/MxVector");
exports.MxVector = MxVector_1.MxVector;
const MxNdArray_1 = require("./mxarray/MxNdArray");
exports.MxNDArray = MxNdArray_1.MxNDArray;
class MatlabRuntime {
    constructor(wis) {
        this.started = false;
        this.wi = wis;
        this.started = true;
    }
    startRuntime(wis) {
        this.wi = wis;
        this.started = true;
    }
    checkForStartedRuntime() {
        if (!this.started) {
            throw new Error("Please initialize Matlab Runtime");
        }
    }
    transpose(arr) {
        if (typeof arr === 'number') {
            return arr;
        }
        else {
            return new MxNdArray_1.MxNDArray(this.wi, this.wi.transpose_M(arr.arr_ptr));
        }
    }
    lit(arr) {
        if (typeof arr === 'undefined' || arr === null)
            this.wi.create_mxarray_empty(0, 0, 0, 0);
        if (arr.length == 0) {
            // create an empty array
            return new MxNdArray_1.MxNDArray(this.wi, this.wi.create_mxarray_empty(2, 0, 0, 0));
        }
        else if (arr.length > 0 && typeof arr[0] === 'number') {
            let arr_ = arr;
            let vals = this.wi.create_mxvector(arr.length);
            arr_.forEach((val, idx) => {
                this.wi.set_array_index_f64(vals, idx + 1, val);
            });
            return new MxNdArray_1.MxNDArray(this.wi, vals);
        }
        else {
            let arr_ = arr;
            let rows = arr_.length;
            let cols = arr_[0].length;
            let dimArr = new MxVector_1.MxVector(this.wi, [rows, cols]);
            let resArr = new MxNdArray_1.MxNDArray(this.wi, dimArr);
            // create ndarray
            arr_.forEach((dimArr, idxRow) => {
                if (!(dimArr instanceof Array) || dimArr.length !== cols) {
                    throw new Error("Dimensions of matrices being concatenated are not consistent.");
                }
                dimArr.forEach((elem, idxCol) => {
                    resArr.set_index((idxRow + rows * idxCol) + 1, elem);
                });
            });
            return resArr;
        }
    }
    ones(...arg) {
        if (arg.length == 0)
            return 1;
        else {
            if (typeof arg[0] == 'number') {
                let input = arg;
                let vec = new MxVector_1.MxVector(this.wi, input);
                return new MxNdArray_1.MxNDArray(this.wi, this.wi.ones(vec.arr_ptr));
            }
            else {
                let input = arg;
                if (input.length > 1) {
                    throw new Error("Only arrays of array of one dimension accepted in this context");
                }
                let vec = new MxVector_1.MxVector(this.wi, input[0]);
                return new MxNdArray_1.MxNDArray(this.wi, this.wi.ones(vec.arr_ptr));
            }
        }
    }
    randn(...arg) {
        if (arg.length == 0)
            return 1;
        else {
            if (typeof arg[0] == 'number') {
                let input = arg;
                let vec = new MxVector_1.MxVector(this.wi, input);
                return new MxNdArray_1.MxNDArray(this.wi, this.wi.randn(vec.arr_ptr));
            }
            else {
                let input = arg;
                if (input.length > 1) {
                    throw new Error("Only arrays of array of one dimension accepted in this context");
                }
                let vec = new MxVector_1.MxVector(this.wi, input[0]);
                return new MxNdArray_1.MxNDArray(this.wi, this.wi.randn(vec.arr_ptr));
            }
        }
    }
    isRuntimeStarted() {
        return this.started;
    }
    horzcat(args) {
        return this.concat(2, args);
    }
    vertcat(args) {
        return this.concat(1, args);
    }
    concat(dim, args) {
        this.checkForStartedRuntime();
        let input_vec = this.wi.create_mxvector(args.length, 5, 0, 0, 0, 0);
        args.forEach((arr, idx) => {
            this.wi.set_array_index_i32(input_vec, idx + 1, arr.arr_ptr);
        });
        return new MxNdArray_1.MxNDArray(this.wi, this.wi.concat(dim, input_vec));
    }
    reshape(arr, dims) {
        return arr.reshape(dims);
    }
    colon(start, stepEnd, end) {
        this.checkForStartedRuntime();
        let input_vec;
        if (typeof end == "undefined") {
            let dim_1 = this.wi.create_mxvector(1, 0, 0, 0, 0, 0);
            let dim_2 = this.wi.create_mxvector(1, 0, 0, 0, 0, 0);
            input_vec = this.wi.create_mxvector(2, 5, 0, 0, 0, 0);
            this.wi.set_array_index_f64(dim_1, 1, start);
            this.wi.set_array_index_f64(dim_2, 1, stepEnd);
            this.wi.set_array_index_i32(input_vec, 1, dim_1);
            this.wi.set_array_index_i32(input_vec, 2, dim_2);
        }
        else {
            let dim_1 = this.wi.create_mxvector(1, 0, 0, 0, 0, 0);
            let dim_2 = this.wi.create_mxvector(1, 0, 0, 0, 0, 0);
            let dim_3 = this.wi.create_mxvector(1, 0, 0, 0, 0, 0);
            input_vec = this.wi.create_mxvector(3, 5, 0, 0, 0, 0);
            let param_arr = this.wi.create_mxvector(3, 5, 0, 0, 0, 0);
            this.wi.set_array_index_f64(dim_1, 1, start);
            this.wi.set_array_index_f64(dim_2, 1, stepEnd);
            this.wi.set_array_index_f64(dim_3, 1, end);
            this.wi.set_array_index_i32(input_vec, 1, dim_1);
            this.wi.set_array_index_i32(input_vec, 2, dim_2);
            this.wi.set_array_index_i32(input_vec, 3, dim_3);
        }
        return new MxNdArray_1.MxNDArray(this.wi, this.wi.colon(input_vec));
    }
    size(arr) {
        this.checkForStartedRuntime();
        return arr.size();
    }
    numel(arr) {
        this.checkForStartedRuntime();
        return arr.numel();
    }
    length(arr) {
        this.checkForStartedRuntime();
        return arr.length_M();
    }
    isrow(arr) {
        this.checkForStartedRuntime();
        return arr.isrow();
    }
    iscolumn(arr) {
        this.checkForStartedRuntime();
        return arr.iscolumn();
    }
    ismatrix(arr) {
        this.checkForStartedRuntime();
        return arr.ismatrix();
    }
    isvector(arr) {
        this.checkForStartedRuntime();
        return arr.isvector();
    }
    isempty(arr) {
        this.checkForStartedRuntime();
        return arr.isempty();
    }
    clone(arr) {
        this.checkForStartedRuntime();
        return arr.clone();
    }
}
exports.MatlabRuntime = MatlabRuntime;
