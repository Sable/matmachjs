
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
describe('#mtimes', () => {
	beforeEach(async () => {
		wi = await WebAssembly.instantiate(file, libjs);
		wi = wi.instance.exports;
		memory = wi.mem;
		mr = new MatlabRuntime(wi);
	});

	it('should throw error if not enough arguments passed', () => {
		try{
			wi.mtimes_MM();
			expect(2).to.equal(3);
		}catch(err){
			expect(err.message).to.equal("Not enough input arguments.");
		}
	});
	it('should throw error if argument not an array', () => {
		let arr = new MxNDArray(wi,[2,7,3]);
		let arr2 = new MxNDArray(wi, [2,7,3]);
		try{
			wi.mtimes_MM(0, arr2._arr_ptr);
			expect(2).to.equal(3);
		}catch(err){
			expect(err.message).to.equal("Not enough input arguments.");
		}
	});
	it('should throw error if arguments larger than 2D dimensions', () => {
		let arr = new MxNDArray(wi,[2,7,3]);
		let arr2 = new MxNDArray(wi, [2,7,3]);
		try{
			wi.mtimes_MM(arr._arr_ptr, arr2._arr_ptr);
			expect(2).to.equal(3);
		}catch(err){
			expect(err.message).to.equal("Arguments must be 2-D, or at least one argument must be scalar.");
		}
	});
	it('should throw error if column of the first matrix and rows of the second do not match', () => {
		let arr = new MxNDArray(wi,[2,7]);
		let arr2 = new MxNDArray(wi, [1,7]);
		try{
			wi.mtimes_MM(arr._arr_ptr, arr2._arr_ptr);
			expect(2).to.equal(3);
		}catch(err){
			expect(err.message).to.equal("Inner matrix dimensions must agree.");
		}
	});
	it('should return correct result for matrix multiplication of vectors', () => {
		let arr = mr.colon(1,7);
		arr = arr.reshape([1,7]);
		let arr2 = mr.colon(1,7);
		arr2 = arr2.reshape([7,1]);
		let res = new MxNDArray(wi, wi.mtimes_MM(arr._arr_ptr, arr2._arr_ptr));
		expect(Array.from(res.size().getContents()))
			.to.deep.equal([1,1]);
		expect(Array.from(res.getContents())).to.deep.equal([140]);
	});
	it("should return correct 2x2 array when passing [2,1],[1,2]",()=>{
		let arr = mr.lit([1,2]);
		let arr2 = mr.lit([[2],[1]]);
		let res = new MxNDArray(wi, wi.mtimes_MM( arr2._arr_ptr,arr._arr_ptr));
		res = new MxNDArray(wi, wi.plus_MS( res._arr_ptr,5));
	});

	it('should return correct result for matrix multiplication of two 2D arrays', () => {
		let arr = mr.colon(1,7);
		arr = arr.reshape([7,1]);
		let arr2 = mr.colon(1,7);
		arr2 = arr2.reshape([1,7]);
		let res = new MxNDArray(wi, wi.mtimes_MM(arr._arr_ptr, arr2._arr_ptr));
		expect(Array.from(res.size().getContents())).to.deep.equal([7,7]);
		expect(Array.from(res.getContents(0,7))).to.deep.equal([1,2,3,4,5,6,7]);

	});
});