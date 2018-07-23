import {IMXObject} from "../../interfaces/IMXObject";

export abstract class MxObject implements IMXObject {
        protected _wi: any;
        protected _arr_ptr: number;

        public get arr_ptr(): number {
            return this._arr_ptr;
        }
        public getContents(): Float64Array {
            if(this.numel() > 0)
                return new Float64Array(this._wi.mem.buffer,this._wi.get_array_start(this.arr_ptr), this.numel());
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
            return this._wi.length(this.arr_ptr);
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