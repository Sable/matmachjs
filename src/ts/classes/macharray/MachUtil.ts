


export class MachUtil {

    static createFloat64ArrayFromPtr(wi:any, ptr: number){
        return new Float64Array(wi.mem.buffer, 
                wi.mxarray_core_get_array_ptr(ptr), 
                wi.numel(ptr));
    }
}