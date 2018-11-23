const chai = require("chai");
const expect = require("chai").expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const fs = require("fs");
const path = require("path");
chai.use(sinonChai);


///////////////////////////////////////////////////////////////



const libjs = require(path.join(__dirname,"../../../")+"/bin/matmachjs-lib.js");
const file = fs.readFileSync(path.join(__dirname,"../../../")+"/bin/matmachjs.wasm");
const { MxVector, MxNDArray, MatlabRuntime} = require(path.join(__dirname,"../../../bin/classes/Runtime.js"));

let wi;
let mr;

describe('#tranpose', () => {
	// Verifies input
	beforeEach(async () => {
		wi = await WebAssembly.instantiate(file, libjs);
		wi = wi.instance.exports;
		memory = wi.mem;
		mr = new MatlabRuntime(wi);
	});
	it('should throw error when input has more than 2 dimensions', () => {
		let arr = new MxNDArray(wi, [2,3,4]);
		try{
			mr.transpose(arr);
		}catch(err){
			expect(err.message).to.equal("N-dimensional arrays are not supported.");
		}
	});
	it('should throw error when input is empty', () => {
		try{
			wi.transpose_M();
		}catch(err){
			expect(err.message).to.equal("Not enough input arguments.");
		}
	});
	it('should correctly return a [1,2] when passing a [2,1]', () => {
		let arr = mr.lit([1,2]);
		let arr_t = mr.transpose(arr);
		expect(Array.from(arr.getContents())).to.deep.equal([1,2]);
		expect(Array.from(arr_t.size().getContents())).to.deep.equal([2,1]);
		expect(Array.from(arr_t.getContents())).to.deep.equal([1,2]);
	});
	it('should correctly return a [2,2] when passing a [2,2] with correct contents', () => {
		let arr = mr.lit([[1,2],[3,4]]);
		let arr_t = mr.transpose(arr);
		expect(Array.from(arr.getContents())).to.deep.equal([1,3,2,4]);
		expect(Array.from(arr_t.size().getContents())).to.deep.equal([2,2]);
		expect(Array.from(arr_t.getContents())).to.deep.equal([1,2,3,4]);

	});
});