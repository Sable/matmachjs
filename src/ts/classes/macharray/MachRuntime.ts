
import { IMachRuntime } from "./interface/IMachRuntime";
import { ArrayValue, MClass } from "./types";

import { MachArray } from "./MachArray";
import { ArrayValueTypeError, ValueTypeError } from "../error";
import { MachUtil } from "./MachUtil";

import * as fs from 'fs';
import { MatMachWasm } from "../../wasm_interface/MatMachWasm";
import * as path from "path";


export declare let _wi: MatMachWasm;

export class MachRuntime implements IMachRuntime{
    private _wi:MatMachWasm;
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
    public static async initializeRuntimeWithPaths(path_wat:string, path_js_lib: string): Promise<MachRuntime> {
        let wi = await WebAssembly.instantiate(
            fs.readFileSync(path_wat),
                await import(path_js_lib));    
         return new MachRuntime(wi.instance.exports);
    }
    public static async initializeRuntime(): Promise<MachRuntime> {
        return this.initializeRuntimeWithPaths(path.join(__dirname,"../../","matmachjs.wasm"),
                path.join(__dirname,"../../","./matmachjs-lib.js"));
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

        let order_opt:number;
        if(order=="C") order_opt = 0;
        else if(order=="R") order_opt = 1;
        else throw new Error("Order must be 'C' or 'R'");

        if(typeof shape === "undefined"){
            if(data instanceof MachArray){
                shape = data._shape;
            }else{
                shape = [1,data.length];
            }
        }

        let shape_input_header =  this._wi.create_mxvector(shape.length);
        let shape_input = MachUtil.createFloat64ArrayFromPtr(this._wi,shape_input_header); 
        let totalElem = 1;
        for(let i = 0;i<shape.length;i++) {
            shape_input[i] = shape[i];
            totalElem*=shape[i];

        }
        let newData: Float64Array;
        if(offset > 0) {
            if(typeof length !== "undefined"&& offset+length > data.length)
                    throw new Error(`New data : ${offset+length} must be less than the data content: ${data.length}`);
        }
        length = (length)?length:data.length - offset;
        if(length> 0) {
            if(length > data.length) throw new Error(`Length: ${length} must be less than the data content: ${data.length}`);
            if(length !== totalElem) throw new Error("Length provided must be equal to the total size given by the shape");
        }else{
            throw new Error(`Length: ${length} must be a positive number`)
        }

        newData = new Float64Array(data.buffer, data.byteOffset+offset*data.BYTES_PER_ELEMENT, length);

        let arr: MachArray;
        if(!(data instanceof MachArray)){
            arr = new MachArray(
                this._wi.create_mxarray_ND(shape_input_header,0,0,order_opt));
            // Fill data with values
            arr.set(newData);
        }else{
            let arr_header =  new Uint32Array(this._wi.mem.buffer,
                    this._wi.create_mxarray_ND(shape_input_header,0,0,order_opt),7);
            arr_header[2] = newData.byteOffset;
            arr = new MachArray(arr_header.byteOffset);
        }
        // Free input vector
        this._wi.free_macharray(shape_input_header);
        return arr;
    }

