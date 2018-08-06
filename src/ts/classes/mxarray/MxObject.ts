import {IMXObject} from "../../interfaces/IMXObject";
import { MatWably } from "../../interfaces/MatlabWasmBuiltins";

export abstract class MxObject implements IMXObject {
        protected _wi: any;
        protected _arr_ptr: number;

        public get arr_ptr(): number {
            return this._arr_ptr;
        }
        public getContents(start=0, length=this.numel()): Float64Array {
            if(length < 0 || start < 0) throw new Error("View indices must be positive");
            if(length > this.numel() - start ) throw new Error("Invalid length, index out-of-bounds");
            if(this.numel() > 0)
                return new Float64Array(this._wi.mem.buffer,this._wi.mxarray_core_get_array_ptr(this.arr_ptr)+start, length);
            else{
                return new Float64Array(0);
            }
        }

        public size(): any{
            return this._wi.size(this.arr_ptr);
        }
        public numel(): number {
            return this._wi.numel(this.arr_ptr);
        }

        public ndims(): number {
            return this._wi.ndims(this.arr_ptr);
        }

        public length(): number {
            return this._wi.length_M(this.arr_ptr);
        }

        public isrow(): boolean {
            return this._wi.isrow(this.arr_ptr) === 1;
        }

        public iscolumn(): boolean {
            return this._wi.isvector(this.arr_ptr) === 1;
        }

        public ismatrix(): boolean {
            return this._wi.ismatrix(this.arr_ptr) === 1;
        }

        public isvector(): boolean {
            return this._wi.isvector(this.arr_ptr) === 1;
        }

        public isempty(): boolean {
            return this._wi.isempty(this.arr_ptr) === 1;
        }


        public abstract clone(): any;

    }