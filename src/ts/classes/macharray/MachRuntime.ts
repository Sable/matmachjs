
import { IMachRuntime } from "./interface/IMachRuntime";
import {  MClass } from "./types";

import { MachArray } from "./MachArray";
import {  ValueTypeError } from "../error";
import { MachUtil } from "./MachUtil";
import  { MatMachNativeLib } from "../native/matmachjs-lib";
import { MatMachNativeModule } from "../native/matmachjs-wasm";
import { MatMachWasm } from "../native/MatMachWasm";


export declare let _wi: MatMachWasm;

export class MachRuntime implements IMachRuntime{
    // Need to have buffers here! A huge buffer! Then anytime WebAssembly memory grows
    // a call back is added, this call-back will update all the buffers and this buffers will
    // be used.
    public _wi:MatMachWasm;
    private _buffer:ArrayBuffer;

    constructor(wi: MatMachWasm){
        _wi = wi;
        this._wi = wi;
        this._buffer = wi.mem.buffer;
    }
    /**
     * initializeRuntime()
     * Initializes the MachRuntime
     */  
    public static async initializeRuntimeWithPaths(): Promise<MachRuntime> {
        let wi = await WebAssembly.instantiate(this.hexStringByteArray(MatMachNativeModule),MatMachNativeLib);
         return new MachRuntime(wi.instance.exports);
    }
    public static async initializeRuntime(): Promise<MachRuntime> {
        let wi = await WebAssembly.instantiate(
            this.hexStringByteArray(MatMachNativeModule),MatMachNativeLib);
        return new MachRuntime(wi.instance.exports);
    }
    public set_order(array:MachArray, order:string){
        return array.reorder(order);
    }
    public reshape(array:MachArray, newshape:number[]){
        return array.reshape(newshape);
    }
    public array(data: number[]|number[][], shape?:number[]): MachArray{
        if(data.length == 0){
            return this.ndarray(new Float64Array(0));
        }else if(typeof data[0] === 'number'){
            data = <number[]>data;
            return this.ndarray(new Float64Array(data), shape);
        }else if(Array.isArray(data[0])){
            let shape:number[] = [];
            data = <number[][]>data;
            let total_data:number[] = [];
            shape.push(data.length);
            shape.push(data[0].length);
            data.forEach((array)=>{
                total_data.push(...array);
            },[]);
            let newData = new Float64Array(total_data);
            return this.ndarray(newData, shape);
        }else{
            throw new Error("Input data must be an array-like object");
        }
    }

