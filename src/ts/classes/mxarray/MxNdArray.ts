import { MxArray } from "./MxArray";
import {MxVector} from "./MxVector";
import { MatWablyBuiltin } from "../../interfaces/MatlabWasmBuiltins";
declare const wi: MatWablyBuiltin;
export class MxNDArray extends MxArray {

    public constructor(mxarray: MxNDArray| number[] | MxVector| number, class_type:number=0,simple_type:number=0,
                       complex:boolean=false, column:number=0, byte_size:number = 8) {
        super();
        this._wi = wi;
        if(typeof wi === "undefined"){
            throw Error("Error: WebAssembly Matlab module must be defined");
        }
        if(typeof mxarray == 'number'){
            this._arr_ptr = mxarray;
        }else if(mxarray instanceof MxNDArray) {
            this._arr_ptr = this._wi.clone(mxarray._arr_ptr);
        }else if(mxarray instanceof MxVector){
            this._arr_ptr = this._wi.create_mxarray_ND(mxarray.arr_ptr,class_type,simple_type, complex,byte_size);
        }else{
            let input_ptr = this._wi.create_mxvector(mxarray.length,simple_type,class_type,complex,column,byte_size);
            mxarray.forEach((val, idx)=>{
                this._wi.set_array_index_f64(input_ptr, idx+1, val);
            });
            this._arr_ptr = this._wi.create_mxarray_ND(input_ptr, class_type,simple_type, (complex)?0:1,byte_size);
        }
    }
    public reshape(new_dimensions: number[]) {
        let dim_ptr = this._wi.create_mxvector(new_dimensions.length);
        new_dimensions.forEach((item, idx)=>{
            this._wi.set_array_index_f64(dim_ptr, idx+1, item);
        });
        return new MxNDArray(this._wi, this._wi.reshape(this._arr_ptr, dim_ptr));
    }
    public set_indices(indices:Array<Array<number>>,values:Array<number>| MxNDArray)
    {
        let indices_arr_ptr = this._wi.create_mxvector(indices.length, 5);// Create mxvector with int type
        indices.forEach((dimArr,indDim)=>{
            let index_arr_ptr = this._wi.create_mxvector(dimArr.length);
            this._wi.set_array_index_i32(indices_arr_ptr,indDim+1, index_arr_ptr);
            dimArr.forEach((val, indVal)=>{
                this._wi.set_array_index_f64(index_arr_ptr, indVal+1, val);
            });
        });
        let indices_val_arr_ptr;
        if( values instanceof MxNDArray) {
            indices_val_arr_ptr = values.arr_ptr;
        }else{
            indices_val_arr_ptr = this._wi.create_mxvector(values.length);
            values.forEach((val, ind)=>{
                this._wi.set_array_index_f64(indices_val_arr_ptr,ind+1,val );
            });
        }
        this._wi.set_f64(this._arr_ptr, indices_arr_ptr, indices_val_arr_ptr);
    }
    public size(): MxNDArray {
        return new MxNDArray(this._wi, super.size());
    }

    public get_indices(indices:Array<Array<number>>): MxNDArray
    {
        return new MxNDArray(this._wi, super.get_indices(indices));
    }
    public get(indices:Array<Array<number>>| number): MxNDArray {
        if( typeof indices == 'number'){
           return  super.get(indices);
        }
        return new MxNDArray(this._wi, super.get(indices));
    }

    clone(): MxNDArray {
        return new MxNDArray(this._wi, this);
    }
}