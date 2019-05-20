/**
 * Purpose test is to capture specializations in element-wise binary ops
 */



import { MachRuntime } from '../../../src/ts/classes/macharray/MachRuntime';
import { MachArray } from '../../../src/ts/classes/macharray/MachArray';
import * as fs from 'fs';
import { ENV_VARIABLES } from './env-variables'
import { expect } from 'chai';
import 'mocha';
let wi: WebAssembly.ResultObject;
let mr: MachRuntime;
describe('#add', () => {
    beforeEach(async ()=>{
        wi = await WebAssembly.instantiate(
                    fs.readFileSync(ENV_VARIABLES.WASM_LIB_WASM),
                        await import(ENV_VARIABLES.WASM_LIB_JS));
        mr = new MachRuntime(wi.instance.exports);
    });

    it('should return correct result if given two 2x2 matrices as MM', () => {
        let arr = mr.ones([2,2]);
        let arr2 = mr.ones([2,2]);
        expect(Array.from((<MachArray>mr.add(arr,arr2))._data)).to.deep.equal([2,2,2,2]);
    });
    it('should return correct result if given scalar and a matrix as MM', () => {
        let arr = mr.ones([1,1]);
        let arr2 = mr.ones([2,2]);
        expect(Array.from((<MachArray>mr.add(arr,arr2))._data)).to.deep.equal([2,2,2,2]);
    });
    it('should return correct result if given a matrix and scalar as MM', () => {
        let arr = mr.ones([2,2]);
        let arr2 = mr.ones([1,1]);
        expect(Array.from((<MachArray>mr.add(arr,arr2))._data)).to.deep.equal([2,2,2,2]);
    });
    it('should return correct result if broadcasting two arrays', () => {
        let arr = mr.ones([2,1,2]);
        let arr2 = mr.ones([2,2]);
        expect(Array.from((<MachArray>mr.add(arr,arr2))._data)).to.deep.equal([2,2,2,2,2,2,2,2]);
    });

    it('should return correct result if give a scalar and a matrix as SM', () => {
        let arr = 33;
        let arr2 = mr.ones([2,2]);
        expect(Array.from((<MachArray>mr.add(arr,arr2))._data)).to.deep.equal([34,34,34,34]);
    });
    it('should return correct result if give a scalar and a matrix as SS', () => {
        expect(mr.add(21,32)).to.equal(53);
    });
});