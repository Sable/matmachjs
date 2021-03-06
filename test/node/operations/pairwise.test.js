
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
const libjs = require(path.join(__dirname,"../../../")+"/bin/matmachjs-lib.js");


const file = fs.readFileSync(path.join(__dirname,"../../../")+"/bin/matmachjs.wasm");
const { MxVector } = require(path.join(__dirname,"../../../")+"bin/classes/mxarray/MxVector.js");
const { MxNDArray } = require(path.join(__dirname,"../../../")+ "bin/classes/mxarray/MxNdArray.js");

let wi;
let memory;

describe('Pairwise and broadcasting', () => {
	beforeEach(async () => {
		wi = await WebAssembly.instantiate(file, libjs);
		wi = wi.instance.exports;
		memory = wi.mem;
	});
	describe('Shape output', () => {
		it('should correctly return a 0x0 array when passing two empty inputs', () => {
			let vec = new MxVector(wi, [2, 2, 2]);
			let arr_ptr = wi.zeros(vec.arr_ptr);
			let arr = new MxNDArray(wi, arr_ptr);
			expect(Array.from(arr.size().getContents())).to.deep.equal([2, 2, 2]);
			expect(arr.numel()).to.deep.equal(8);
			expect(Array.from(arr.getContents())).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0]);
		});
		it('should correctly throw error when two dimensions do not match', () => {
			let a = new MxNDArray(wi, [2, 2]);
			let b = new MxNDArray(wi, [2, 3]);
			try {
				wi.verify_pairwise(a.arr_ptr, b.arr_ptr);
				expect(1 + 1).to.equal(3);
			} catch (err) {
				expect(err.message).to.equal("Matrix dimensions must agree.");
			}
		});
		it('should correctly grow a [4,5,1,3], [4,5,4,3] into [4,5,4,3]', () => {
			let a = new MxNDArray(wi, [4, 5, 1, 3]);
			let b = new MxNDArray(wi, [4, 5, 4, 3]);
			let res = new MxNDArray(wi, wi.verify_pairwise(a.arr_ptr, b.arr_ptr));
			expect(Array.from(res.size().getContents())).to.deep.equal([4, 5, 4, 3]);
		});
		it('should correctly grow a [4,5], [4,5,4,3] into [4,5,4,3]', () => {
			let a = new MxNDArray(wi, [4, 5]);
			let b = new MxNDArray(wi, [4, 5, 4, 3]);
			let res = new MxNDArray(wi, wi.verify_pairwise(a.arr_ptr, b.arr_ptr));
			expect(Array.from(res.size().getContents())).to.deep.equal([4, 5, 4, 3]);
		});
	});
	describe("Functions that use pairwise", ()=>{
		describe("#plus_MM",()=>{
			it('should correctly broadcast and output [2,3;4,5], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.plus_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([2,4,3,5]);
			});
			it('should correctly output without broadcasting [1,2]+[1,3] = [2,5]', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,2]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.plus_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([2,5]);
			});
		});
		describe("#min_MM",()=>{
			it('should correctly output without broadcasting [1,2]-[1,3] = [2,5]', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,2]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.minus_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,-1]);
			});
			it('should correctly output [0,2,-1,1], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.minus_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,2,-1,1]);
			});
		});
		describe("#times_MM",()=>{
			it('should correctly output without broadcasting [1,2]*[1,3] = [2,5]', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,2]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.times_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,6]);
			});
			it('should correctly broadcast and output [2,3;4,5], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.times_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,3,2,6]);
			});
		});
		describe("#mod_MM",()=>{
			it('should correctly output without broadcasting [1,2]*[1,3] = [2,5]', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,2]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.mod_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,2]);
			});
			it('should correctly broadcast and output [0,0,-1,-1], when passing [1,3], [-1;-2] as inputs', () => {
				let a = new MxNDArray(wi, [2,1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[-1,-2]);
				let res = new MxNDArray(wi, wi.mod_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				// NOTE: BUG IN CHAI LIBRARY RETURNS [-0,-0,-1,-1]
				expect(Array.from(res.getContents())).to.deep.equal([0,0,-1,-1]);
			});
			it('should correctly broadcast and output [0,0,-1,-1], when passing [-1,-3], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2,1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[-1,-3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.mod_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,0,1,1]);
			});
			it('should correctly broadcast and output [0,0,1,1], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.mod_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,0,1,1]);
			});
		});
		describe("#rem_MM",()=>{
			it('should correctly output without broadcasting [1,2]*[1,3] = [2,5]', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,2]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.rem_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,2]);
			});
			it('should correctly broadcast and output [0,0,-1,-1], when passing [-1,-3], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2,1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[-1,-3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.rem_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,0,-1,-1]);
			});
			it('should correctly broadcast and output [0,0,-1,-1], when passing [1,3], [-1;-2] as inputs', () => {
				let a = new MxNDArray(wi, [2,1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[-1,-2]);
				let res = new MxNDArray(wi, wi.rem_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,0,1,1]);
			});
			it('should correctly broadcast and output [2,3;4,5], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.rem_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,0,1,1]);
			});
		});
		describe("#rdivide_MM",()=>{
			it('should correctly output without broadcasting [1,2]*[1,3] = [2,5]', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,2]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.rdivide_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,2/3]);
			});
			it('should correctly broadcast and output [2,3;4,5], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.rdivide_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,3,0.5,1.5]);
			});
		});
		describe("#ldivide_MM",()=>{
			it('should correctly output without broadcasting [1,2],[1,3] = [2,5]', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,2]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.ldivide_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,3/2]);
			});
			it('should correctly broadcast and output [2,3;4,5], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.ldivide_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,1/3,2,2/3]);
			});
		});
		describe('#power_MM', () => {
			it('should correctly output without broadcasting [1,2]^[1,3] = [1,8]', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,2]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.power_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,8]);
			});
			it('should correctly broadcast and output [2,3;4,5], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.power_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,3,1,9]);
			});
		});

		describe("#le_MM",()=>{
			it('should correctly output without broadcasting [1,2]*[1,3] = [2,5]', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,2]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.le_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,1]);
			});
			it('should correctly broadcast and output [2,3;4,5], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.le_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,0,1,0]);
			});
		});
		describe("#lt_MM",()=>{
			it('should correctly output without broadcasting [1,2],[1,3] = [2,5]', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,2]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.lt_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,1]);
			});
			it('should correctly broadcast and output [2,3;4,5], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.lt_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,0,1,0]);
			});
		});
		describe("#ge_MM",()=>{
			it('should correctly output without broadcasting [1,2]*[1,3] = [2,5]', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,2]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.ge_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,0]);
			});
			it('should correctly broadcast and output [2,3;4,5], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.ge_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,1,0,1]);
			});
		});
		describe("#gt_MM",()=>{
			it('should correctly output without broadcasting [1,2],[1,3] = [2,5]', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,2]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.gt_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,0]);
			});
			it('should correctly broadcast and output [2,3;4,5], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.gt_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,1,0,1]);
			});
		});
		describe("#eq_MM",()=>{
			it('should correctly output without broadcasting [1,2]*[1,3] = [2,5]', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,2]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.eq_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,0]);
			});
			it('should correctly broadcast and output [2,3;4,5], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.eq_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,0,0,0]);
			});
			it('should correctly broadcast and output [1,1], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.eq_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,1]);
			});
		});
		describe("#and_MM",()=>{
			it('should correctly output without broadcasting [1,2],[1,3] = [2,5]', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,2]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.and_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,1]);
			});
			it('should correctly broadcast and output [1,1,1,1], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.and_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,1,1,1]);
			});
			it('should correctly broadcast and output [0,0,1,0], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,0]);
				b.set_indices([[1,2]],[0,1]);
				let res = new MxNDArray(wi, wi.and_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,0,1,0]);
			});
		});
		describe("#or_MM",()=>{
			it('should correctly output without broadcasting [1,2]*[1,3] = [2,5]', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,2]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.or_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,1]);
			});
			it('should correctly broadcast and output [2,3;4,5], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.or_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([1,1,1,1]);
			});
			it('should correctly broadcast and output [2,3;4,5], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[0,3]);
				b.set_indices([[1,2]],[0,2]);
				let res = new MxNDArray(wi, wi.or_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,1,1,1]);
			});
		});
		describe("#ne_MM",()=>{
			it('should correctly output without broadcasting [1,2]*[1,3] = [2,5]', () => {
				let a = new MxNDArray(wi, [1,2]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,2]);
				b.set_indices([[1,2]],[1,3]);
				let res = new MxNDArray(wi, wi.ne_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([1,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,1]);
			});
			it('should correctly broadcast and output [2,3;4,5], when passing [1,2], [1;2] as inputs', () => {
				let a = new MxNDArray(wi, [2, 1]);
				let b = new MxNDArray(wi, [1,2]);
				a.set_indices([[1,2]],[1,3]);
				b.set_indices([[1,2]],[1,2]);
				let res = new MxNDArray(wi, wi.ne_MM(a.arr_ptr,b.arr_ptr));
				expect(Array.from(res.size().getContents())).to.deep.equal([2,2]);
				expect(Array.from(res.getContents())).to.deep.equal([0,1,1,1]);
			});
		});
	});
});