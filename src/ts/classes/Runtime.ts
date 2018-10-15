///<reference path="mxarray/MxNdArray.ts"/>
import {MxArray} from "./mxarray/MxArray";
import {MxVector} from "./mxarray/MxVector";
import {MxNDArray} from "./mxarray/MxNdArray";
import {MxObject} from "./mxarray/MxObject";
import { MatWablyBuiltin } from "../interfaces/MatlabWasmBuiltins";
export {
    MxNDArray,
    MxVector,
    MatlabRuntime
};
class MatlabRuntime {
    private started = false;
    public wi:any;
    public startRuntime(wis:any){
        this.wi = wis;
        this.started = true;
    }
    constructor(wis:any){
        this.wi = wis;
        this.started = true;
    }
    private checkForStartedRuntime() {
        if(!this.started){
            throw new Error("Please initialize Matlab Runtime");
        }
    }

    public transpose(arr: MxArray| number){
        if(typeof arr === 'number'){
            return arr;
        }else{
            return new MxNDArray(this.wi, this.wi.transpose_M(arr.arr_ptr));
        }
    }
    public lit(arr: Array<number> | Array<Array<number>>):MxArray{
        if(typeof arr === 'undefined'||arr === null) this.wi.create_mxarray_empty(0,0,0,0);
        if(arr.length == 0) {
            // create an empty array
            return new MxNDArray(this.wi, this.wi.create_mxarray_empty(2,0,0,0));
        }else if(arr.length> 0 && typeof arr[0] === 'number'){
            let arr_ = (arr as Array<number>);
            let vals = this.wi.create_mxvector(arr.length);
            arr_.forEach((val, idx)=>{
                this.wi.set_array_index_f64(vals, idx+1, val);
            });
            return new MxNDArray(this.wi,vals);
        }else {
            let arr_ = (arr as Array<Array<number>>);
            let rows = arr_.length;
            let cols = arr_[0].length;
            let dimArr = new MxVector(this.wi, [rows,cols]);
            let resArr = new MxNDArray(this.wi, dimArr);
            // create ndarray
            arr_.forEach((dimArr, idxRow)=>{
                if(!(dimArr instanceof Array) || dimArr.length !== cols){
                    throw new Error("Dimensions of matrices being concatenated are not consistent.");
                }
                dimArr.forEach((elem,idxCol)=>{
                    resArr.set_index((idxRow+rows*idxCol)+1, elem);
                });
            });
            return resArr;

        }
    }
    public ones(...arg: (number | number[])[]){
        if(arg.length == 0)return 1;
        else{
            if(typeof arg[0] == 'number'){
                let input = <number[]> arg;
                let vec = new MxVector(this.wi, input);
                return new MxNDArray(this.wi, this.wi.ones(vec.arr_ptr));
            }else{
                let input = <number[][]> arg;
                if(input.length>1){
                    throw new Error("Only arrays of array of one dimension accepted in this context");
                }
                let vec = new MxVector(this.wi, input[0]);
                return new MxNDArray(this.wi, this.wi.ones(vec.arr_ptr));
            }
        }
    }
    public randn(...arg: (number | number[])[]){
        if(arg.length == 0)return 1;
        else{
            if(typeof arg[0] == 'number'){
                let input = <number[]> arg;
                let vec = new MxVector(this.wi, input);
                return new MxNDArray(this.wi, this.wi.randn(vec.arr_ptr));
            }else{
                let input = <number[][]> arg;
                if(input.length>1){
                    throw new Error("Only arrays of array of one dimension accepted in this context");
                }
                let vec = new MxVector(this.wi, input[0]);
                return new MxNDArray(this.wi, this.wi.randn(vec.arr_ptr));
            }
        }
    }
    public isRuntimeStarted():boolean {
        return this.started;
    }
    public horzcat(args:Array<MxArray>){
        return this.concat(2, args);
    }
    public vertcat(args:Array<MxArray>){
        return this.concat(1, args);
    }
    public concat(dim:number, args: Array<MxArray>){
        this.checkForStartedRuntime();
        let input_vec = this.wi.create_mxvector(args.length, 5,0,0,0,0);
        args.forEach((arr, idx)=>{
            this.wi.set_array_index_i32(input_vec, idx+1, arr.arr_ptr);
        });
        return new MxNDArray( this.wi, this.wi.concat(dim, input_vec));
    }
    public reshape(arr:MxArray, dims:Array<number>){
        return arr.reshape(dims);
    }
    public colon(start:number, stepEnd:number,end?:number){
        this.checkForStartedRuntime();

        let input_vec;
        if(typeof end =="undefined"){
            let dim_1 = this.wi.create_mxvector(1,0,0,0,0,0);
            let dim_2 = this.wi.create_mxvector(1,0,0,0,0,0);
            input_vec = this.wi.create_mxvector(2,5,0,0,0,0);
            this.wi.set_array_index_f64(dim_1, 1, start);
            this.wi.set_array_index_f64(dim_2, 1, stepEnd);
            this.wi.set_array_index_i32(input_vec, 1, dim_1);
            this.wi.set_array_index_i32(input_vec, 2, dim_2);
        }else{
            let dim_1 = this.wi.create_mxvector(1,0,0,0,0,0);
            let dim_2 = this.wi.create_mxvector(1,0,0,0,0,0);
            let dim_3 = this.wi.create_mxvector(1,0,0,0,0,0);
            input_vec = this.wi.create_mxvector(3,5,0,0,0,0);
            let param_arr = this.wi.create_mxvector(3,5,0,0,0,0);
            this.wi.set_array_index_f64(dim_1, 1, start);
            this.wi.set_array_index_f64(dim_2, 1, stepEnd);
            this.wi.set_array_index_f64(dim_3, 1, end);
            this.wi.set_array_index_i32(input_vec, 1, dim_1);
            this.wi.set_array_index_i32(input_vec, 2, dim_2);
            this.wi.set_array_index_i32(input_vec, 3, dim_3);
        }
        return new MxNDArray(this.wi, this.wi.colon(input_vec));
    }
    public size(arr: MxObject){
        this.checkForStartedRuntime();
        return arr.size()
    }
    public numel(arr:MxObject) {
        this.checkForStartedRuntime();
        return arr.numel();
    }
    public length(arr:MxObject) {
        this.checkForStartedRuntime();
        return arr.length_M();
    }
    public isrow(arr: MxObject){
        this.checkForStartedRuntime();
        return arr.isrow();
    }
    public iscolumn(arr: MxObject){
        this.checkForStartedRuntime();
        return arr.iscolumn();
    }
    public ismatrix(arr: MxObject){
        this.checkForStartedRuntime();
        return arr.ismatrix();
    }
    public isvector(arr: MxObject){
        this.checkForStartedRuntime();
        return arr.isvector();
    }
    public isempty(arr: MxObject){
        this.checkForStartedRuntime();
        return arr.isempty();
    }
    public clone(arr: MxObject): MxObject {
        this.checkForStartedRuntime();
        return arr.clone();
    }

}