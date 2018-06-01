
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
let wi;
let memory;

describe('Array Constructors', () => {
	beforeEach(async () => {
		libjs.js.mem = WebAssembly.Memory({initial: 1});
		wi = await WebAssembly.instantiate(file, libjs);
		wi = wi.instance.exports;
		memory = wi.mem;
	});
	describe('#colon(i,j,k)', function () {
		describe('Arguments', function () {
			it('should throw error if less than two inputs', ()=> {
				let dim_1 = wi.create_mxvector(1);
				let param_arr = wi.create_mxvector(1, 5);
				wi.set_array_index_i32(param_arr, 1, dim_1);
				try{
					wi.colon(param_arr);
				}catch(err)
				{
					expect(err.message).to.equal("Not enough input arguments.");
				}
			});
			it("should throw error if an argument is null ", ()=>{

			});
		});

		describe('Two inputs',()=>{
			it('should return  1x0 array if j < i', ()=>{
				let dim_1 = wi.create_mxvector(1);
				let dim_2 = wi.create_mxvector(1);
				let param_arr = wi.create_mxvector(2,5);
				wi.set_array_index_f64(dim_1, 1, 2);
				wi.set_array_index_f64(dim_2, 1, 1);
				wi.set_array_index_i32(param_arr, 1, dim_1);
				wi.set_array_index_i32(param_arr, 2, dim_2);
				let colon_arr = wi.colon(param_arr);
				let size_arr = wi.size(colon_arr);
				expect(wi.numel(colon_arr)).to.equal(0);
				expect([wi.get_array_index_f64(size_arr,1), wi.get_array_index_f64(size_arr,2)]).to.deep.equal([1,0]);
			});
			it('should return  1x0 array if i or j are empty', ()=>{
				let dim_1 = wi.create_mxvector(0);
				let dim_2 = wi.create_mxvector(0);
				let param_arr = wi.create_mxvector(2,5);
				wi.set_array_index_i32(param_arr, 1, dim_1);
				wi.set_array_index_i32(param_arr, 2, dim_2);
				let colon_arr = wi.colon(param_arr);
				let size_arr = wi.size(colon_arr);
				expect(wi.numel(colon_arr)).to.equal(0);
				expect([wi.get_array_index_f64(size_arr,1), wi.get_array_index_f64(size_arr,2)]).to.deep.equal([1,0]);
			});
			it('should return a scalar if i == j for positive numbers',() =>{
				let dim_1 = wi.create_mxvector(1);
				let dim_2 = wi.create_mxvector(1);
				let param_arr = wi.create_mxvector(2,5);
				wi.set_array_index_f64(dim_1, 1, 2);
				wi.set_array_index_f64(dim_2, 1, 2);
				wi.set_array_index_i32(param_arr, 1, dim_1);
				wi.set_array_index_i32(param_arr, 2, dim_2);
				let colon_arr = wi.colon(param_arr);
				expect(wi.isscalar(colon_arr)).to.equal(1);
				expect(wi.get_array_index_f64(colon_arr,1)).to.deep.equal(2);
				// Second test
				wi.set_array_index_f64(dim_1, 1, 3);
				wi.set_array_index_f64(dim_2, 1, 3);
				colon_arr = wi.colon(param_arr);
				expect(wi.isscalar(colon_arr)).to.equal(1);
				expect(wi.get_array_index_f64(colon_arr,1)).to.deep.equal(3);
			});
			it('should return a scalar if i == j for negative numbers',() =>{
				let dim_1 = wi.create_mxvector(1);
				let dim_2 = wi.create_mxvector(1);
				let param_arr = wi.create_mxvector(2,5);
				wi.set_array_index_f64(dim_1, 1, -1);
				wi.set_array_index_f64(dim_2, 1, -1);
				wi.set_array_index_i32(param_arr, 1, dim_1);
				wi.set_array_index_i32(param_arr, 2, dim_2);
				let colon_arr = wi.colon(param_arr);
				expect(wi.isscalar(colon_arr)).to.equal(1);
				expect(wi.get_array_index_f64(colon_arr,1)).to.deep.equal(-1);
			});
			it('should create appropriate mxvector for i=2,j=10 of 9 elements',  ()=> {
				let dim_1 = wi.create_mxvector(1);
				let dim_2 = wi.create_mxvector(1);
				let param_arr = wi.create_mxvector(2,5);
				wi.set_array_index_f64(dim_1, 1, 2);
				wi.set_array_index_f64(dim_2, 1, 10);
				wi.set_array_index_i32(param_arr, 1, dim_1);
				wi.set_array_index_i32(param_arr, 2, dim_2);
				let colon_arr = wi.colon(param_arr);
				let data_colon_arr = wi.get_array_start(colon_arr);
				expect(Array.from(new Float64Array(memory.buffer, data_colon_arr, wi.numel(colon_arr)))).to.deep.equal([2,3,4,5,6,7,8,9,10]);

			});
			it('should create appropriate mxvector for i=-1,j=1 of 3 elements', ()=> {
				let dim_1 = wi.create_mxvector(1);
				let dim_2 = wi.create_mxvector(1);
				let param_arr = wi.create_mxvector(2,5);
				wi.set_array_index_f64(dim_1, 1, -1);
				wi.set_array_index_f64(dim_2, 1, 1);
				wi.set_array_index_i32(param_arr, 1, dim_1);
				wi.set_array_index_i32(param_arr, 2, dim_2);
				let colon_arr = wi.colon(param_arr);
				let data_colon_arr = wi.get_array_start(colon_arr);
				expect(Array.from(new Float64Array(memory.buffer, data_colon_arr, wi.numel(colon_arr)))).to.deep.equal([-1,0,1]);
			});

		});
		describe('Three inputs', ()=> {

			it('should return 1x0 if j=0, regardless of i and k',  () => {
				let dim_1 = wi.create_mxvector(1);
				let dim_2 = wi.create_mxvector(1);
				let dim_3 = wi.create_mxvector(1);
				let param_arr = wi.create_mxvector(3,5);
				wi.set_array_index_f64(dim_1, 1, 4);
				wi.set_array_index_f64(dim_2, 1, 0);
				wi.set_array_index_f64(dim_3, 1, -4);

				wi.set_array_index_i32(param_arr, 1, dim_1);
				wi.set_array_index_i32(param_arr, 2, dim_2);
				wi.set_array_index_i32(param_arr, 3, dim_3);

				let colon_arr = wi.colon(param_arr);
				let size_arr = wi.size(colon_arr);
				expect(wi.numel(colon_arr)).to.equal(0);
				expect([wi.get_array_index_f64(size_arr,1), wi.get_array_index_f64(size_arr,2)])
						.to.deep.equal([1,0]);
			});

			it('should return 1x0 if i < k & j < 0', () => {
				let dim_1 = wi.create_mxvector(1);
				let dim_2 = wi.create_mxvector(1);
				let dim_3 = wi.create_mxvector(1);
				let param_arr = wi.create_mxvector(3,5);
				wi.set_array_index_f64(dim_1, 1, 1);
				wi.set_array_index_f64(dim_2, 1, -1);
				wi.set_array_index_f64(dim_3, 1, 4);

				wi.set_array_index_i32(param_arr, 1, dim_1);
				wi.set_array_index_i32(param_arr, 2, dim_2);
				wi.set_array_index_i32(param_arr, 3, dim_3);

				let colon_arr = wi.colon(param_arr);
				let size_arr = wi.size(colon_arr);
				expect(wi.numel(colon_arr)).to.equal(0);
				expect([wi.get_array_index_f64(size_arr,1), wi.get_array_index_f64(size_arr,2)])
					.to.deep.equal([1,0]);
			});
			it('should return 1x0 if k < i & j > 0', () => {
				let dim_1 = wi.create_mxvector(1);
				let dim_2 = wi.create_mxvector(1);
				let dim_3 = wi.create_mxvector(1);
				let param_arr = wi.create_mxvector(3,5);
				wi.set_array_index_f64(dim_1, 1, 5);
				wi.set_array_index_f64(dim_2, 1, 1);
				wi.set_array_index_f64(dim_3, 1, -5);

				wi.set_array_index_i32(param_arr, 1, dim_1);
				wi.set_array_index_i32(param_arr, 2, dim_2);
				wi.set_array_index_i32(param_arr, 3, dim_3);

				let colon_arr = wi.colon(param_arr);
				let size_arr = wi.size(colon_arr);
				expect(wi.numel(colon_arr)).to.equal(0);
				expect([wi.get_array_index_f64(size_arr,1), wi.get_array_index_f64(size_arr,2)])
					.to.deep.equal([1,0]);

			});
			it('should return 1x1 if i == k & j != 0', () => {
				let dim_1 = wi.create_mxvector(1);
				let dim_2 = wi.create_mxvector(1);
				let dim_3 = wi.create_mxvector(1);
				let param_arr = wi.create_mxvector(3,5);
				wi.set_array_index_f64(dim_1, 1, 5);
				wi.set_array_index_f64(dim_2, 1, 1);
				wi.set_array_index_f64(dim_3, 1, 5);

				wi.set_array_index_i32(param_arr, 1, dim_1);
				wi.set_array_index_i32(param_arr, 2, dim_2);
				wi.set_array_index_i32(param_arr, 3, dim_3);

				let colon_arr = wi.colon(param_arr);
				let size_arr = wi.size(colon_arr);
				expect(wi.numel(colon_arr)).to.equal(1);
				expect(wi.get_array_index_f64(colon_arr,1))
					.to.deep.equal(5);
				expect([wi.get_array_index_f64(size_arr,1), wi.get_array_index_f64(size_arr,2)])
					.to.deep.equal([1,1]);
			});
			it('should return 11x1 correct value for i=4, j=-2, k=-4, total length should be 5', () => {
				let dim_1 = wi.create_mxvector(1);
				let dim_2 = wi.create_mxvector(1);
				let dim_3 = wi.create_mxvector(1);
				// TODO(derre3): set_array_index_i32 not working correctly, is not checking length before setting
				let param_arr = wi.create_mxvector(3,5);
				wi.set_array_index_f64(dim_1, 1, 4);
				wi.set_array_index_f64(dim_2, 1, -2);
				wi.set_array_index_f64(dim_3, 1, -4);

				wi.set_array_index_i32(param_arr, 1, dim_1);
				wi.set_array_index_i32(param_arr, 2, dim_2);
				wi.set_array_index_i32(param_arr, 3, dim_3);

				let colon_arr = wi.colon(param_arr);
				let data_colon_arr = wi.get_array_start(colon_arr);
				expect(Array.from(new Float64Array(memory.buffer, data_colon_arr, wi.numel(colon_arr)))).to.deep.equal([4,2,0,-2,-4]);
			});
			it('should return 11x1 correct value for i=-4, j=2, k=4, total length should be 5', () => {
				let dim_1 = wi.create_mxvector(1);
				let dim_2 = wi.create_mxvector(1);
				let dim_3 = wi.create_mxvector(1);
				// TODO(derre3): set_array_index_i32 not working correctly, is not checking length before setting
				let param_arr = wi.create_mxvector(3,5);
				wi.set_array_index_f64(dim_1, 1, -4);
				wi.set_array_index_f64(dim_2, 1, 2);
				wi.set_array_index_f64(dim_3, 1, 4);

				wi.set_array_index_i32(param_arr, 1, dim_1);
				wi.set_array_index_i32(param_arr, 2, dim_2);
				wi.set_array_index_i32(param_arr, 3, dim_3);

				let colon_arr = wi.colon(param_arr);
				let data_colon_arr = wi.get_array_start(colon_arr);
				expect(Array.from(new Float64Array(memory.buffer, data_colon_arr, wi.numel(colon_arr)))).to.deep.equal([-4,-2,0,2,4]);
			});
		});
	});
});