    public ndarray(data:Float64Array|MachArray,
                   shape?:number[]|Float64Array,
                   offset:number=0,
                   order:string = "C",
                   length?:number ):MachArray{

        if(order !== "C" && order !=="R" )
            throw new Error("Order must be 'C' or 'R'");

        if(typeof shape === "undefined"){
            if(data instanceof MachArray){
                shape = data._shape;
            }else{
                if(data.length == 0){
                    shape = [0,0];
                }else{
                    shape = [1,data.length];
                }
            }
        }

        let shape_input_header =  this._wi.create_mxvector(shape.length);
        let shape_input = MachUtil.createFloat64ArrayFromPtr(this._wi,shape_input_header); 
        let totalElem = 1;
        for(let i = 0;i<shape.length;i++) {
            shape_input[i] = shape[i];
            totalElem*=shape[i];
        }
        let dataLength = (data instanceof MachArray)?data._numel:data.length;
        let newData: Float64Array;
        if(offset < 0) throw new Error("Offset must be larger than 0 when creating a MachArray");
        if(typeof length === "undefined"){
            length = dataLength - offset;
        }
        if(length >= 0) {
            if(length > dataLength) throw new Error(`Length: ${length} must be less than the data content: ${dataLength}`);
            if(length !== totalElem) throw new Error("Length provided must be equal to the total size given by the shape");
        }else{
            throw new Error(`Length: ${length} must be a positive number`)
        }
        if(offset > 0) {
            if(typeof length !== "undefined"&& offset+length > dataLength)
                    throw new Error(`New data : ${offset+length} must be less than the data content: ${dataLength}`);
        }
        if(data instanceof MachArray){
            newData = new Float64Array(_wi.mem.buffer,  data._headerOffset+ offset*data.BYTES_PER_ELEMENT, length);
        }else{
            newData = new Float64Array(data.buffer,  data.byteOffset+ offset*data.BYTES_PER_ELEMENT, length);
        }
        let arr: MachArray;
        if(!(data instanceof MachArray)){
            arr = new MachArray(
                this._wi.create_mxarray_ND(shape_input_header,0,0));
            // Fill data with values
            arr._data.set(newData);
        }else{
            let arr_header =  new Int32Array(this._wi.mem.buffer,
                    this._wi.create_mxarray_ND(shape_input_header,0,0),7);
            arr_header[2] = newData.byteOffset;

            arr = new MachArray(arr_header.byteOffset);
        }

        if(order === "R"){
            let total = 1;
            for(let i= arr._shape.length-1; i>=0 ;i--){
                arr._strides[i] = total;
                total*=arr._shape[i];
            }
        }
        // Free input vector
        this._wi.free_macharray(shape_input_header);
        return arr;
    }
    public isempty(arr: MachArray):boolean{
        return arr._numel == 0;
    }
    public isscalar(arr: MachArray):boolean{
        return arr._numel == 1;
    }
    public length(arr: MachArray):number{
        return arr.dim_length();
    }
    public ndims(arr: MachArray):number{
        return arr._ndims;
    }
    public numel(arr: MachArray):number{
        return arr._numel;
    }
    public isvector(arr: MachArray):boolean{
        return arr.isvector();
    }
    public ismatrix(arr: MachArray) :boolean{
        return arr.ismatrix();
    }
    public isrow(arr: MachArray) :boolean{
        return arr.isrow();
    }
    /**
     * Returns whether the MachArray is a column vector
     * @param {MachArray} arr 
     * @returns {boolean} 
     */
    public iscolumn(arr: MachArray) :boolean{
        return arr.iscolumn();
    }
    public empty(args?:number[], mclass=MClass.float64){
        if(mclass !== MClass.float64)
            throw new ValueTypeError(mclass, MClass.float64);
        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray( this._wi.create_mxarray_ND(shape) );
        this._wi.free_macharray(shape);
        return arr; 
    }
    public ones_experimental2(args?:number[],mclass=MClass.float64): MachArray{
        if(mclass !== MClass.float64)
            throw new ValueTypeError(mclass, MClass.float64);

        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray( this._wi.ones_experimental2(shape));
        this._wi.free_macharray(shape);
        return arr;
    }
    public ones_experimental(args?:number[],mclass=MClass.float64): MachArray{
        if(mclass !== MClass.float64)
            throw new ValueTypeError(mclass, MClass.float64);

        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray( this._wi.ones_experimental(shape));
        this._wi.free_macharray(shape);
        return arr;
    }
    public ones(args?:number[],mclass=MClass.float64): MachArray{
        if(mclass !== MClass.float64)
            throw new ValueTypeError(mclass, MClass.float64);
        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray( this._wi.ones(shape));
        this._wi.free_macharray(shape);
        return arr;
    }
    public ones_test(args?:number[],mclass=MClass.float64): MachArray{
        if(mclass !== MClass.float64)
            throw new ValueTypeError(mclass, MClass.float64);
        if(args&&args.length == 2){
            return new MachArray(this._wi.ones_2D(args[0],args[1]));
        }
        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray( this._wi.ones(shape));
        this._wi.free_macharray(shape);
        return arr;
    }
    public zeros(args?:number[],mclass=MClass.float64): MachArray{
        if(mclass !== MClass.float64)
            throw new ValueTypeError(mclass, MClass.float64);
        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray( this._wi.zeros(shape));
        this._wi.free_macharray(shape);
        return arr;
    }

    /**
     * Sets all the array entries to the value parameter
     * @param {MachArray} arr  MachArray to fill
     * @param {number} value Value used to fill the array 
     */
    public fill(arr: MachArray, value:number):void{
        _wi.fill(arr._headerOffset, value);

    }
    public randi(max_int:number, shape?:number[],mclass=MClass.float64): MachArray{
        if(mclass !== MClass.float64)
            throw new ValueTypeError(mclass, MClass.float64);
        let shape_arr = this.helperShapeConstructors(shape); 
        let arr = new MachArray( this._wi.randi(max_int, shape_arr));
        this._wi.free_macharray(shape_arr);
        return arr; 
    }
    public rand(args?:number[],mclass=MClass.float64): MachArray{
        if(mclass !== MClass.float64)
            throw new ValueTypeError(mclass, MClass.float64);
        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray( this._wi.rand(shape));
        this._wi.free_macharray(shape);
        return arr; 
    }

