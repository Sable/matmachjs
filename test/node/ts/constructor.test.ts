

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

    describe('#ones', () => {
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