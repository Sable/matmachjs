import {MxObject} from "./MxObject";
import {MxArray} from "./MxArray";
import {MxNDArray} from "./MxNdArray";

export class MxVector extends MxArray {

    constructor(wi:any, array:Array<number>|number|MxVector, simple_type:number=0, class_type:number=0,
                 complex:number=0, column:boolean=false, byte_size:number = 0)
    {
        super();
        this._wi = wi;
        if( typeof array != "undefined" ){
            if(typeof array == 'number'){
                this._arr_ptr = this._wi.create_mxvector(array,simple_type,class_type,complex,column,byte_size);
            }else if(array instanceof MxVector) {
                this._arr_ptr = this._wi.clone(array._arr_ptr);
            }else{
                // if ( array.length == 1 ) {
                //     this._arr_ptr = this._wi.create_mxvector(array.length, simple_type, class_type, complex, column, byte_size);
                // }
                this._arr_ptr = this._wi.create_mxvector(array.length,simple_type,class_type,complex,column,byte_size);
                array.forEach((val, idx)=>{
                    this._wi.set_array_index_f64(this._arr_ptr, idx+1, val);
                });
            }
        }
    }
    public get_indices(indices:Array<Array<number>>): MxVector
    {
        return new MxVector(this._wi, super.get_indices(indices));
    }
    public get(indices:Array<Array<number>>): MxVector {
        return new MxVector(this._wi, super.get(indices));
    }
    public clone(): MxObject {
        return new MxVector(this._wi, this);
    }
    public reshape(new_dimensions: number[]) {
        let dim_ptr = this._wi.create_mxvector(new_dimensions.length);
        new_dimensions.forEach((item, idx)=>{
            this._wi.set_array_index_f64(dim_ptr, idx+1, item);
        });
        return new MxNDArray(this._wi, this._wi.reshape(this._arr_ptr, dim_ptr));
    }
    public size(): MxNDArray {
        return new MxNDArray(this._wi, super.size());
    }
}

