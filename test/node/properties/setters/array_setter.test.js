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
const libjs = require(path.join(__dirname,"../../../../")+"/bin/lib.js");


const file = fs.readFileSync(path.join(__dirname,"../../../../")+"/bin/get_mem.wasm");
const { MxNDArray, MxVector, MatlabRuntime } = require(path.join(__dirname,"../../../../bin/classes/Runtime.js"));
let wasmInstance;
let memory;
describe('Setters', () => {
	describe("#set_elem_array_index_NS", () => {
		let memory;
		let arr_1d;
		let arr_data_nd;
		let head_nd;
		let data_nd;
		beforeEach(async ()=>{
			wasmInstance= await WebAssembly.instantiate(file,libjs);
			wasmInstance = wasmInstance.instance.exports;
			memory = wasmInstance.mem;
			arr_1d = wasmInstance.create_mxvector(4);
			wasmInstance.set_array_index_f64(arr_1d, 1,30);
			wasmInstance.set_array_index_f64(arr_1d, 2,2);
			wasmInstance.set_array_index_f64(arr_1d, 3,4);
			wasmInstance.set_array_index_f64(arr_1d, 4,6);
			head_nd = wasmInstance.create_mxarray_ND(arr_1d,0,5/*int32*/);
			data_nd = wasmInstance.mxarray_core_get_array_ptr(head_nd);
			arr_data_nd = new Float64Array(memory.buffer, data_nd, 4);
		});
		it("Should reallocate array when index is more than length",() =>{
			// TODO(dherre3): Assumption is that dynamic allocation does not exist
		});

		it("Should throw an error when index is less than 1",() =>{
			try{
				wasmInstance.set_array_index_i32(head_nd,1,232);
				wasmInstance.set_array_index_i32(head_nd,-1,232);
				expect("I did not throw error").to.equal("I threw error");
			}catch( err ) {
				expect(err.message).to.equal("Subscript indices must either be real positive integers or logicals");
			}


		});

		it("Should correctly set value for i32",() =>{
			let a = new Int32Array(memory.buffer, arr_1d, 6);
			wasmInstance.set_array_index_i32(head_nd, 1,2);
			wasmInstance.set_array_index_i32(head_nd, 2,4);
			wasmInstance.set_array_index_i32(head_nd, 3,123);
			wasmInstance.set_array_index_i32(head_nd, 4,12312);
			// expect(Array.from(arr_data_nd)).to.deep.equal([2,4,123,12312])
		});

	});
	describe('#set_f64', () => {
		let wi;
		let create_mxvector,
			create_mxarray_ND,
			set_array_index_f64,
			get_array_index_f64,
			set_array_index_i32,
			get_f64,
			set_f64;
		beforeEach(async () => {
			wi= await WebAssembly.instantiate(file,libjs);
			wi = wi.instance.exports;
			({create_mxvector,get_f64,set_f64,set_array_index_i32,
				get_array_index_f64, create_mxarray_ND, set_array_index_f64} = wi);
			memory = wi.mem;
		});
		it("should throw error when the values and indeces do not have the same dimensions ",()=>{
			let mxvec = create_mxvector(3);
			set_array_index_f64(mxvec,1,3);
			set_array_index_f64(mxvec,2,7);
			set_array_index_f64(mxvec,3,2);
			let mxarr = create_mxarray_ND(mxvec);
			let indices1 = create_mxvector(3);
			let indices2 = create_mxvector(2);
			let indices3 = create_mxvector(1);
			set_array_index_f64(indices1,1,2);
			set_array_index_f64(indices1,2,3);
			set_array_index_f64(indices1,3,1);
			set_array_index_f64(indices2,1,7);
			set_array_index_f64(indices2,2,6);
			set_array_index_f64(indices3,1,2);
			let cell_arr = create_mxvector(3,5);
			set_array_index_i32(cell_arr,1,indices1);
			set_array_index_i32(cell_arr,2,indices2);
			set_array_index_i32(cell_arr,3,indices3);
			let values_ptr = create_mxvector(3);
			set_array_index_f64(values_ptr,1,3);
			set_array_index_f64(values_ptr,2,3);
			set_array_index_f64(values_ptr,3,3);
			try{
				let res_ptr = set_f64(mxarr,cell_arr, values_ptr);
				expect(1).to.eq(0);
			}catch (er){
				expect(er.message).to.equal("Subscripted assignment dimension mismatch.");
			}

		});
		it('should get the elements of array correctly', () => {
			let mxvec = create_mxvector(3);
			set_array_index_f64(mxvec,1,3);
			set_array_index_f64(mxvec,2,7);
			set_array_index_f64(mxvec,3,2);
			let mxarr = create_mxarray_ND(mxvec);
			let indices1 = create_mxvector(3);
			let indices2 = create_mxvector(2);
			let indices3 = create_mxvector(1);
			set_array_index_f64(indices1,1,2);
			set_array_index_f64(indices1,2,3);
			set_array_index_f64(indices1,3,1);
			set_array_index_f64(indices2,1,7);
			set_array_index_f64(indices2,2,6);
			set_array_index_f64(indices3,1,2);
			let cell_arr = create_mxvector(3,5);
			set_array_index_i32(cell_arr,1,indices1);
			set_array_index_i32(cell_arr,2,indices2);
			set_array_index_i32(cell_arr,3,indices3);
			let values_dim_ptr = create_mxvector(2);
			set_array_index_f64(values_dim_ptr, 1, 3);
			set_array_index_f64(values_dim_ptr, 2, 2);
			let values_ptr = create_mxarray_ND(values_dim_ptr);
			set_array_index_f64(values_ptr,1,3);
			set_array_index_f64(values_ptr,2,3);
			set_array_index_f64(values_ptr,3,3);
			set_array_index_f64(values_ptr,4,3);
			set_array_index_f64(values_ptr,5,3);
			set_array_index_f64(values_ptr,6,3);

			let res_ptr = set_f64(mxarr,cell_arr, values_ptr);
			expect(get_array_index_f64(res_ptr,37)).to.equal(3);
			expect(get_array_index_f64(res_ptr,38)).to.equal(3);
			expect(get_array_index_f64(res_ptr,39)).to.equal(3);
			expect(get_array_index_f64(res_ptr,40)).to.equal(3);
			expect(get_array_index_f64(res_ptr,41)).to.equal(3);
			expect(get_array_index_f64(res_ptr,42)).to.equal(3);
		});
		it('should throw error when input is larger than 1 element array and values do not match with input size', () => {
			let mxvec = create_mxvector(3);
			set_array_index_f64(mxvec,1,3);
			set_array_index_f64(mxvec,2,7);
			set_array_index_f64(mxvec,3,2);
			let mxarr = create_mxarray_ND(mxvec);
			let indices1 = create_mxvector(3);
			let indices2 = create_mxvector(2);
			let indices3 = create_mxvector(1);
			set_array_index_f64(indices1,1,2);
			set_array_index_f64(indices1,2,3);
			set_array_index_f64(indices1,3,1);
			set_array_index_f64(indices2,1,7);
			set_array_index_f64(indices2,2,6);
			set_array_index_f64(indices3,1,2);
			let cell_arr = create_mxvector(3,5);
			set_array_index_i32(cell_arr,1,indices1);
			set_array_index_i32(cell_arr,2,indices2);
			set_array_index_i32(cell_arr,3,indices3);
			let values_ptr = create_mxvector(6);
			set_array_index_f64(values_ptr,1,3);
			set_array_index_f64(values_ptr,2,3);
			set_array_index_f64(values_ptr,3,3);
			set_array_index_f64(values_ptr,4,3);
			set_array_index_f64(values_ptr,5,3);
			set_array_index_f64(values_ptr,6,3);
			try{
				let res_ptr = set_f64(mxarr,cell_arr, values_ptr);
				expect(1).to.eq(0);
			}catch (er){
				expect(er.message).to.equal("Subscripted assignment dimension mismatch.");
			}
		});

		it('should correctly set the values for input of 1 array when values have same vector length', () => {
			let mxvec = create_mxvector(3);
			set_array_index_f64(mxvec,1,3);
			set_array_index_f64(mxvec,2,7);
			set_array_index_f64(mxvec,3,2);
			let mxarr = create_mxarray_ND(mxvec);
			let indices1 = create_mxvector(4);
			set_array_index_f64(indices1,1,2);
			set_array_index_f64(indices1,2,3);
			set_array_index_f64(indices1,3,1);
			set_array_index_f64(indices1,4,6);
			let cell_arr = create_mxvector(1,5);
			set_array_index_i32(cell_arr,1,indices1);
			let values_ptr = create_mxvector(4);
			set_array_index_f64(values_ptr,1,3);
			set_array_index_f64(values_ptr,2,3);
			set_array_index_f64(values_ptr,3,3);
			set_array_index_f64(values_ptr,4,3);

			set_f64(mxarr,cell_arr, values_ptr);
			expect(get_array_index_f64(mxarr,2)).to.equal(3);
			expect(get_array_index_f64(mxarr,3)).to.equal(3);
			expect(get_array_index_f64(mxarr,1)).to.equal(3);
			expect(get_array_index_f64(mxarr,6)).to.equal(3);
		});
		it('should correctly set the values for input of 1 array when values have same numel' +
			' but different dimensions to indexing', () => {
			let mxvec = create_mxvector(3);
			set_array_index_f64(mxvec,1,3);
			set_array_index_f64(mxvec,2,7);
			set_array_index_f64(mxvec,3,2);
			let mxarr = create_mxarray_ND(mxvec);
			let indices1 = create_mxvector(4);
			set_array_index_f64(indices1,1,2);
			set_array_index_f64(indices1,2,3);
			set_array_index_f64(indices1,3,1);
			set_array_index_f64(indices1,4,6);
			let cell_arr = create_mxvector(1,5);
			set_array_index_i32(cell_arr,1,indices1);
			let values_dim_ptr = create_mxvector(2);
			set_array_index_f64(values_dim_ptr, 1, 2);
			set_array_index_f64(values_dim_ptr, 2, 2);
			let values_ptr = create_mxarray_ND(values_dim_ptr);
			set_array_index_f64(values_ptr,1,3);
			set_array_index_f64(values_ptr,2,3);
			set_array_index_f64(values_ptr,3,3);
			set_array_index_f64(values_ptr,4,3);

			set_f64(mxarr,cell_arr, values_ptr);
			expect(get_array_index_f64(mxarr,2)).to.equal(3);
			expect(get_array_index_f64(mxarr,3)).to.equal(3);
			expect(get_array_index_f64(mxarr,1)).to.equal(3);
			expect(get_array_index_f64(mxarr,6)).to.equal(3);
		});
		it('should throw error when of input indexing and values are not equal', () => {
			let arr = new MxNDArray(wi,[3,7,2]);
			try {
				let values = new MxNDArray(wi,[2,2]);
				set_array_index_f64(values.arr_ptr,1,3);
				set_array_index_f64(values.arr_ptr,2,1);
				set_array_index_f64(values.arr_ptr,3,3);
				set_array_index_f64(values.arr_ptr,4,3);
				arr.set_indices([[2,3],[6,7],[2]],[4,1,4,4]);
			}catch (err) {
				expect(err.message).to.equal("Subscripted assignment dimension mismatch.");
			}
		});
		it('should give the correct output for multiple indexing dimensions', () => {
			let arr = new MxNDArray(wi, [3,7,2]);
			let values = new MxNDArray(wi, [2,2]);
			values.set_indices([[1,2,3,4]], [1,2,3,4]);
			arr.set_indices([[2,3],[6,7],[2]], values);
			expect(get_array_index_f64(arr.arr_ptr,38)).to.equal(1);
			expect(get_array_index_f64(arr.arr_ptr,39)).to.equal(2);
			expect(get_array_index_f64(arr.arr_ptr,41)).to.equal(3);
			expect(get_array_index_f64(arr.arr_ptr,42)).to.equal(4);
		});
	});
	describe('#set_array_value_multiple_indeces_f64', () => {
		let wi, mr;
		beforeEach(async ()=> {
			wi = await WebAssembly.instantiate(file, libjs);
			wi = wi.instance.exports;
			memory = wi.mem;
			mr = new MatlabRuntime(wi);
		});
		it('should get correct value of array', () => {
			let values = new MxVector(wi, [2,2,2]);
			let arr = mr.colon(1,42);
			arr.reshape([3,7,2]);
			wi.set_array_value_multiple_indeces_f64(arr._arr_ptr,values.arr_ptr, 100);
			expect(wi.get_array_index_f64(arr._arr_ptr, 26)).to.equal(100);
		});
	});
});
