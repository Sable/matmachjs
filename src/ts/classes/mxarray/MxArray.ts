
import {MxObject} from "./MxObject";
import {MxNDArray} from "./MxNdArray";

export abstract class MxArray extends MxObject {

        public set_index(ind=-1, val:number=NaN):number {
            return this._wi.set_array_index_f64(this._arr_ptr, ind, val);
        }
        public get_index(ind=-1):number {
            return this._wi.get_array_index_f64(this._arr_ptr, ind);
        }
        public get_indices(indices:Array<Array<number>>)
        {
            let indices_arr_ptr = this._wi.create_mxvector(indices.length, 5);// Create mxvector with int type
            indices.forEach((dimArr,indDim)=>{
                let index_arr_ptr = this._wi.create_mxvector(dimArr.length);
                dimArr.forEach((val, indVal)=>{
                    this._wi.set_array_index_f64(index_arr_ptr, indVal+1, val);
                });
                this._wi.set_array_index_i32(indices_arr_ptr, indDim+1, index_arr_ptr);
            });
            return this._wi.get_f64(this._arr_ptr,indices_arr_ptr);
        }
        public get(indices:Array<Array<number>>|number ) {
            if( typeof indices === 'number'){
                return this._wi.get_array_index_f64(this._arr_ptr, indices);
            }else if(indices.length === 1 && indices[0].length == 1){
                return this._wi.get_array_index_f64(this._arr_ptr, indices[0][0]);
            }else{
                return this.get_indices(indices);
            }
        }

        public abstract reshape(dimensions: number[]);
        public set(indices:Array<Array<number>>,values:Array<number>){
            if(indices.length == 0 && values.length == 0){
                return this._wi.clone(this._arr_ptr);
            }else if(indices.length === 1 && indices[0].length == 1&& values.length == 1){
                this._wi.set_array_index_f64(this._arr_ptr, indices[0][0], values[0]);

            }else{
                this.set_indices(indices,values);
            }
        }

        public set_indices(indices:Array<Array<number>>,values:Array<number>)
        {
            let indices_arr_ptr = this._wi.create_mxvector(indices.length, 5);// Create mxvector with int type
            indices.forEach((dimArr,indDim)=>{
                let index_arr_ptr = this._wi.create_mxvector(dimArr.length);
                this._wi.set_array_index_i32(indices_arr_ptr,indDim+1, index_arr_ptr);
                dimArr.forEach((val, indVal)=>{
                    this._wi.set_array_index_f64(index_arr_ptr, indVal+1, val);
                });
            });
            let indices_val_arr_ptr = this._wi.create_mxvector(values.length);
            values.forEach((val, ind)=>{
                this._wi.set_array_index_f64(indices_val_arr_ptr,ind+1,val );
            });
            this._wi.set_f64(this._arr_ptr, indices_arr_ptr, indices_val_arr_ptr);
        }

}