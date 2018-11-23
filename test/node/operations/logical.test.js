
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
let memory;
let mr;
describe('Logical ops', () => {
    beforeEach(async () => {
        wi = await WebAssembly.instantiate(file, libjs);
        wi = wi.instance.exports;
        mr = new MatlabRuntime(wi);
        memory = wi.mem;
    });
    describe('$all_nonzero_reduction', function () {
        it('should output 1 [1,1,1;1,1,1;1,1,1]', function () {
            let arr1 = mr.ones(3);
            expect(wi.all_nonzero_reduction(arr1.arr_ptr)).to.equal(1);
        });
        it('should output 0 when input is [1,1,1;1,1,1;1,1,0]', function () {
            let arr1 = mr.ones(3);
            arr1.set_index(9,0);
            expect(wi.all_nonzero_reduction(arr1.arr_ptr)).to.equal(0);
        });
    });

});