    public ones(args?:number[],mclass=MClass.float64): MachArray{
        if(mclass !== MClass.float64)
            throw new ValueTypeError(mclass, MClass.float64);
        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray( this._wi.create_mxarray_ND(shape));
        arr.fill(1);
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


    public fill(value:number, args:number[]|undefined, mclass=MClass.float64): MachArray{
        if(mclass !== MClass.float64)
            throw new ValueTypeError(mclass, MClass.float64);
        let shape = this.helperShapeConstructors(args);
        let arr = new MachArray( this._wi.fill(shape, value));
        this._wi.free_macharray(shape);
        return arr;
    }
    public randi(max_int:number, shape?:number[],mclass=MClass.float64): MachArray{
        if(mclass !== MClass.float64)
            throw new ValueTypeError(mclass, MClass.float64);
        let shape_arr = this.helperShapeConstructors(shape); 
        let arr = new MachArray( this._wi.randi(max_int, shape_arr));
        this._wi.free_macharray(shape);
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
    // Binary operators.
    public add(arr1: MachArray|number, arr2: MachArray|number){
        if(typeof arr1 == "number" && typeof arr2 == "number"){
            return arr1 + arr2;
        }else if(typeof arr1 == "number" && arr2 instanceof MachArray){
            arr2 = <MachArray> arr2;
            return new MachArray( this._wi.plus_SM(arr1, arr2._headerOffset));
        }else if(typeof arr2 == "number" && arr1 instanceof MachArray){
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.plus_MS(arr1._headerOffset, arr2));
        }else {
            arr2 = <MachArray> arr2;
            arr1 = <MachArray> arr1;
            return new MachArray( this._wi.plus_MM(arr1._headerOffset, arr2._headerOffset));
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
    public all(arr1: MachArray|number, dim:number):MachArray|boolean{
        if(typeof arr1 === "number") return arr1 != 0;
        let res = new MachArray( this._wi.all(arr1._headerOffset,dim+1));
        if(res._numel === 1) return res[0] != 0;
        else return res;
    } 

    public any(arr1: MachArray|number, dim:number):MachArray|boolean{
        if(typeof arr1 === "number") return arr1 != 0;
        let res = new MachArray( this._wi.any(arr1._headerOffset,dim+1));
        if(res._numel === 1) return res[0] != 0;
        else return res;
    }
    public mean(arr1:MachArray|number, dim:number,naNFlag=false){
        if(typeof arr1 === "number") return arr1;
        else return new MachArray( this._wi.mean(arr1._headerOffset, dim, naNFlag));
    } 
    public floor(arr1: MachArray|number){
        if(typeof arr1 === "number") return Math.floor(arr1);
        else return new MachArray( this._wi.floor_M(arr1._headerOffset));
    }
    public ceil(arr1: MachArray|number){
        if(typeof arr1 === "number") return Math.ceil(arr1);
        else return new MachArray( this._wi.ceil_M(arr1._headerOffset));
    }
    public sin(arr1: MachArray|number){
        if(typeof arr1 === "number") return Math.sin(arr1);
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
        else return new MachArray( this._wi.abs_M(arr1));
    }
    public not(arr1: MachArray|number){
        if(typeof arr1 === "number") return this._wi.not_S(arr1);
        else return new MachArray( this._wi.not_M(arr1._headerOffset));
    }
    public fix(arr1: MachArray|number){
        if(typeof arr1 === "number") return this._wi.fix_S(arr1);
        else return new MachArray( this._wi.fix_M(arr1._headerOffset));
    }
    public sum(arr1:MachArray|number, dim:number=0, nanFlag=false){
        if(typeof arr1 === "number") return arr1; 
        return new MachArray( this._wi.sum(arr1._headerOffset,dim, nanFlag));

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
            let inp_vec = new MachArray( this._wi.create_mxvector(arrays.length,5));
            arrays.forEach((arr,i)=>{
                inp_vec[i] = arr._headerOffset;
            });
            let res =  new MachArray( this._wi.concat(dim, inp_vec._headerOffset));
            inp_vec.free();
            return res;
        }else{
            return new MachArray( this._wi.concat(dim));
        }
    }
     
    public horzcat(arrays: Array<MachArray>){
        if(arrays.length > 1){
            let inp_vec = new MachArray( this._wi.create_mxvector(arrays.length,5));
            arrays.forEach((arr,i)=>{
                inp_vec[i] = arr._headerOffset;
            });
            let res =  new MachArray( this._wi.horzcat(inp_vec._headerOffset));
            inp_vec.free();
            return res;
        }else{
            return new MachArray( this._wi.horzcat());
        }
    }

    public vertcat(arrays:MachArray[]){
        if(arrays.length > 1){
            let inp_vec = new MachArray( this._wi.create_mxvector(arrays.length,5));
            arrays.forEach((arr,i)=>{
                inp_vec[i] = arr._headerOffset;
            });
            return new MachArray( this._wi.vertcat(inp_vec._headerOffset));
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
    
}