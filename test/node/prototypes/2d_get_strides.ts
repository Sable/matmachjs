import { MachRuntime } from '../../../src/ts/classes/macharray/MachRuntime';
import { MachArray } from '../../../src/ts/classes/macharray/MachArray';
import {expect} from "chai";
/**
 * We do not handle the case where we are accessing a(:),
 * The order of evaluation for the bounds in Matlab is: step, high, low.
 * If high < low, 0x1.
 * else
 *  if step <= 0, 0x1
 *
 *
 * @param {MachArray} arr
 * @param {number[]} dim1_ptr
 * @param {number[]} dim2_ptr
 * @returns {MachArray}
 */
describe("",()=>{
    let mr: MachRuntime;
    function get_strides_2d(arr:MachArray, dim1_ptr:number[], dim2_ptr:number[]):MachArray{
        let low, high,step :number;
        let low2, high2,step2 :number;
        low = dim1_ptr[0];
        if(dim1_ptr.length == 2){
            step = 1;
            high = dim1_ptr[1];
        }else{
            step = dim1_ptr[1];
            high = dim1_ptr[2];
        }
        low2 = dim2_ptr[0];
        if(dim2_ptr.length == 2){
            step2 = 1;
            high2 = dim2_ptr[1];
        }else{
            step2 = dim2_ptr[1];
            high2 = dim2_ptr[2];
        }
        console.log(low,step,high, low2,step2,high2);

        if(step < 0 || high <0){
            return mr.empty([0,1]);
        }

        if(low < -1) throw new Error("Subscript indices must either be real positive integers\n" +
            "or logicals.");
        else if(high > arr._shape[0]-1) throw new Error("Index exceeds matrix dimensions.");

        if(step2 < 0 || high2 < 0){
            return mr.empty([0,1]);
        }else if(low2 < -1) throw new Error("Subscript indices must either be real positive integers\n" +
            "or logicals.");
        else if(high2 > arr._shape[1]-1) throw new Error("Index exceeds matrix dimensions.");

        // Calculate the new array
        console.log(high2-low2, step2,high2)
        console.log(Math.ceil(high-low/step),Math.ceil((high2-low2)/step2));
        let res = mr.empty([Math.floor((high-low)/step)+1,Math.floor((high2-low2)/step2)+1]);
        let i_res = 0,j_res = 0;
        for(let i = low; i <=high;i+=step){
            let offsetSoFar = i*arr._strides[0];
            let offsetResSoFar = i_res*res._strides[0];
            j_res = 0;
            for(let j = low2; j <=high2;j+=step2){
                let offset = offsetSoFar + j*arr._strides[1];
                let offsetRes = offsetResSoFar + j_res*res._strides[1];
                res._data[offsetRes] = arr._data[offset];
                j_res++;
            }
            i_res++;
        }
        return res;
    }
    function set_strides_2d(arr:MachArray,values:MachArray, dim1_ptr:number[], dim2_ptr:number[]):void{
        let low, high,step :number;
        let low2, high2,step2 :number;
        low = dim1_ptr[0];
        if(dim1_ptr.length == 2){
            step = 1;
            high = dim1_ptr[1];
        }else{
            step = dim1_ptr[1];
            high = dim1_ptr[2];
        }
        low2 = dim2_ptr[0];
        if(dim2_ptr.length == 2){
            step2 = 1;
            high2 = dim2_ptr[1];
        }else{
            step2 = dim2_ptr[1];
            high2 = dim2_ptr[2];
        }
        console.log(low,step,high, low2,step2,high2);

        if(step < 0 || high <0){
            throw new Error("Subscripted assignment dimension mismatch.");
        }

        if(low < -1) throw new Error("Subscript indices must either be real positive integers\n" +
            "or logicals.");
        else if(high > arr._shape[0]-1) throw new Error("Index exceeds matrix dimensions.");

        if(step2 < 0 || high2 < 0){
            throw new Error("Subscripted assignment dimension mismatch.");
        }else if(low2 < -1) throw new Error("Subscript indices must either be real positive integers\n" +
            "or logicals.");
        else if(high2 > arr._shape[1]-1) throw new Error("Index exceeds matrix dimensions.");


        // THIS
        if(values._numel == 1){
            let val_arr_dim1 = values._shape[0];
            let val_arr_dim2 = values._shape[2];
            if(values._ndims!==2 && (val_arr_dim1 !== Math.floor((high-low)/step)+1
                    || val_arr_dim2 !== Math.floor((high2-low2)/step2)+1))
                throw new Error("asdsa");
            // Calculate the new array
            // console.log(Math.ceil(high-low/step),Math.ceil((high2-low2)/step2));
            for(let i = low; i <=high;i+=step){
                let offsetSoFar = i*arr._strides[0];
                for(let j = low2; j <=high2;j+=step2){
                    arr._data[offsetSoFar + j*arr._strides[1]] = values._data[0];
                }
            }
        }else{
            let val_arr_dim1 = values._shape[0];
            let val_arr_dim2 = values._shape[2];
            if(values._ndims!==2 && (val_arr_dim1 !== Math.floor((high-low)/step)+1
                    || val_arr_dim2 !== Math.floor((high2-low2)/step2)+1))
                throw new Error("asdsa");
            // Calculate the new array
            console.log(high2-low2, step2,high2)
            console.log(Math.ceil(high-low/step),Math.ceil((high2-low2)/step2));
            // let res = mr.empty([Math.floor((high-low)/step)+1,Math.floor((high2-low2)/step2)+1]);
            let i_res = 0,j_res = 0;
            for(let i = low; i <=high;i+=step){
                let offsetSoFar = i*arr._strides[0];
                let offsetResSoFar = i_res*values._strides[0];
                j_res = 0;
                for(let j = low2; j <=high2;j+=step2){
                    let offset = offsetSoFar + j*arr._strides[1];
                    let offsetRes = offsetResSoFar + j_res*values._strides[1];
                    arr._data[offset] = values._data[offsetRes];
                    j_res++;
                }
                i_res++;
            }
        }

    }
    beforeEach(async ()=>{
        mr = await MachRuntime.initializeRuntime();
    });
    it('should memcpy correctly', () => {
        let test1 = mr.rand([2,2]);

        // console.log(test1);
        // console.log(set_strides_2d(test1,mr.array([[2,2],[2,2]]), [0,1],[0,1]));
        // console.log(set_strides_2d(test1,mr.array([[-2]]), [0,1],[0,1]));
        let test2 = test1.clone();
        mr._wi.memcpy(test1._data.byteOffset,test1._data.byteOffset,test1._data.byteLength);
        expect(Array.from(test2._data)).to.deep.equal(Array.from(test1._data));
    });
    it('should set correctly stride all', () => {
        let test1 = mr.rand([2,2]);
        test1.fill(4);
        let arr = mr.array([3,3,3,2]);
        mr._wi.set_stride_f64_all_MM(test1._headerOffset, arr._headerOffset);
    });
});

