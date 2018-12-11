"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const MachArray_1 = require("./MachArray");
const error_1 = require("../error");
const MachUtil_1 = require("./MachUtil");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class MachRuntime {
    constructor(wi) {
        this._wi = wi;
        this._buffer = wi.mem.buffer;
    }
    /**
     * initializeRuntime()
     * Initializes the MachRuntime
     */
    static async initializeRuntimeWithPaths(path_wat, path_js_lib) {
        let wi = await WebAssembly.instantiate(fs.readFileSync(path_wat), await Promise.resolve().then(() => __importStar(require(path_js_lib))));
        return new MachRuntime(wi.instance.exports);
    }
    static async initializeRuntime() {
        return this.initializeRuntimeWithPaths(path.join(__dirname, "../../", "matmachjs.wasm"), path.join(__dirname, "../../", "./matmachjs-lib.js"));
    }
    array(data, shape) {
        if (data.length == 0) {
            return this.ndarray(new Float64Array(0));
        }
        else if (typeof data[0] === 'number') {
            data = data;
            return this.ndarray(new Float64Array(data), shape);
        }
        else if (Array.isArray(data[0])) {
            data = data;
            let newData = new Float64Array(data.reduce((acc, array) => { acc.push(...array); return acc; }, []));
            return this.ndarray(newData, shape);
        }
        else {
            throw new Error("Input data must be an array-like object");
        }
    }
    ndarray(data, shape = [1, data.length], offset, order = "C", length = -1) {
        let order_opt;
        if (order == "C")
            order_opt = 0;
        else if (order == "R")
            order_opt = 1;
        else
            throw new Error("Order must be 'C' or 'R'");
        let shape_input_header = this._wi.create_mxvector(shape.length);
        let shape_input = MachUtil_1.MachUtil.createFloat64ArrayFromPtr(this._wi, shape_input_header);
        let totalElem = 1;
        shape.forEach((a, i) => {
            shape_input[i] = a;
            totalElem *= a;
        });
        if (typeof offset != "undefined") {
            if (MachUtil_1.MachUtil.isAligned(offset, data.BYTES_PER_ELEMENT))
                throw new Error(`Offset ${offset} must be ${data.BYTES_PER_ELEMENT} aligned`);
            data = new Float64Array(data.buffer, data.byteOffset + offset);
        }
        else if (length > 0) {
            data = new Float64Array(data.buffer, data.byteOffset, length);
            if (length !== totalElem)
                throw new Error("Length provided must be equal to the total size given by the shape");
        }
        if (totalElem !== data.length)
            throw new Error(`Data and Shape do not match, ${totalElem} != ${data.length}`);
        let arr = new MachArray_1.MachArray(this._wi, this._wi.create_mxarray_ND(shape_input_header, 0, 0, order_opt));
        // Fill data with values
        arr.set(data);
        // Free input vector
        this._wi.free_macharray(shape_input_header);
        return arr;
    }
    ones(args, mclass = types_1.MClass.float64) {
        if (mclass !== types_1.MClass.float64)
            throw new error_1.ValueTypeError(mclass, types_1.MClass.float64);
        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray_1.MachArray(this._wi, this._wi.create_mxarray_ND(shape));
        arr.fill(1);
        this._wi.free_macharray(shape);
        return arr;
    }
    zeros(args, mclass = types_1.MClass.float64) {
        if (mclass !== types_1.MClass.float64)
            throw new error_1.ValueTypeError(mclass, types_1.MClass.float64);
        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray_1.MachArray(this._wi, this._wi.zeros(shape));
        this._wi.free_macharray(shape);
        return arr;
    }
    fill(value, args, mclass = types_1.MClass.float64) {
        if (mclass !== types_1.MClass.float64)
            throw new error_1.ValueTypeError(mclass, types_1.MClass.float64);
        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray_1.MachArray(this._wi, this._wi.fill(shape, value));
        this._wi.free_macharray(shape);
        return arr;
    }
    randi(max_int, shape, mclass = types_1.MClass.float64) {
        if (mclass !== types_1.MClass.float64)
            throw new error_1.ValueTypeError(mclass, types_1.MClass.float64);
        let shape_arr = this.helperShapeConstructors(shape);
        let arr = new MachArray_1.MachArray(this._wi, this._wi.randi(max_int, shape_arr));
        this._wi.free_macharray(shape);
        return arr;
    }
    rand(args, mclass = types_1.MClass.float64) {
        if (mclass !== types_1.MClass.float64)
            throw new error_1.ValueTypeError(mclass, types_1.MClass.float64);
        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray_1.MachArray(this._wi, this._wi.rand(shape));
        this._wi.free_macharray(shape);
        return arr;
    }
    randn(args, mclass = types_1.MClass.float64) {
        if (mclass !== types_1.MClass.float64)
            throw new error_1.ValueTypeError(mclass, types_1.MClass.float64);
        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray_1.MachArray(this._wi, this._wi.randn(shape));
        this._wi.free_macharray(shape);
        return arr;
    }
    eye(args, mclass = types_1.MClass.float64) {
        if (mclass !== types_1.MClass.float64)
            throw new error_1.ValueTypeError(mclass, types_1.MClass.float64);
        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray_1.MachArray(this._wi, this._wi.eye(shape));
        this._wi.free_macharray(shape);
        return arr;
    }
    colon(i, j, k) {
        if (typeof k == "undefined")
            return new MachArray_1.MachArray(this._wi, this._wi.colon_two(i, j));
        else
            return new MachArray_1.MachArray(this._wi, this._wi.colon_three(i, j, k));
    }
    clone(arr) {
        return arr.clone();
    }
    // Binary operators.
    add(arr1, arr2) {
        if (typeof arr1 == "number" && typeof arr2 == "number") {
            return arr1 + arr2;
        }
        else if (typeof arr1 == "number" && arr2 instanceof MachArray_1.MachArray) {
            arr2 = arr2;
            return new MachArray_1.MachArray(this._wi, this._wi.plus_SM(arr1, arr2._headerOffset));
        }
        else if (typeof arr2 == "number" && arr1 instanceof MachArray_1.MachArray) {
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.plus_MS(arr1._headerOffset, arr2));
        }
        else {
            arr2 = arr2;
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.plus_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    sub(arr1, arr2) {
        if (typeof arr1 == "number" && typeof arr2 == "number") {
            return arr1 - arr2;
        }
        else if (typeof arr1 == "number" && arr2 instanceof MachArray_1.MachArray) {
            arr2 = arr2;
            return new MachArray_1.MachArray(this._wi, this._wi.minus_SM(arr1, arr2._headerOffset));
        }
        else if (typeof arr2 == "number" && arr1 instanceof MachArray_1.MachArray) {
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.minus_MS(arr1._headerOffset, arr2));
        }
        else {
            arr2 = arr2;
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.minus_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    mult(arr1, arr2) {
        if (typeof arr1 == "number" && typeof arr2 == "number") {
            return arr1 * arr2;
        }
        else if (typeof arr1 == "number" && arr2 instanceof MachArray_1.MachArray) {
            arr2 = arr2;
            return new MachArray_1.MachArray(this._wi, this._wi.times_SM(arr1, arr2._headerOffset));
        }
        else if (typeof arr2 == "number" && arr1 instanceof MachArray_1.MachArray) {
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.times_MS(arr1._headerOffset, arr2));
        }
        else {
            arr2 = arr2;
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.times_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    mmult(arr1, arr2) {
        if (typeof arr1 == "number" && typeof arr2 == "number") {
            return arr1 * arr2;
        }
        else if (typeof arr1 == "number" && arr2 instanceof MachArray_1.MachArray) {
            arr2 = arr2;
            return new MachArray_1.MachArray(this._wi, this._wi.mtimes_SM(arr1, arr2._headerOffset));
        }
        else if (typeof arr2 == "number" && arr1 instanceof MachArray_1.MachArray) {
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.mtimes_MS(arr1._headerOffset, arr2));
        }
        else {
            arr2 = arr2;
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.mtimes_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    ldivide(arr1, arr2) {
        if (typeof arr1 == "number" && typeof arr2 == "number") {
            return arr2 / arr1;
        }
        else if (typeof arr1 == "number" && arr2 instanceof MachArray_1.MachArray) {
            arr2 = arr2;
            return new MachArray_1.MachArray(this._wi, this._wi.ldivide_SM(arr1, arr2._headerOffset));
        }
        else if (typeof arr2 == "number" && arr1 instanceof MachArray_1.MachArray) {
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.ldivide_MS(arr1._headerOffset, arr2));
        }
        else {
            arr2 = arr2;
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.ldivide_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    rdivide(arr1, arr2) {
        if (typeof arr1 == "number" && typeof arr2 == "number") {
            return arr1 / arr2;
        }
        else if (typeof arr1 == "number" && arr2 instanceof MachArray_1.MachArray) {
            arr2 = arr2;
            return new MachArray_1.MachArray(this._wi, this._wi.rdivide_SM(arr1, arr2._headerOffset));
        }
        else if (typeof arr2 == "number" && arr1 instanceof MachArray_1.MachArray) {
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.rdivide_MS(arr1._headerOffset, arr2));
        }
        else {
            arr2 = arr2;
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.rdivide_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    rem(arr1, arr2) {
        if (typeof arr1 == "number" && typeof arr2 == "number") {
            return this._wi.rem_SS(arr1, arr2);
        }
        else if (typeof arr1 == "number" && arr2 instanceof MachArray_1.MachArray) {
            arr2 = arr2;
            return new MachArray_1.MachArray(this._wi, this._wi.rem_SM(arr1, arr2._headerOffset));
        }
        else if (typeof arr2 == "number" && arr1 instanceof MachArray_1.MachArray) {
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.rem_MS(arr1._headerOffset, arr2));
        }
        else {
            arr2 = arr2;
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.rem_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    mod(arr1, arr2) {
        if (typeof arr1 == "number" && typeof arr2 == "number") {
            return this._wi.mod_SS(arr1, arr2);
        }
        else if (typeof arr1 == "number" && arr2 instanceof MachArray_1.MachArray) {
            arr2 = arr2;
            return new MachArray_1.MachArray(this._wi, this._wi.mod_SM(arr1, arr2._headerOffset));
        }
        else if (typeof arr2 == "number" && arr1 instanceof MachArray_1.MachArray) {
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.mod_MS(arr1._headerOffset, arr2));
        }
        else {
            arr2 = arr2;
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.mod_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    power(arr1, arr2) {
        if (typeof arr1 == "number" && typeof arr2 == "number") {
            return Math.pow(arr1, arr2);
        }
        else if (typeof arr1 == "number" && arr2 instanceof MachArray_1.MachArray) {
            arr2 = arr2;
            return new MachArray_1.MachArray(this._wi, this._wi.power_SM(arr1, arr2._headerOffset));
        }
        else if (typeof arr2 == "number" && arr1 instanceof MachArray_1.MachArray) {
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.power_MS(arr1._headerOffset, arr2));
        }
        else {
            arr2 = arr2;
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.power_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    lt(arr1, arr2) {
        if (typeof arr1 == "number" && typeof arr2 == "number") {
            return arr1 < arr2;
        }
        else if (typeof arr1 == "number" && arr2 instanceof MachArray_1.MachArray) {
            arr2 = arr2;
            return new MachArray_1.MachArray(this._wi, this._wi.lt_SM(arr1, arr2._headerOffset));
        }
        else if (typeof arr2 == "number" && arr1 instanceof MachArray_1.MachArray) {
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.lt_MS(arr1._headerOffset, arr2));
        }
        else {
            arr2 = arr2;
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.lt_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    le(arr1, arr2) {
        if (typeof arr1 == "number" && typeof arr2 == "number") {
            return arr1 <= arr2;
        }
        else if (typeof arr1 == "number" && arr2 instanceof MachArray_1.MachArray) {
            arr2 = arr2;
            return new MachArray_1.MachArray(this._wi, this._wi.le_SM(arr1, arr2._headerOffset));
        }
        else if (typeof arr2 == "number" && arr1 instanceof MachArray_1.MachArray) {
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.le_MS(arr1._headerOffset, arr2));
        }
        else {
            arr2 = arr2;
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.le_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    gt(arr1, arr2) {
        if (typeof arr1 == "number" && typeof arr2 == "number") {
            return arr1 > arr2;
        }
        else if (typeof arr1 == "number" && arr2 instanceof MachArray_1.MachArray) {
            arr2 = arr2;
            return new MachArray_1.MachArray(this._wi, this._wi.gt_SM(arr1, arr2._headerOffset));
        }
        else if (typeof arr2 == "number" && arr1 instanceof MachArray_1.MachArray) {
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.gt_MS(arr1._headerOffset, arr2));
        }
        else {
            arr2 = arr2;
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.gt_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    ge(arr1, arr2) {
        if (typeof arr1 == "number" && typeof arr2 == "number") {
            return arr1 >= arr2;
        }
        else if (typeof arr1 == "number" && arr2 instanceof MachArray_1.MachArray) {
            arr2 = arr2;
            return new MachArray_1.MachArray(this._wi, this._wi.ge_SM(arr1, arr2._headerOffset));
        }
        else if (typeof arr2 == "number" && arr1 instanceof MachArray_1.MachArray) {
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.ge_MS(arr1._headerOffset, arr2));
        }
        else {
            arr2 = arr2;
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.ge_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    eq(arr1, arr2) {
        if (typeof arr1 == "number" && typeof arr2 == "number") {
            return arr1 === arr2;
        }
        else if (typeof arr1 == "number" && arr2 instanceof MachArray_1.MachArray) {
            arr2 = arr2;
            return new MachArray_1.MachArray(this._wi, this._wi.eq_SM(arr1, arr2._headerOffset));
        }
        else if (typeof arr2 == "number" && arr1 instanceof MachArray_1.MachArray) {
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.eq_MS(arr1._headerOffset, arr2));
        }
        else {
            arr2 = arr2;
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.eq_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    ne(arr1, arr2) {
        if (typeof arr1 == "number" && typeof arr2 == "number") {
            return arr1 !== arr2;
        }
        else if (typeof arr1 == "number" && arr2 instanceof MachArray_1.MachArray) {
            arr2 = arr2;
            return new MachArray_1.MachArray(this._wi, this._wi.ne_SM(arr1, arr2._headerOffset));
        }
        else if (typeof arr2 == "number" && arr1 instanceof MachArray_1.MachArray) {
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.ne_MS(arr1._headerOffset, arr2));
        }
        else {
            arr2 = arr2;
            arr1 = arr1;
            return new MachArray_1.MachArray(this._wi, this._wi.ne_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    all(arr1, dim) {
        if (typeof arr1 === "number")
            return arr1 != 0;
        let res = new MachArray_1.MachArray(this._wi, this._wi.all(arr1._headerOffset, dim + 1));
        if (res._numel === 1)
            return res[0] != 0;
        else
            return res;
    }
    any(arr1, dim) {
        if (typeof arr1 === "number")
            return arr1 != 0;
        let res = new MachArray_1.MachArray(this._wi, this._wi.any(arr1._headerOffset, dim + 1));
        if (res._numel === 1)
            return res[0] != 0;
        else
            return res;
    }
    mean(arr1, dim, naNFlag = false) {
        if (typeof arr1 === "number")
            return arr1;
        else
            return new MachArray_1.MachArray(this._wi, this._wi.mean(arr1._headerOffset, dim, naNFlag));
    }
    floor(arr1) {
        if (typeof arr1 === "number")
            return Math.floor(arr1);
        else
            return new MachArray_1.MachArray(this._wi, this._wi.floor_M(arr1._headerOffset));
    }
    ceil(arr1) {
        if (typeof arr1 === "number")
            return Math.ceil(arr1);
        else
            return new MachArray_1.MachArray(this._wi, this._wi.ceil_M(arr1._headerOffset));
    }
    sin(arr1) {
        if (typeof arr1 === "number")
            return Math.sin(arr1);
        else
            return new MachArray_1.MachArray(this._wi, this._wi.sin_M(arr1._headerOffset));
    }
    cos(arr1) {
        if (typeof arr1 === "number")
            return Math.cos(arr1);
        else
            return new MachArray_1.MachArray(this._wi, this._wi.cos_M(arr1._headerOffset));
    }
    tan(arr1) {
        if (typeof arr1 === "number")
            return Math.tan(arr1);
        else
            return new MachArray_1.MachArray(this._wi, this._wi.tan_M(arr1._headerOffset));
    }
    sqrt(arr1) {
        if (typeof arr1 === "number")
            return Math.sqrt(arr1);
        else
            return new MachArray_1.MachArray(this._wi, this._wi.sqrt_M(arr1._headerOffset));
    }
    uminus(arr1) {
        if (typeof arr1 === "number")
            return -arr1;
        else
            return new MachArray_1.MachArray(this._wi, this._wi.uminus_M(arr1._headerOffset));
    }
    round(arr1) {
        if (typeof arr1 === "number")
            return Math.round(arr1);
        else
            return new MachArray_1.MachArray(this._wi, this._wi.round_M(arr1._headerOffset));
    }
    exp(arr1) {
        if (typeof arr1 === "number")
            return Math.exp(arr1);
        else
            return new MachArray_1.MachArray(this._wi, this._wi.exp_M(arr1._headerOffset));
    }
    log(arr1) {
        if (typeof arr1 === "number")
            return Math.log(arr1);
        else
            return new MachArray_1.MachArray(this._wi, this._wi.log_M(arr1._headerOffset));
    }
    abs(arr1) {
        if (typeof arr1 === "number")
            return Math.abs(arr1);
        else
            return new MachArray_1.MachArray(this._wi, this._wi.abs_M(arr1));
    }
    not(arr1) {
        if (typeof arr1 === "number")
            return this._wi.not_S(arr1);
        else
            return new MachArray_1.MachArray(this._wi, this._wi.not_M(arr1._headerOffset));
    }
    fix(arr1) {
        if (typeof arr1 === "number")
            return this._wi.fix_S(arr1);
        else
            return new MachArray_1.MachArray(this._wi, this._wi.fix_M(arr1._headerOffset));
    }
    sum(arr1, dim = 0, nanFlag = false) {
        if (typeof arr1 === "number")
            return arr1;
        return new MachArray_1.MachArray(this._wi, this._wi.sum(arr1._headerOffset, dim, nanFlag));
    }
    prod(arr1, dim = 0, nanFlag = false) {
        if (typeof arr1 === "number")
            return arr1;
        return new MachArray_1.MachArray(this._wi, this._wi.prod(arr1._headerOffset, dim, nanFlag));
    }
    transpose(arr1) {
        if (typeof arr1 === "number")
            return arr1;
        return new MachArray_1.MachArray(this._wi, this._wi.transpose_M(arr1._headerOffset));
    }
    concat(arrays, dim) {
        if (typeof dim === "undefined")
            dim = 0;
        else if (dim > 0)
            dim++;
        if (arrays.length > 0) {
            let inp_vec = new MachArray_1.MachArray(this._wi, this._wi.create_mxvector(arrays.length, 5));
            arrays.forEach((arr, i) => {
                inp_vec[i] = arr._headerOffset;
            });
            let res = new MachArray_1.MachArray(this._wi, this._wi.concat(dim, inp_vec._headerOffset));
            inp_vec.free();
            return res;
        }
        else {
            return new MachArray_1.MachArray(this._wi, this._wi.concat(dim));
        }
    }
    horzcat(arrays) {
        if (arrays.length > 1) {
            let inp_vec = new MachArray_1.MachArray(this._wi, this._wi.create_mxvector(arrays.length, 5));
            arrays.forEach((arr, i) => {
                inp_vec[i] = arr._headerOffset;
            });
            let res = new MachArray_1.MachArray(this._wi, this._wi.horzcat(inp_vec._headerOffset));
            inp_vec.free();
            return res;
        }
        else {
            return new MachArray_1.MachArray(this._wi, this._wi.horzcat());
        }
    }
    vertcat(arrays) {
        if (arrays.length > 1) {
            let inp_vec = new MachArray_1.MachArray(this._wi, this._wi.create_mxvector(arrays.length, 5));
            arrays.forEach((arr, i) => {
                inp_vec[i] = arr._headerOffset;
            });
            return new MachArray_1.MachArray(this._wi, this._wi.vertcat(inp_vec._headerOffset));
        }
        else {
            return new MachArray_1.MachArray(this._wi, this._wi.vertcat());
        }
    }
    helperShapeConstructors(args) {
        if (typeof args === "undefined" || args.length === 0) {
            let shape_input_header = this._wi.create_mxvector(2);
            let shape_input = MachUtil_1.MachUtil.createFloat64ArrayFromPtr(this._wi, shape_input_header);
            shape_input[0] = 1;
            shape_input[1] = 1;
            return shape_input_header;
        }
        return this.transformToWasmArray(args);
    }
    transformToWasmArray(shape) {
        let shape_input_header = this._wi.create_mxvector(shape.length);
        let shape_input = MachUtil_1.MachUtil.createFloat64ArrayFromPtr(this._wi, shape_input_header);
        shape.forEach((a, i) => shape_input[i] = a);
        return shape_input_header;
    }
}
exports.MachRuntime = MachRuntime;
