import {MatMachWasm} from "../../wasm_interface/MatMachWasm";


export class MachUtil {

    static createFloat64ArrayFromPtr(wi:MatMachWasm, ptr: number){
        return new Float64Array(wi.mem.buffer, 
                wi.mxarray_core_get_array_ptr(ptr), 
                wi.numel(ptr));
    }
    static free_input_memory(wi: MatMachWasm, arrs:number[]){
        arrs.forEach((arr)=>wi.free_macharray(arrs));
    }

    static isAligned(offset: number, alignment:number):boolean {
        return offset % alignment === 0;
    }
}