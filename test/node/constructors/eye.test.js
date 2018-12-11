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

describe('#eye', () => {
	// Verifies input
	beforeEach(async () => {
		wi = await WebAssembly.instantiate(file, libjs);
		wi = wi.instance.exports;
		memory = wi.mem;
		mr = new MatlabRuntime(wi);
	});
	it('should correctly create large array',()=>{
		console.log(mr.ones([10000]));
	});
	it('should throw error when passing more than 2 dimensions as input', () => {
		let input = new MxVector(wi, [2,3,4]);
		try{
			wi.eye(input._arr_ptr);
			expect(2).to.equal(3);
		}catch(err){
			expect(err.message).to.equal("N-dimensional arrays are not supported.");
		}
	});
	it('should throw error is not a row vector', () => {
		let input = new MxVector(wi, [1,2]);
		input = mr.reshape(input, [2,1]);
		try{
			wi.eye(input._arr_ptr);
			expect(2).to.equal(3);
		}catch(err){
			expect(err.message).to.equal("Size vector should be a row vector with real elements.");
		}
	});
	it('should throw error when passing zero dimensions', () => {
		let input = new MxVector(wi, []);
		try{
			wi.eye(input._arr_ptr);
			expect(2).to.equal(3);
		}catch(err){
			expect(err.message).to.equal("Size vector should be a row vector with real elements.");
		}
	});
	it('should return an empty array', () => {
		let input = new MxVector(wi, [1,-2]);
		let arr = new MxNDArray(wi, wi.eye(input._arr_ptr));
		expect(arr.numel()).to.equal(0);
		expect(Array.from(arr.size().getContents())).to.deep.equal([1,0]);
	});
	it('should create correctly an nxn identity array when [n] is passed as input', () => {
		let input = new MxVector(wi, [2]);
		let arr = new MxNDArray(wi, wi.eye(input._arr_ptr));
		expect(arr.numel()).to.equal(4);
		expect(Array.from(arr.size().getContents())).to.deep.equal([2,2]);
		expect(Array.from(arr.getContents())).to.deep.equal([1,0,0,1]);
	});
	it('should create correctly nxn identity array when [n,n] are passed as input', () => {
		let input = new MxVector(wi, [3,3]);
		let arr = new MxNDArray(wi, wi.eye(input._arr_ptr));
		expect(arr.numel()).to.equal(9);
		expect(Array.from(arr.size().getContents())).to.deep.equal([3,3]);
		expect(Array.from(arr.getContents())).to.deep.equal([1,0,0,0,1,0,0,0,1]);
	});
	it('should create correctly a nxm identity array when passing [n,m] as input', () => {
		let input = new MxVector(wi, [3,5]);
		let arr = new MxNDArray(wi, wi.eye(input._arr_ptr));
		expect(arr.numel()).to.equal(15);
		expect(Array.from(arr.size().getContents())).to.deep.equal([3,5]);
		expect(Array.from(arr.getContents())).to.deep.equal([1,0,0,0,1,0,0,0,1,0,0,0,0,0,0]);
	});
});