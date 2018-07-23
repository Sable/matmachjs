
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

describe('Cell Array Creation', () => {
	beforeEach(async () => {
		libjs.js.mem = WebAssembly.Memory({initial: 1});
		wi = await WebAssembly.instantiate(file, libjs);
		wi = wi.instance.exports;
		memory = wi.mem;

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
			expect(wi.get_array_length(param_arr)).to.equal(2);
			expect(wi.ndims(param_arr)).to.equal(2);
			expect(wi.length(param_arr)).to.equal(2);
			expect(wi.get_array_index_i32(param_arr, 2)).to.equal(dim_2);
		});
	});
});