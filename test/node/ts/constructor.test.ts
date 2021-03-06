

import { MachRuntime } from './../../../src/ts/classes/macharray/MachRuntime';
import { MachArray } from './../../../src/ts/classes/macharray/MachArray';
import { expect } from 'chai';
import 'mocha';
let mr: MachRuntime;
describe('MachRuntime', () => {
    beforeEach(async ()=>{
        mr = await MachRuntime.initializeRuntime();
    });
    describe('#creating_mxvector', () => {
        it('should create cell-array correctly', () => {
             let arr = mr._wi.create_mxvector(2,5);
             let arr2 = new MachArray(arr);
        });
    });

    describe("#index",()=>{
        it('should return 11 when passed index [1,2,1] & [2,3,3] with a Column major array', () => {
            let arr = mr.ones([2,3,3]);
            expect(arr.index(1,2,1)).to.equal(11);
        });
    });
    describe("#abs",()=>{
        it('should return abs correct result: [1,1,2] , when passing [1,-1,-2] ', () => {
            let arr1;
            let arr2;
        
            arr1 = mr.rand([2000,2000]);
            arr1[20] = 20;
            let start = process.hrtime();
            arr2 = mr.abs(arr1);
            let diff = process.hrtime(start);
            // mr._wi.free_macharray(arr1._headerOffset);
            arr2.free();
            let arr = mr.ndarray(new Float64Array([1,-1,-2]));
            expect(Array.from((<MachArray> mr.abs(arr))._data)).to.deep.equal([1,1,2]);
        });
    });
    describe('#fill', () => {
        it('Should return correct 2x2 array containing 5s', () => {
            let arr1 = mr.zeros([2,2]);
            arr1.fill(5);

            expect(Array.from(arr1._data)).to.deep.equal([5,5,5,5]);
        });
    });

    describe('#plus_MM', () => {
        it('should return true when two copies of arrays are made', () => {
            let arr = mr.ones([3,3]);
            let arr2 = mr.ones([3,3]);
            let arr3 = new MachArray(mr._wi.plus_MM(arr._headerOffset, arr2._headerOffset));
            expect(Array.from(arr3._data)).to.deep.equal([2,2,2,2,2,2,2,2,2]);            
        });
    });
    describe("#free",()=>{
        it('should free and allocate correctly', () => {
            let arr = (new MachArray(mr.ones([3,3])._headerOffset));
            let arr_offset = arr._headerOffset;
            arr.free();
            expect(arr_offset).to.equal(mr.ones([3,3])._headerOffset);
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
            let arr = mr.randn([2000, 2000]);
            let arr2 = mr.randn([2000, 2000]);
            let arr3: MachArray;
            let t = process.hrtime();
            arr3 = new MachArray(mr._wi.plus_MM(arr._headerOffset, arr2._headerOffset));
            const diff = process.hrtime(t);
            arr.free();
            arr2.free();
            arr3.free();
        });
    });

    describe('#ones', () => {
        it('should create array correctly',()=>{
           expect(mr.ones([10000,10000])).to.not.throw;
        });
        it('should return [1] MxArray when given no input', () => {
            let arr = mr.ones();
            expect(Array.from(arr._data)).to.deep.equal([1]);
            expect(Array.from(arr.size())).to.deep.equal([1,1]);
        });
        it('should return 2x2 array containing [1,1,1,1]', () => {
            let arr = mr.ones([2,2]);
            expect(Array.from(arr._data)).to.deep.equal([1,1,1,1]);
            expect(Array.from(arr.size())).to.deep.equal([2,2]);
        });
    });
    describe('#colon', () => {
        it('should return [1,3,5,7] when passed 1,7,2', () => {
            let arr = mr.colon(1,2,7);
            expect(Array.from(arr._data)).to.deep.equal([1,3,5,7]);
            expect(Array.from(arr.size())).to.deep.equal([1,4]); 
        });
        it('should return [-5,-4,-3] when passed -5,-3', () => {
            let arr = mr.colon(-5,-3);
            expect(Array.from(arr._data)).to.deep.equal([-5,-4,-3]);
            expect(Array.from(arr.size())).to.deep.equal([1,3]); 
        });  
    });


});