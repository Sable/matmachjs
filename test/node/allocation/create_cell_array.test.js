
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
let wi;
let memory;

describe('Cell Array Creation', () => {
	beforeEach(async () => {
		libjs.js.mem = new WebAssembly.Memory({initial: 1});
		wi = await WebAssembly.instantiate(file, libjs);
		wi = wi.instance.exports;
		memory = wi.mem;

	});
	describe("#create_mxarray_ND",()=>{
		it('should set the cell-array correctly', () => {
			let input = wi.create_mxvector(2);
			wi.set_array_index_f64(input,1,5);
			wi.set_array_index_f64(input,2,10);
			let arr = wi.create_mxarray_ND(input,1); // Create a cell-array
			let size_arr = wi.size(arr);
			let arr_data = wi.mxarray_core_get_array_ptr(arr);
			let capacity = new Int32Array(memory.buffer, arr_data-4,1)[0];
			expect(wi.numel(arr)).to.equal(50);
			expect(wi.ndims(arr)).to.equal(2);
			expect(wi.get_array_index_f64(size_arr,1)).to.equal(5);
			expect(wi.get_array_index_f64(size_arr,2)).to.equal(10);
			expect(capacity).to.equal(208);
		});
	});
	describe('#create_mxvector', function () {
		it('should create cell array correctly', function () {
			let dim_1 = wi.create_mxvector(1,0);
			let dim_2 = wi.create_mxvector(1,0);
			wi.set_array_index_i32(dim_1,1,5);
			wi.set_array_index_i32(dim_2,1,10);
			let param_arr = wi.create_mxvector(2, 5,1);

			wi.set_array_index_i32(param_arr, 1,dim_1);
			wi.set_array_index_i32(param_arr, 2,dim_2);

			expect(wi.get_array_index_i32(dim_1, 1)).to.equal(5);
			expect(wi.get_array_index_i32(dim_2, 1)).to.equal(10);
			expect(wi.get_array_index_i32(param_arr, 1)).to.equal(dim_1);
			expect(wi.mxarray_core_get_array_length(param_arr)).to.equal(2);
			expect(wi.ndims(param_arr)).to.equal(2);
			expect(wi.length_M(param_arr)).to.equal(2);
			expect(wi.get_array_index_i32(param_arr, 2)).to.equal(dim_2);
		});
	});
});