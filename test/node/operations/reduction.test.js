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
const { MxNDArray, MatlabRuntime} = require(path.join(__dirname,"../../../bin/classes/Runtime.js"));

let wi;
let mr;


describe('Operations coming from reductions', () => {
	// Verifies input
	beforeEach(async ()=> {
		wi = await WebAssembly.instantiate(file, libjs);
		wi = wi.instance.exports;
		memory = wi.mem;
		mr = new MatlabRuntime(wi);
	});
	it('should return the same array if dim > shape.length', () => {
		let arr = mr.colon(0,5);
		arr = mr.reshape(arr,[2,3]);
		let res = new MxNDArray(wi, wi.sum(arr._arr_ptr,3,0));
		expect(Array.from(res.size().getContents())).to.deep.equal([2,3]);
		expect(Array.from(res.getContents())).to.deep.equal(Array.from(arr.getContents()));
	});
	it('should return the same array if shape[dim] === 1', () => {
		let arr = mr.colon(1,3);
		arr = mr.reshape(arr,[1,3]);
		let res = new MxNDArray(wi, wi.sum(arr._arr_ptr,1,0));
		expect(Array.from(res.size().getContents())).to.deep.equal([1,3]);
		expect(Array.from(res.getContents())).to.deep.equal(Array.from(arr.getContents()));
	});
	it('should throw error if dim < 0', () => {
		let arr = mr.colon(1,3);
		arr = mr.reshape(arr,[1,3]);
		try{
			let res = new MxNDArray(wi, wi.sum(arr._arr_ptr,-1,0));
			expect(1+1).to.equal(4);
		}catch(err){
			expect(err.message).to.equal("Dimension argument must be a positive integer scalar within indexing range.")
		}
	});

	it('should return first non-singleton dimension', () => {
		let arr = mr.colon(1,10);
		arr = mr.reshape(arr,[1,1,5,2]);
		let res = new MxNDArray(wi, wi.sum(arr._arr_ptr));
		expect(Array.from(res.size().getContents())).to.deep.equal([1,1,1,2]);
	});
	describe("#sum",()=>{
		it('should return [1,5,9], dim = 1, when passing [0,2,4;1,3,5]', () => {
			let arr = mr.colon(0,5);
			arr = mr.reshape(arr,[2,3]);
			let res = new MxNDArray(wi, wi.sum(arr._arr_ptr,1,0));
			expect(Array.from(res.size().getContents())).to.deep.equal([1,3]);
			expect(Array.from(res.getContents())).to.deep.equal([1,5,9]);
			console.log(res.getContents());
		});
		it('should return [6,8], dim = 2, when passing [0,2,4;1,3,5]', () => {
			let arr = mr.colon(0,5);
			arr = mr.reshape(arr,[2,3]);
			let res = new MxNDArray(wi, wi.sum(arr._arr_ptr,2,0));
			expect(Array.from(res.size().getContents())).to.deep.equal([2,1]);
			expect(Array.from(res.getContents())).to.deep.equal([6,9]);
		});
	});
	describe("#prod",()=>{
		it('should return [0,6,20], dim = 1, when passing [0,2,4;1,3,5]', () => {
			let arr = mr.colon(0,5);
			arr = mr.reshape(arr,[2,3]);
			let res = new MxNDArray(wi, wi.prod(arr._arr_ptr,1,0));
			expect(Array.from(res.size().getContents())).to.deep.equal([1,3]);
			expect(Array.from(res.getContents())).to.deep.equal([0,6,20]);
		});
		it('should return [6,8], dim = 2, when passing [0,2,4;1,3,5]', () => {
			let arr = mr.colon(0,5);
			arr = mr.reshape(arr,[2,3]);
			let res = new MxNDArray(wi, wi.prod(arr._arr_ptr,2,0));
			expect(Array.from(res.size().getContents())).to.deep.equal([2,1]);
			expect(Array.from(res.getContents())).to.deep.equal([0,15]);
		});
		it('should return [4], dim = 1, when passing [4]', () => {
			let arr = new MxNDArray(wi, [1,1]);
			arr.set_indices([[1]],[4]);
			let res = new MxNDArray(wi, wi.prod(arr._arr_ptr));
			expect(Array.from(res.size().getContents())).to.deep.equal([1,1]);
			expect(Array.from(res.getContents())).to.deep.equal([4]);
		});
	});
	describe("#any",()=>{
		it('should return [0,6,20], dim = 1, when passing [0,2,4;1,3,5]', () => {
			let arr = mr.colon(0,5);
			arr = mr.reshape(arr,[2,3]);
			let res = new MxNDArray(wi, wi.any(arr._arr_ptr,1));
			expect(Array.from(res.size().getContents())).to.deep.equal([1,3]);
			expect(Array.from(res.getContents())).to.deep.equal([1,1,1]);
		});
		it('should return [6,8], dim = 2, when passing [0,2,4;1,3,5]', () => {
			let arr = mr.colon(0,5);
			arr = mr.reshape(arr,[2,3]);
			let res = new MxNDArray(wi, wi.any(arr._arr_ptr,2,0));
			expect(Array.from(res.size().getContents())).to.deep.equal([2,1]);
			expect(Array.from(res.getContents())).to.deep.equal([1,1]);
		});
	});
	describe("#all",()=>{
		it('should return [0,6,20], dim = 1, when passing [0,2,4;1,3,5]', () => {
			let arr = mr.colon(0,5);
			arr = mr.reshape(arr,[2,3]);
			let res = new MxNDArray(wi, wi.all(arr._arr_ptr,1));
			expect(Array.from(res.size().getContents())).to.deep.equal([1,3]);
			expect(Array.from(res.getContents())).to.deep.equal([0,1,1]);
		});
		it('should return [6,8], dim = 2, when passing [0,2,4;1,3,5]', () => {
			let arr = mr.colon(0,5);
			arr = mr.reshape(arr,[2,3]);
			let res = new MxNDArray(wi, wi.all(arr._arr_ptr,2,0));
			expect(Array.from(res.size().getContents())).to.deep.equal([2,1]);
			expect(Array.from(res.getContents())).to.deep.equal([0,1]);
		});
	});


});