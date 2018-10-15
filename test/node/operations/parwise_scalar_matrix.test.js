
/**
 * This script will test the following functions:
 * get/set for individual elements, get/set for
 *
 */
const chai = require("chai");
const expect = require("chai").expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const fs = require("fs");
const path = require("path");
chai.use(sinonChai);


///////////////////////////////////////////////////////////////
const libjs = require(path.join(__dirname,"../../../")+"/bin/lib.js");


const file = fs.readFileSync(path.join(__dirname,"../../../")+"/bin/get_mem.wasm");
const { MxVector } = require(path.join(__dirname,"../../../")+"bin/classes/mxarray/MxVector.js");
const { MxNDArray } = require(path.join(__dirname,"../../../")+ "bin/classes/mxarray/MxNdArray.js");
const { MatlabRuntime } = require(path.join(__dirname,"../../../")+ "bin/classes/Runtime.js");

let wi;
let mr;
let memory;

describe('Pairwise Matrix-Scalar operations', () => {
    beforeEach(async () => {
        wi = await WebAssembly.instantiate(file, libjs);
        wi = wi.instance.exports;
        mr = new MatlabRuntime(wi);
        memory = wi.mem;
    });
    describe('#gt_MS', function () {
        it('should return [1,1] when [1,1] > 0 ', function () {
            let arr1 = mr.lit([1,1]);
            let arr_res = new MxNDArray(wi, wi.gt_MS(arr1.arr_ptr, 0));
            expect(Array.from(arr_res.getContents())).to.deep.equal([1,1]);
        });
        it('should return [0,0] when [1,1] > 2 ', function () {
            let arr1 = mr.lit([1,1]);
            let arr_res = new MxNDArray(wi, wi.gt_MS(arr1.arr_ptr, 2));
            expect(Array.from(arr_res.getContents())).to.deep.equal([0,0]);
        });
        it('should return [] when passing [] and anynumber',()=>{
            let arr1 = mr.lit([]);
            let arr_res = new MxNDArray(wi, wi.gt_MS(arr1.arr_ptr, 2));
            expect(Array.from(arr_res.getContents())).to.deep.equal([]);
            expect(Array.from(arr_res.size().getContents())).to.deep.equal([0,0]);
        });

    });
});