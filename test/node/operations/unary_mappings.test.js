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

describe('Elementwise unary operations', () => {
	beforeEach(async () => {
		libjs.js.mem = WebAssembly.Memory({initial: 1});
		wi = await WebAssembly.instantiate(file, libjs);
		wi = wi.instance.exports;
		memory = wi.mem;
	});
	describe("#round_M", ()=>{
		it('should correctly round a [2,2] matrix', () => {
			let arr = new MxNDArray(wi, [2,2]);
			arr.set_indices([[1,2,3,4]],[2.3,2.2,2.6,2.7]);
			let res =  new MxNDArray(wi, wi.round_M(arr._arr_ptr));
			expect(Array.from(res.getContents())).to.deep.equal([2,2,3,3]);
		});
		it('should correctly return an empty matrix', () => {
			let arr = new MxNDArray(wi, [2,0,2]);
			let res =  new MxNDArray(wi, wi.round_M(arr._arr_ptr));
			expect(Array.from(res.size().getContents())).to.deep.equal([2,0,2]);
		});
	});


});