    public randn(args?:number[],mclass=MClass.float64): MachArray{
        if(mclass !== MClass.float64)
            throw new ValueTypeError(mclass, MClass.float64);
        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray( this._wi.randn(shape));
        this._wi.free_macharray(shape);
        return arr;
    }

    public eye(args?:number[],mclass=MClass.float64): MachArray{
        if(mclass !== MClass.float64)
            throw new ValueTypeError(mclass, MClass.float64);
        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray( this._wi.eye(shape));
        this._wi.free_macharray(shape);
        return arr;
    }

    public colon(i:number, j:number, k?:number): MachArray{
        if(typeof k == "undefined") 
            return new MachArray( this._wi.colon_two(i,j));
        else return new MachArray( this._wi.colon_three(i,j,k));
    }

    public clone(arr: MachArray): MachArray{
        return arr.clone();
    }
    /**
     * Tests whether the arrays have the same values and dimensions, treats NaN as not equal
     * @throws Will throw error if less than two MachArray's are passed
     * @param arrs input arrays to tests 
     */
    public isequal(...arrs:MachArray[]) {
        if(arrs.length == 2){
            return this._wi.isequal_two(arrs[0]._headerOffset, arrs[1]._headerOffset) == 1;
        }else{
            let input_vec = this._wi.create_mxvector(arrs.length,5);
            arrs.forEach((arr,i)=>{
                this._wi.set_array_index_i32_no_check(input_vec, i,arr._headerOffset);
            });
            let result = this._wi.isequal(input_vec) == 1;
            this._wi.free_macharray(input_vec);
            return result;
        }
    }
    /**
     * Tests whether the arrays have the same values and dimensions, it treats NaN as equal
     * @throws Will throw error if less than two MachArray's are passed
     * @param arrs input arrays to tests 
     */
    public isequaln(...arrs:MachArray[]){
        if(arrs.length == 2){
            return this._wi.isequaln_two(arrs[0]._headerOffset, arrs[1]._headerOffset) == 1;
        }else{
            let input_vec = this._wi.create_mxvector(arrs.length,5);
            arrs.forEach((arr,i)=>{
                this._wi.set_array_index_i32_no_check(input_vec, i,arr._headerOffset);
            });
            let result = this._wi.isequaln(input_vec) == 1;
            this._wi.free_macharray(input_vec);
            return result;
        } 
    }
    // Binary operators.
    public add(arr1: MachArray|number, arr2: MachArray|number, out?:MachArray) {
        let out_ptr = (out instanceof MachArray)?out._headerOffset:null;
        if(typeof arr1 == "number" && typeof arr2 == "number"){
            return arr1 + arr2;
        }else if(typeof arr1 == "number" && arr2 instanceof MachArray){
            
            return new MachArray( this._wi.plus_SM(arr1, arr2._headerOffset,out_ptr));
        }else if(arr1 instanceof MachArray && typeof arr2 == "number" ){
            return new MachArray( this._wi.plus_MS(arr1._headerOffset, arr2,out_ptr));
        }else {
            arr2 = <MachArray> arr2;
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.plus_MM(arr1._headerOffset, arr2._headerOffset,out_ptr));
        }
    }

    public sub(arr1: MachArray|number, arr2: MachArray|number){
        if(typeof arr1 == "number" && typeof arr2 == "number"){
            return arr1 - arr2;
        }else if(typeof arr1 == "number" && arr2 instanceof MachArray){
            arr2 = <MachArray> arr2;
            return new MachArray( this._wi.minus_SM(arr1, arr2._headerOffset));
        }else if(typeof arr2 == "number" && arr1 instanceof MachArray){
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.minus_MS(arr1._headerOffset, arr2));
        }else {
            arr2 = <MachArray> arr2;
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.minus_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }

    public mult(arr1: MachArray|number, arr2: MachArray|number){
        if(typeof arr1 == "number" && typeof arr2 == "number"){
            return arr1 * arr2;
        }else if(typeof arr1 == "number" && arr2 instanceof MachArray){
            arr2 = <MachArray> arr2;
            return new MachArray( this._wi.times_SM(arr1, arr2._headerOffset));
        }else if(typeof arr2 == "number" && arr1 instanceof MachArray){
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.times_MS(arr1._headerOffset, arr2));
        }else {
            arr2 = <MachArray> arr2;
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.times_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }


    public mmult(arr1: MachArray|number, arr2: MachArray|number){
        if(typeof arr1 == "number" && typeof arr2 == "number"){
            return arr1 * arr2;
        }else if(typeof arr1 == "number" && arr2 instanceof MachArray){
            arr2 = <MachArray> arr2;
            return new MachArray( this._wi.mtimes_SM(arr1, arr2._headerOffset));
        }else if(typeof arr2 == "number" && arr1 instanceof MachArray){
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.mtimes_MS(arr1._headerOffset, arr2));
        }else {
            arr2 = <MachArray> arr2;
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.mtimes_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    public ldivide(arr1: MachArray|number, arr2: MachArray|number){
        if(typeof arr1 == "number" && typeof arr2 == "number"){
            return  arr2 / arr1;
        }else if(typeof arr1 == "number" && arr2 instanceof MachArray){
            arr2 = <MachArray> arr2;
            return new MachArray( this._wi.ldivide_SM(arr1, arr2._headerOffset));
        }else if(typeof arr2 == "number" && arr1 instanceof MachArray){
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.ldivide_MS(arr1._headerOffset, arr2));
        }else {
            arr2 = <MachArray> arr2;
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.ldivide_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    public rdivide(arr1: MachArray|number, arr2: MachArray|number){
        if(typeof arr1 == "number" && typeof arr2 == "number"){
            return  arr1 / arr2;
        }else if(typeof arr1 == "number" && arr2 instanceof MachArray){
            arr2 = <MachArray> arr2;
            return new MachArray( this._wi.rdivide_SM(arr1, arr2._headerOffset));
        }else if(typeof arr2 == "number" && arr1 instanceof MachArray){
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.rdivide_MS(arr1._headerOffset, arr2));
        }else {
            arr2 = <MachArray> arr2;
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.rdivide_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    public rem(arr1: MachArray|number, arr2: MachArray|number){
        if(typeof arr1 == "number" && typeof arr2 == "number"){
            return  this._wi.rem_SS(arr1,arr2);
        }else if(typeof arr1 == "number" && arr2 instanceof MachArray){
            arr2 = <MachArray> arr2;
            return new MachArray( this._wi.rem_SM(arr1, arr2._headerOffset));
        }else if(typeof arr2 == "number" && arr1 instanceof MachArray){
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.rem_MS(arr1._headerOffset, arr2));
        }else {
            arr2 = <MachArray> arr2;
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.rem_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    public mod(arr1: MachArray|number, arr2: MachArray|number){
        if(typeof arr1 == "number" && typeof arr2 == "number"){
            return  this._wi.mod_SS(arr1,arr2);
        }else if(typeof arr1 == "number" && arr2 instanceof MachArray){
            arr2 = <MachArray> arr2;
            return new MachArray( this._wi.mod_SM(arr1, arr2._headerOffset));
        }else if(typeof arr2 == "number" && arr1 instanceof MachArray){
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.mod_MS(arr1._headerOffset, arr2));
        }else {
            arr2 = <MachArray> arr2;
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.mod_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    public power(arr1: MachArray|number, arr2: MachArray|number){
        if(typeof arr1 == "number" && typeof arr2 == "number"){
            return  Math.pow(arr1,arr2);
        }else if(typeof arr1 == "number" && arr2 instanceof MachArray){
            arr2 = <MachArray> arr2;
            return new MachArray( this._wi.power_SM(arr1, arr2._headerOffset));
        }else if(typeof arr2 == "number" && arr1 instanceof MachArray){
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.power_MS(arr1._headerOffset, arr2));
        }else {
            arr2 = <MachArray> arr2;
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.power_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }
    public lt(arr1: MachArray|number, arr2: MachArray|number){
        if(typeof arr1 == "number" && typeof arr2 == "number"){
            return  arr1 < arr2
        }else if(typeof arr1 == "number" && arr2 instanceof MachArray){
            arr2 = <MachArray> arr2;
            return new MachArray( this._wi.lt_SM(arr1, arr2._headerOffset));
        }else if(typeof arr2 == "number" && arr1 instanceof MachArray){
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.lt_MS(arr1._headerOffset, arr2));
        }else {
            arr2 = <MachArray> arr2;
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.lt_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }    
    public le(arr1: MachArray|number, arr2: MachArray|number){
        if(typeof arr1 == "number" && typeof arr2 == "number"){
            return  arr1 <= arr2
        }else if(typeof arr1 == "number" && arr2 instanceof MachArray){
            arr2 = <MachArray> arr2;
            return new MachArray( this._wi.le_SM(arr1, arr2._headerOffset));
        }else if(typeof arr2 == "number" && arr1 instanceof MachArray){
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.le_MS(arr1._headerOffset, arr2));
        }else {
            arr2 = <MachArray> arr2;
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.le_MM(arr1._headerOffset, arr2._headerOffset));
        }
    }   
    public gt(arr1: MachArray|number, arr2: MachArray|number){
        if(typeof arr1 == "number" && typeof arr2 == "number"){
            return  arr1 > arr2
        }else if(typeof arr1 == "number" && arr2 instanceof MachArray){
            arr2 = <MachArray> arr2;
            return new MachArray( this._wi.gt_SM(arr1, arr2._headerOffset));
        }else if(typeof arr2 == "number" && arr1 instanceof MachArray){
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.gt_MS(arr1._headerOffset, arr2));
        }else {
            arr2 = <MachArray> arr2;
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.gt_MM(arr1._headerOffset, arr2._headerOffset));
        }
    } 
    public ge(arr1: MachArray|number, arr2: MachArray|number){
        if(typeof arr1 == "number" && typeof arr2 == "number"){
            return  arr1 >= arr2
        }else if(typeof arr1 == "number" && arr2 instanceof MachArray){
            arr2 = <MachArray> arr2;
            return new MachArray( this._wi.ge_SM(arr1, arr2._headerOffset));
        }else if(typeof arr2 == "number" && arr1 instanceof MachArray){
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.ge_MS(arr1._headerOffset, arr2));
        }else {
            arr2 = <MachArray> arr2;
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.ge_MM(arr1._headerOffset, arr2._headerOffset));
        }
    } 

    public eq(arr1: MachArray|number, arr2: MachArray|number){
        if(typeof arr1 == "number" && typeof arr2 == "number"){
            return  arr1 === arr2
        }else if(typeof arr1 == "number" && arr2 instanceof MachArray){
            arr2 = <MachArray> arr2;
            return new MachArray( this._wi.eq_SM(arr1, arr2._headerOffset));
        }else if(typeof arr2 == "number" && arr1 instanceof MachArray){
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.eq_MS(arr1._headerOffset, arr2));
        }else {
            arr2 = <MachArray> arr2;
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.eq_MM(arr1._headerOffset, arr2._headerOffset));
        }
    } 

    public ne(arr1: MachArray|number, arr2: MachArray|number){
        if(typeof arr1 == "number" && typeof arr2 == "number"){
            return  arr1 !== arr2
        }else if(typeof arr1 == "number" && arr2 instanceof MachArray){
            arr2 = <MachArray> arr2;
            return new MachArray( this._wi.ne_SM(arr1, arr2._headerOffset));
        }else if(typeof arr2 == "number" && arr1 instanceof MachArray){
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.ne_MS(arr1._headerOffset, arr2));
        }else {
            arr2 = <MachArray> arr2;
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.ne_MM(arr1._headerOffset, arr2._headerOffset));
        }
    } 
    public all(arr1: MachArray|number, dim?:number):MachArray|boolean{
        if(typeof arr1 === "number") return arr1 != 0;
        dim = (dim)?dim:0;
        let res = new MachArray( this._wi.all(arr1._headerOffset,dim+1));
        if(res._numel === 1) return res[0] != 0;
        else return res;
    }
    /**
     * Determines whether array has any non-zero elements
     * @param {MachArray|number} arr1 array to test
     * @returns {boolean}
     */
    public all_nonzeros(arr1: MachArray|number):boolean{
        if(typeof arr1 === "number") return arr1 != 0;
        return this._wi.all_nonzero_reduction(arr1) == 0;
    } 
    /**
     * Determines whether array has any element that is zero
     * @param {MachArray|number} arr1 array to test
     * @returns {boolean}
     */
    public any_nonzeros(arr1: MachArray|number):boolean{
        if(typeof arr1 === "number") return arr1 != 0;
        return this._wi.any_nonzero_reduction(arr1) == 0;
    } 


    public any(arr1: MachArray|number, dim:number):MachArray|boolean{
        if(typeof arr1 === "number") return arr1 != 0;
        let res = new MachArray( this._wi.any(arr1._headerOffset,dim+1));
        if(res._numel === 1) return res[0] != 0;
        else return res;
    }

    public mean(arr1:MachArray|number, opts?:ReductionOpts){
        if(typeof arr1 === "number") return arr1;
        if(typeof opts === "undefined"){
            return this._wi.mean_all_M(arr1._headerOffset);
        }else{
            if(typeof opts.nanFlag !== "boolean") opts.nanFlag = false;
            if(typeof opts.axis === "undefined"){
                return this._wi.mean_all_M(arr1._headerOffset, opts.nanFlag);
            }else{
                return new MachArray( this._wi.mean(arr1._headerOffset,opts.axis+1, opts.nanFlag));
            }
        }
    } 
    public floor(arr1: MachArray|number){
        if(typeof arr1 === "number") return Math.floor(arr1);
        else return new MachArray( this._wi.floor_M(arr1._headerOffset));
    }
    public ceil(arr1: MachArray|number){
        if(typeof arr1 === "number") return Math.ceil(arr1);
        else return new MachArray( this._wi.ceil_M(arr1._headerOffset));
    }

    
    
    public sin(arr1: MachArray|number, out?:MachArray){
        if(typeof arr1 === "number") return Math.sin(arr1);

        if(out){
            return new MachArray(this._wi.
                sin_M_noallocation(arr1._headerOffset, out._headerOffset));
        }
        else return new MachArray( this._wi.sin_M(arr1._headerOffset));
    }
    
    
    
    public cos(arr1: MachArray|number){
        if(typeof arr1 === "number") return Math.cos(arr1);
        else return new MachArray( this._wi.cos_M(arr1._headerOffset));
    }
    public tan(arr1: MachArray|number){
        if(typeof arr1 === "number") return Math.tan(arr1);
        else return new MachArray( this._wi.tan_M(arr1._headerOffset));
    }
    public sqrt(arr1: MachArray|number){
        if(typeof arr1 === "number") return Math.sqrt(arr1);
        else return new MachArray( this._wi.sqrt_M(arr1._headerOffset));
    }
    public uminus(arr1: MachArray|number){
        if(typeof arr1 === "number") return -arr1;
        else return new MachArray( this._wi.uminus_M(arr1._headerOffset));
    }
    public round(arr1: MachArray|number){
        if(typeof arr1 === "number") return Math.round(arr1);
        else return new MachArray( this._wi.round_M(arr1._headerOffset));
    }
    public exp(arr1: MachArray|number){
        if(typeof arr1 === "number") return Math.exp(arr1);
        else return new MachArray( this._wi.exp_M(arr1._headerOffset));
    }
    public log(arr1: MachArray|number){
        if(typeof arr1 === "number") return Math.log(arr1);
        else return new MachArray( this._wi.log_M(arr1._headerOffset));
    }

    public abs(arr1: MachArray|number){
        if(typeof arr1 === "number") return Math.abs(arr1);
        else return new MachArray( this._wi.abs_M(arr1._headerOffset));
    }
    public not(arr1: MachArray|number){
        if(typeof arr1 === "number") return this._wi.not_S(arr1);
        else return new MachArray( this._wi.not_M(arr1._headerOffset));
    }
    public fix(arr1: MachArray|number){
        if(typeof arr1 === "number") return this._wi.fix_S(arr1);
        else return new MachArray( this._wi.fix_M(arr1._headerOffset));
    }
    public sum(arr1:MachArray|number,   opts?:ReductionOpts){
        if(typeof arr1 === "number") return arr1;
        if(typeof opts === "undefined"){
            return this._wi.sum_all_M(arr1._headerOffset);
        }else{
            if(typeof opts.nanFlag !== "boolean") opts.nanFlag = false;
            if(typeof opts.axis === "undefined"){
                return this._wi.sum_all_M(arr1._headerOffset, opts.nanFlag);
            }else{
                return new MachArray( this._wi.sum(arr1._headerOffset,opts.axis+1, opts.nanFlag));
            }
        }
    }
    public prod(arr1:MachArray|number, dim:number=0, nanFlag=false){
        if(typeof arr1 === "number") return arr1; 
        return new MachArray( this._wi.prod(arr1._headerOffset,dim, nanFlag));
    }
    public transpose(arr1:MachArray|number){
        if(typeof arr1 === "number") return arr1; 
        return new MachArray( this._wi.transpose_M(arr1._headerOffset));
    }
    public concat(arrays:MachArray[], dim?:number){
        if(typeof dim === "undefined") dim = 0;
        else if(dim > 0) dim++;
        if(arrays.length > 0){
            let inp_vec = new MachArray( this._wi.create_mxvector(arrays.length,5),);
            arrays.forEach((arr,i)=>{
                inp_vec._data[i] = arr._headerOffset;
            });
            let res =  new MachArray( this._wi.concat(dim, inp_vec._headerOffset));
            inp_vec.free();
            return res;
        }else{
            return new MachArray( this._wi.concat(dim));
        }
    }
     
    public horzcat(...arrays: Array<MachArray>){
        if(arrays.length > 1){
            let inp_vec = new MachArray( this._wi.create_mxvector(arrays.length,5));
            let flagAllColumnOrder = true;
            arrays.forEach((arr,i)=>{
                inp_vec._data[i] = arr._headerOffset;
                flagAllColumnOrder = flagAllColumnOrder && arr._order=="C";
            });
            let res;
            if(flagAllColumnOrder && arrays[0]._ndims === 2){
                res =  new MachArray( this._wi.horzcat_corder(inp_vec._headerOffset));
            }else{
                res = new MachArray(this._wi.horzcat(inp_vec._headerOffset));
            }
            inp_vec.free();
            return res;
        }else{
            return new MachArray( this._wi.horzcat());
        }
    }

    public vertcat(...arrays:MachArray[]){
        if(arrays.length > 1){
            let inp_vec = new MachArray( this._wi.create_mxvector(arrays.length,5));
            arrays.forEach((arr,i)=>{
                inp_vec._data[i] = arr._headerOffset;
            });
            let res =  new MachArray( this._wi.vertcat(inp_vec._headerOffset));
            inp_vec.free();
            return res;
        }else{
            return new MachArray( this._wi.vertcat());
        }

    }


    private helperShapeConstructors(args?:number[]): number{
        if(typeof args === "undefined" || args.length === 0){
            let shape_input_header = this._wi.create_mxvector(2);
            let shape_input = MachUtil.createFloat64ArrayFromPtr(this._wi, 
                shape_input_header);
            shape_input[0] = 1;
            shape_input[1] = 1;
            return shape_input_header;
        }else if(args.length == 1){ // Create a row-vector
            let shape_input_header = this._wi.create_mxvector(2);
            let shape_input = MachUtil.createFloat64ArrayFromPtr(this._wi,
                shape_input_header);
            shape_input[0] = args[0];
            shape_input[1] = 1;
            return shape_input_header;
        }
        return this.transformToWasmArray(args);
    }
    private transformToWasmArray(shape:number[]): number{
        let shape_input_header = this._wi.create_mxvector(shape.length); 
        let shape_input = MachUtil.createFloat64ArrayFromPtr(this._wi, 
            shape_input_header);
        shape.forEach((a,i)=> shape_input[i] = a);
        return shape_input_header;
    }
    private static hexStringByteArray(str: string){
        let a:number[] = [];
        for (let i = 0, len = str.length; i < len; i+=2) {
            a.push(parseInt(str.substr(i,2),16));
        }
      return new Uint8Array(a);
    }
    
}
interface ReductionOpts{
    axis?:number;
    nanFlag?:boolean;
}