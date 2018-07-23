
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

describe('Element wise constructors', () => {
	beforeEach(async () => {
		libjs.js.mem = WebAssembly.Memory({initial: 1});
		wi = await WebAssembly.instantiate(file, libjs);
		wi = wi.instance.exports;
		memory = wi.mem;
	});
	describe('#zeroes', () => {
		it('should correctly set all the elements to one', () => {
			let vec = new MxVector(wi, [2,2,2]);
			let arr_ptr  = wi.zeroes(vec.arr_ptr);
			let arr = new MxNDArray(wi, arr_ptr);
			expect(Array.from(arr.size().getContents())).to.deep.equal([2,2,2]);
			expect(arr.numel()).to.deep.equal(8);
			expect(Array.from(arr.getContents())).to.deep.equal([0,0,0,0,0,0,0,0]);
		});

	});
	describe('#ones', () => {
		it('should correctly set all the elements to one', () => {
			let vec = new MxVector(wi, [2,2,2]);
			let arr_ptr  = wi.ones(vec.arr_ptr);
			let arr = new MxNDArray(wi, arr_ptr);
			expect(Array.from(arr.size().getContents())).to.deep.equal([2,2,2]);
			expect(arr.numel()).to.deep.equal(8);
			expect(Array.from(arr.getContents())).to.deep.equal([1,1,1,1,1,1,1,1]);
		});

	});
	describe('#randn', () => {
		it('should correctly set all the elements to one', () => {
			let vec = new MxVector(wi, [2,2,2]);
			let arr_ptr  = wi.randn(vec.arr_ptr);
			let arr = new MxNDArray(wi, arr_ptr);
			expect(Array.from(arr.size().getContents())).to.deep.equal([2,2,2]);
			expect(arr.numel()).to.deep.equal(8);
		});

	});
	describe('#rand', () => {
		it('should return numbers between 0 and 1', () => {
			let vec = new MxVector(wi, [2,2,2]);
			let arr_ptr  = wi.rand(vec.arr_ptr);
			let arr = new MxNDArray(wi, arr_ptr);
			let lessThanOne = Array.from(arr.getContents()).map((item)=>(item<1&& item>0)?1:0);
			expect(lessThanOne).to.deep.equal([1,1,1,1,1,1,1,1]);
			expect(arr.numel()).to.deep.equal(8);
		});

	});
	describe('#randi', () => {
		it('should correctly set all the elements to one', () => {
			let vec = new MxVector(wi, [2,2,2]);
			let arr_ptr  = wi.randi(5.0, vec.arr_ptr);
			let arr = new MxNDArray(wi, arr_ptr);
			let arrCont = Array.from(arr.getContents());
			let max = arrCont.reduce((acc, elem)=> (elem > acc)?elem:acc,-Infinity);
			let min = arrCont.reduce((acc, elem)=> (elem < acc)?elem:acc,Infinity);

			let flooredArray = arrCont.map((elem)=>Math.floor(elem));
			expect(Array.from(arr.size().getContents())).to.deep.equal([2,2,2]);
			expect(arr.numel()).to.deep.equal(8);
			expect(max).to.be.lessThan(5);
			expect(min).to.be.at.most(5);
			expect(arrCont).to.deep.equal(flooredArray);
		});

	});


});