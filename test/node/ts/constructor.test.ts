

import { MachRuntime } from '../../../src/ts/classes/macharray/MachRuntime';
import * as fs from 'fs';
import { ENV_VARIABLES } from './env-variables'
import { expect } from 'chai';
import 'mocha';
let wi: WebAssembly.ResultObject;
let mr: MachRuntime;
describe('MachRuntime', () => {
    beforeEach(async ()=>{
    wi = await WebAssembly.instantiate(
                fs.readFileSync(ENV_VARIABLES.WASM_LIB_WASM),
                    await import(ENV_VARIABLES.WASM_LIB_JS));
    mr = new MachRuntime(wi.instance.exports);
    });
    describe("#index",()=>{
        it('should return 11 when passed index [1,2,1] & [2,3,3] with a Column major array', () => {
            let arr = mr.ones([2,3,3]);
            expect(arr.index(1,2,1)).to.equal(11);
        });
    });
    describe("#get",()=>{
        it('should return 11 when passed index [1,2,1] & [2,3,3] with a Column major array', () => {
            let arr = mr.ones([2,3,3]);
            expect(arr.get_index(1,2,1)).to.equal(1);
        });
        it('should return 11 when passed index [1,2,1] & [2,3,3] with a Column major array', () => {
            let arr = mr.rand([2,3,3]);
            expect(arr.get_index(1,2,1)).to.be.at.most(1);
        });
    });
    const NS_PER_SEC = 1e-9;
    describe("#plus", ()=>{
        it('test time ', function () {
            console.log(mr);
            let t = process.hrtime();
            let arr = mr.randn([1000,1000]);
            const diff = process.hrtime(t);
            console.log(`Benchmark took ${diff[0] + diff[1]*NS_PER_SEC} seconds`);
            arr.free();
        });
    });

    describe('#ones', () => {
        it('should create array correctly',()=>{
           expect(mr.ones([10000,10000])).to.not.throw;
        });
        it('should return [1] MxArray when given no input', () => {
            let arr = mr.ones();
            expect(Array.from(arr)).to.deep.equal([1]);
            expect(Array.from(arr.size())).to.deep.equal([1,1]);
        });
        it('should return 2x2 array containing [1,1,1,1]', () => {
            let arr = mr.ones([2,2]);
            expect(Array.from(arr)).to.deep.equal([1,1,1,1]);
            expect(Array.from(arr.size())).to.deep.equal([2,2]);
        });
    });
    describe('Code for Thesis', () => {
        it('should ',  () =>{
            let arr = mr.array([[2,3,4],[2,1,3]]);
            arr = mr.array([2,2,3,1,4,3],[2,3]);
            // >> _numel: 6,
            // >> _ndim: 2.
            // >> _byteOffset: 5246792
            // >> _shape: [2,3]
            // >> _strides: [3,1] // Column-major by default
            let arr2 = mr.ndarray(new Float64Array([1,2,3,4,5,6]), [2,3],0,"R");
            console.log(arr2);
            // >> _numel: 6,
            // >> _ndim: 2.
            // >> _byteOffset: 5246952
            // >> _shape: [2,3]
            // >> _strides: [1,2] // Row-major specified parameter

            let arr3 = arr.reshape([3,2]);
            // >> _numel: 6,
            // >> _ndim: 2.
            // >> _byteOffset: 5246792
            // >> _shape: [3,2]
            // >> _strides: [2,1] // Column-major by default
            arr3[0]= 3;
            console.log(arr[0] == arr3[0]);
            // >> true
            let arr4 = mr.ndarray(arr2, [1,3],3);
            arr4[0] =  99;
            console.log(arr4[0] === arr2[3]);
            // >> true
        });
    });
    describe('#colon', () => {
        it('should return [1,3,5,7] when passed 1,7,2', () => {
            let arr = mr.colon(1,2,7);
            expect(Array.from(arr)).to.deep.equal([1,3,5,7]);
            expect(Array.from(arr.size())).to.deep.equal([1,4]); 
        });
        it('should return [-5,-4,-3] when passed -5,-3', () => {
            let arr = mr.colon(-5,-3);
            expect(Array.from(arr)).to.deep.equal([-5,-4,-3]);
            expect(Array.from(arr.size())).to.deep.equal([1,3]); 
        });  
    });

});