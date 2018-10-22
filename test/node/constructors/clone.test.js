
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

let wi;
let memory;
describe('#clone', () => {
	beforeEach(async () => {
		libjs.js.mem = new WebAssembly.Memory({initial: 1});
		wi = await WebAssembly.instantiate(file, libjs);
		wi = wi.instance.exports;
		memory = wi.mem;
	});
		describe('Arguments', function () {
			it('should throw error if array is null', ()=> {
				let dim_1 = wi.create_mxvector(1);
				let param_arr = wi.create_mxvector(1, 5);
				wi.set_array_index_i32(param_arr, 1, dim_1);
				try{
					wi.clone(0);
				}catch(err)
				{
					expect(err.message).to.equal("Not enough input arguments.");
				}
			});
		});
		describe('Correctness', () => {
			it("should correctly set clone for an mxarray", () => {
				let arr = new MxNDArray( wi, [5,1]);
				arr.set([[1,2,3,4,5]],[6,7,8,9,10]);
				let arr2 = arr.clone();
				expect(arr.numel()).to.equal(arr2.numel());
				expect(arr.ndims()).to.equal(arr2.ndims());
				expect(Array.from(arr.getContents())).to.deep.equal(Array.from(arr2.getContents()));
			});
			it("should correctly set clone for an mxvector", () => {
				let arr = new MxVector( wi, 5);
				arr.set_indices([[1,2,3,4,5]],[6,7,8,9,10]);
				let arr2 = arr.clone();
				expect(arr.numel()).to.equal(arr2.numel());
				expect(arr.ndims()).to.equal(arr2.ndims());
				expect(Array.from(arr.getContents())).to.deep.equal(Array.from(arr2.getContents()));
			});
		});
});


