import {MXObject} from "../../interfaces/MXObject";

export abstract class MxArray implements  MXObject{
    protected wi: any;
    protected arr_ptr: number;
    public getContents(): Float64Array {
        return new Float64Array(this.wi.mem,this.arr_ptr, this.numel());
    }
    public set_index(ind:number, val:number):number {
        return this.wi.set_array_index_f64(this.arr_ptr, ind, val);
    }
    public get_index(ind:number):number {
        return this.wi.get_array_index_f64(this.arr_ptr, ind);
    }
    public numel():number
    {
        return this.wi.numel(this.arr_ptr);
    }
    public ndims():number
    {
        return this.wi.ndims(this.arr_ptr);
    }
    public length():number
    {
        return this.wi.length(this.arr_ptr);
    }
    public isrow():boolean
    {
        return this.wi.isrow(this.arr_ptr)===1;
    }
    public iscolumn():boolean
    {
        return this.wi.isvector(this.arr_ptr)===1;
    }
    public ismatrix():boolean
    {
        return this.wi.ismatrix(this.arr_ptr)===1;
    }
    public isvector():boolean
    {
        return this.wi.isvector(this.arr_ptr)===1;
    }
    public isempty():boolean
    {
        return this.wi.isempty(this.arr_ptr)===1;
    }

}