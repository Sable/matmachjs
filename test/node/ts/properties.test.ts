import { MachRuntime } from '../../../src/ts/classes/macharray/MachRuntime';
import { MachArray } from '../../../src/ts/classes/macharray/MachArray';
import * as fs from 'fs';
import { ENV_VARIABLES } from './env-variables'
import { expect } from 'chai';
import 'mocha';
let wi: WebAssembly.ResultObject;
let mr: MachRuntime;
/**
 * MatWably
 */
describe("$size_M", () => {
    let mr:MachRuntime;
    beforeEach(async () => {
        mr =await MachRuntime.initializeRuntime();

    });
    it('should generate [2,2,1] for matrix [2,2;2,2] with output size 3', () => {
        let arr = mr.array([[2,2],[2,2]]);
        expect(Array.from((new MachArray(mr._wi.size_M(arr._headerOffset, 3))._data))).to.deep.equal([2,2,1]);

    });
    it('should generate [2,2] for matrix [2,2;2,2] with output size 2', () => {
        let arr = mr.array([[2,2],[2,2]]);

        expect(Array.from((new MachArray(mr._wi.size_M(arr._headerOffset, 2))._data))).to.deep.equal([2,2]);

    });
    it('should generate [2,2,6] for matrix rand([2,2,2,3]) with output size 3', () => {
        let arr = mr.rand([2,2,2,3]);
        expect(Array.from((new MachArray(mr._wi.size_M(arr._headerOffset, 3))._data))).to.deep.equal([2,2,6]);
    });

    it('should generate [2,10,2], based on input shape [2,10,2] with output size 1',()=>{
       let arr = mr.rand([2,10,2]);
       expect(Array.from((new MachArray(mr._wi.size_M(arr._headerOffset, 1))._data))).to.deep.equal([2,10,2]);

    });
});