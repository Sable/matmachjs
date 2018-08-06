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
    public wi:MatWablyBuiltin;
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
            return new MxNDArray(this.wi.transpose_M(arr.arr_ptr));
        }
    }
    public lit(arr: Array<number> | Array<Array<number>>):MxArray{
        if(typeof arr === 'undefined') throw new Error("Must pass a value array to construct literal");
        if(arr.length == 0) {
            // create an empty array
            return new MxNDArray(this.wi.create_mxarray_empty(2,0,0,0));
        }else if(arr.length> 0 && typeof arr[0] === 'number'){
            let val = [];
            let arr_ = (arr as Array<number>);
            let dimArr = new MxVector(this.wi,arr_);
            // create an mxvector
            return dimArr;
        }else {
            let arr_ = (arr as Array<Array<number>>);
            let rows = arr_.length;
            let cols = arr_[0].length;
            let dimArr = new MxVector([rows,cols]);
            let resArr = new MxNDArray( dimArr);
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
        return new MxNDArray( this.wi.concat(dim, input_vec));
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
        return new MxNDArray(this.wi.colon(input_vec));
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
        return arr.length();
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