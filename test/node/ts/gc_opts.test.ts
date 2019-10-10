
import { expect } from 'chai';
import 'mocha';
import {MachArray} from "../../../src/ts/classes/macharray/MachArray";
import { MachRuntime } from "../../../src/ts/classes/macharray/MachRuntime";
let mr: MachRuntime;
describe('GCOperations', () => {
    describe('constructor GC attributes',()=>{
        beforeEach(async () => {
            mr = await MachRuntime.initializeRuntime();
        });
        it('should allocate correct number of bytes for macharray', () => {
            let arr = mr.array([]);
            expect(Array.from(arr.getGCInfo()))
                .to.deep.equal([0,0]);
            mr._wi.gcFreeSite(arr._headerOffset);
            arr = mr.array([]);
        });
    });
    describe('#checkExternalIincreaseite', () => {
        beforeEach(async () => {
            mr = await MachRuntime.initializeRuntime();
        });
        it('should do nothing when pass 0', () => {
            mr._wi.gcCheckExternalToIncreaseRCSite(0);
        });
        it('should check the correct counter is set', () => {
            let arr = mr.array([2,1,1]);
            mr._wi.gcCheckExternalToIncreaseRCSite(arr._headerOffset);
            expect(mr._wi.gcGetRC(arr._headerOffset)).to.equal(1);
        });
        it('should do nothing if site is external', () => {
            let arr = mr.array([2,1,1]);
            mr._wi.gcSetExternalFlag(1, arr._headerOffset);
            mr._wi.gcCheckExternalToIncreaseRCSite(arr._headerOffset);
            expect(mr._wi.gcGetRC(arr._headerOffset)).to.equal(0);
        });
    });
    describe('#checkExternalDecreaseRCSite', () => {
        beforeEach(async () => {
            mr = await MachRuntime.initializeRuntime();
        });
        it('should do nothing when pass 0', () => {
            mr._wi.gcCheckExternalToDecreaseRCSite(0);
        });
        it('should check the correct counter is set', () => {
            let arr = mr.array([2,1,1]);
            mr._wi.gcCheckExternalToIncreaseRCSite(arr._headerOffset);
            mr._wi.gcCheckExternalToIncreaseRCSite(arr._headerOffset);
            mr._wi.gcCheckExternalToIncreaseRCSite(arr._headerOffset);
            mr._wi.gcCheckExternalToIncreaseRCSite(arr._headerOffset);
            mr._wi.gcCheckExternalToIncreaseRCSite(arr._headerOffset);
            mr._wi.gcCheckExternalToDecreaseRCSite(arr._headerOffset);
            expect(mr._wi.gcGetRC(arr._headerOffset)).to.equal(4);
        });
        it('should do nothing if site is external', () => {
            let arr = mr.array([2,1,1]);
            mr._wi.gcSetExternalFlag(1, arr._headerOffset);
            expect(mr._wi.gcGetExternalFlag( arr._headerOffset)).to.equal(1);
            mr._wi.gcCheckExternalToDecreaseRCSite(arr._headerOffset);
            expect(mr._wi.gcGetRC(arr._headerOffset)).to.equal(0);
        });

    });
    describe('#gcCheckExternalAndReturnFlagToFreeSite', () => {
        beforeEach(async ()=>{
            mr = await MachRuntime.initializeRuntime();
        });
        it('it should do nothing is pass 0', () => {
            mr._wi.gcCheckExternalAndReturnFlagToFreeSite(0);
        });
        it('it should not free the site after external flag is 1', () => {
            let arr = mr.array([]);
            mr._wi.gcSetExternalFlag(1, arr._headerOffset);
            mr._wi.gcCheckExternalAndReturnFlagToFreeSite(arr._headerOffset);
        });
        it('it should not free if return flag is 1', () => {
            let arr = mr.array([]);
            expect(mr._wi.gcGetExternalFlag(arr._headerOffset))
                .to.equal(0);
            expect(mr._wi.gcGetReturnFlag(arr._headerOffset))
                .to.equal(0);   
            mr._wi.gcSetReturnFlagAndSetRCToZero(arr._headerOffset);
            expect(mr._wi.gcCheckExternalAndReturnFlagToFreeSite(arr._headerOffset))
                .to.equal(0);// not free
            
        });
        it('it should not free if external '+
            'flag is 1 but return flag is 0', () => {
            let arr = mr.array([]);
            mr._wi.gcSetExternalFlag(1, arr._headerOffset);
            expect(mr._wi.gcGetReturnFlag(arr._headerOffset))
                .to.equal(0);   
            mr._wi.gcSetReturnFlagAndSetRCToZero(arr._headerOffset);
            expect(mr._wi.gcCheckExternalAndReturnFlagToFreeSite(arr._headerOffset))
                .to.equal(0);// not free
        });
        

        it('it should free if external '+
            'flag is 0 and return flag is 0', () => {
                let arr = mr.array([]);
                let stacktop = mr._wi.get_stack_top();
                expect(mr._wi.gcGetExternalFlag(arr._headerOffset))
                    .to.equal(0);   
                expect(mr._wi.gcGetReturnFlag(arr._headerOffset))
                    .to.equal(0);   
                expect(mr._wi.gcGetRC(arr._headerOffset))
                .to.equal(0);
                expect(mr._wi.gcCheckExternalAndReturnFlagToFreeSite(stacktop,
                    arr._headerOffset))
                    .to.equal(1);// free 
        });
    });
    describe('#gcIncreaseRC', () => {
        beforeEach(async () => {
            mr = await MachRuntime.initializeRuntime();
        });
        it('should do nothing when pass 0', () => {
            mr._wi.gcIncreaseRCSite(0);
        });
        it('should check the correct counter is set', () => {
            let arr = mr.array([2,1,1]);
            mr._wi.gcIncreaseRCSite(arr._headerOffset);
            expect(mr._wi.gcGetRC(arr._headerOffset)).to.equal(1);
        });
    });
    describe('#gcDecreaseRC', () => {
        beforeEach(async () => {
            mr = await MachRuntime.initializeRuntime();
        });
        it('should do nothing if 0 is passed', () => {
            mr._wi.gcDecreaseRCSite();
        });
        it('should check the correct counter is set', () => {

            let arr = mr.array([2, 1, 1]);

            mr._wi.gcIncreaseRCSite(arr._headerOffset);
            mr._wi.gcIncreaseRCSite(arr._headerOffset);
            mr._wi.gcIncreaseRCSite(arr._headerOffset);
            mr._wi.gcIncreaseRCSite(arr._headerOffset);
            mr._wi.gcIncreaseRCSite(arr._headerOffset);
            mr._wi.gcDecreaseRCSite(arr._headerOffset);
            expect(mr._wi.gcGetRC(arr._headerOffset)).to.equal(4);
        });
    });
    describe('#gcInsertRC', () => {
        beforeEach(async () => {
            mr = await MachRuntime.initializeRuntime();
        });
        it('should inititate RC correctly', () => {
            let arr = mr.array([2,1,1]);
            mr._wi.gcInitiateRC(arr._headerOffset, 23);
            expect(mr._wi.gcGetRC(arr._headerOffset)).to.equal(23);
        });
        it('should do nothing is pass 0', () => {
            mr._wi.gcInitiateRC(0, 23);
        });
    });

    describe('#gcGetExternalFlag', () => {
        beforeEach(async () => {
            mr = await MachRuntime.initializeRuntime();
        });
        it('should do nothing when pass 0', () => {
            mr._wi.gcGetExternalFlag(0);
        });
        it('should check return the correct flag when is 0', () => {
            let arr = mr.array([2,1,1]);
            expect(mr._wi.gcGetExternalFlag(arr._headerOffset)).to.equal(0);
        });
        it('should check return the correct flag after a few operations', () => {
            let arr = mr.array([2,1,1]);
            mr._wi.gcCheckExternalToIncreaseRCSite(arr._headerOffset);
            mr._wi.gcCheckExternalToIncreaseRCSite(arr._headerOffset);
            mr._wi.gcCheckExternalToIncreaseRCSite(arr._headerOffset);
            mr._wi.gcCheckExternalToIncreaseRCSite(arr._headerOffset);
        expect(mr._wi.gcGetExternalFlag(arr._headerOffset)).to.equal(0);
        });
        it('should return the correct flag when flag is 1', () => {
            let arr = mr.array([2,1,1]);
            mr._wi.gcSetExternalFlag(1, arr._headerOffset);
            expect(mr._wi.gcGetExternalFlag(arr._headerOffset)).to.equal(1);

        });
    });
    describe('#gcSetExternalFlag', () => {
        beforeEach(async () => {
            mr = await MachRuntime.initializeRuntime();
        });
        it('should do nothing if pass 0', () => {
            let arr = mr.array([2,2,2]);
            mr._wi.gcSetExternalFlag(1, 0);
        });
        it('should set external flag correctly', () => {
            let arr = mr.array([2,2,2]);
            mr._wi.gcSetExternalFlag(1, arr._headerOffset);
            expect(mr._wi.gcGetExternalFlag(arr._headerOffset)).to.equal(1);
        });
    });
    describe('#gcCheckExternalToSetReturnFlagAndSetRCZero', () => {
        beforeEach(async () => {
            mr = await MachRuntime.initializeRuntime();
        });
        it('should do nothing when passing 0', () => {
            let func = ()=>{try{mr._wi.gcCheckExternalToSetReturnFlagAndSetRCZero(0);}
                catch(err){throw err;}};
            expect(func).to.not.throw();
        });
        it('should set return flag if external is zero', () => {
            let arr = mr.array([2,1,1]);
            mr._wi.gcInitiateRC(arr._headerOffset,30);
            mr._wi.gcCheckExternalToSetReturnFlagAndSetRCZero(arr._headerOffset);
            expect(mr._wi.gcGetReturnFlag(arr._headerOffset)).to.equal(1);
            expect(mr._wi.gcGetExternalFlag(arr._headerOffset)).to.equal(0);
            expect(mr._wi.gcGetRC(arr._headerOffset)).to.equal(0);
        });   

    });
    describe('#gcSetReturnFlagAndSetRCToZero', () => {
        beforeEach(async () => {
            let mr = await MachRuntime.initializeRuntime();
        });
        it('should do nothing if 0', () => {
            mr._wi.gcSetReturnFlagAndSetRCToZero(0); 
        });
        it('should set return flag to 1 and RC to 0', () => {
            let arr = mr.array([2,1,1]);
            mr._wi.gcSetExternalFlag(0,arr._headerOffset);
            expect(mr._wi.gcGetExternalFlag(arr._headerOffset))
                .to.equal(0);
            mr._wi.gcInitiateRC(arr._headerOffset, 30);
            expect(mr._wi.gcGetRC(arr._headerOffset))
                .to.equal(30);
            mr._wi.gcSetReturnFlagAndSetRCToZero(arr._headerOffset);
            expect(mr._wi.gcGetReturnFlag(arr._headerOffset))
                .to.equal(1);
            expect(mr._wi.gcGetRC(arr._headerOffset))
                .to.equal(0);
        });
    });
    describe('#gcCheckExternalToResetReturnFlag', () => {
        it('should do nothing if passed zero', () => {
            mr._wi.gcCheckExternalToResetReturnFlag(0);
        });
        it('should set return flag to 0 when external is 0', () => {
            let arr = mr.array([2,1,1]);
            mr._wi.gcSetExternalFlag(0,arr._headerOffset);
            mr._wi.gcSetReturnFlagAndSetRCToZero(arr._headerOffset); 
            expect(mr._wi.gcGetReturnFlag(arr._headerOffset)).to.equal(1);
            mr._wi.gcCheckExternalToResetReturnFlag(arr._headerOffset);
            expect(mr._wi.gcGetReturnFlag(arr._headerOffset)).to.equal(0);
        });
        it('should not set return flag to 0 when external is 1', () => {
            let arr = mr.array([2,1,1]);
            mr._wi.gcSetExternalFlag(1,arr._headerOffset);
            expect(mr._wi.gcGetReturnFlag(arr._headerOffset)).to.equal(0);
            mr._wi.gcCheckExternalToResetReturnFlag(arr._headerOffset);
            expect(mr._wi.gcGetReturnFlag(arr._headerOffset)).to.equal(0);
        });
        
    });
    let mr;
    describe('gcCheckReturnFlagToFreeSite', () => {
        beforeEach(async() => {
            mr = await MachRuntime.initializeRuntime();
        });
        it('should do nothing when pass 0,0', () => {
            mr._wi.gcCheckReturnFlagToFreeSite();
        });

        it('should not free when return flag is 1', () => {
            let arr = mr.array([]);
            let stack_top = mr._wi.get_stack_top();
            mr._wi.gcSetReturnFlagAndSetRCToZero(arr._headerOffset);
            expect(mr._wi.gcGetReturnFlag(arr._headerOffset))
            .to.equal(1);
            expect(mr._wi.gcCheckReturnFlagToFreeSite(stack_top, arr._headerOffset))
                .to.equal(0);
        });
        it('should free when return flag is 0', () => {
            let arr = mr.array([]);
            let stack_top = mr._wi.get_stack_top();
            mr._wi.gcSetReturnFlagAndSetRCToZero(arr._headerOffset);
            expect(mr._wi.gcGetReturnFlag(arr._headerOffset))
            .to.equal(1);
            mr._wi.gcResetReturnFlag(arr._headerOffset);
            expect(mr._wi.gcCheckReturnFlagToFreeSite(stack_top, arr._headerOffset))
                .to.equal(1);
        });
    });

    describe('#zeros', () => {
        beforeEach(async () => {
            mr = await MachRuntime.initializeRuntime();
        });
        it('should allocate a 2D array with appropriate GC', () => {
            let arr = mr.zeros([2,2]);
            expect(Array.from(arr.getGCInfo())).deep.equal([0,0]);
            expect(Array.from(new MachArray(mr._wi.zeros_2D(2,2)).getGCInfo()))
            .to.deep.equal([0,0]);
        });
    });
});