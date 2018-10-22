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

let wi;
describe('Getters', () => {
	describe("#get_elem_array_index_NS", () => {
		let memory;
		let arr_1d;
		// let arr_header_nd;
		let arr_data_nd;
		let head_nd;
		let data_nd;
		let mr;
		beforeEach(async ()=>{
			wi= await WebAssembly.instantiate(file,libjs);
			wi = wi.instance.exports;
			memory = wi.mem;
			arr_1d = wi.create_mxvector(4);
			wi.set_array_index_f64(arr_1d, 1,30);
			wi.set_array_index_f64(arr_1d, 2,2);
			wi.set_array_index_f64(arr_1d, 3,4);
			wi.set_array_index_f64(arr_1d, 4,6);
			head_nd = wi.create_mxarray_ND(arr_1d,0,5/*int32*/);
			data_nd = wi.mxarray_core_get_array_ptr(head_nd);
			arr_data_nd = new Float64Array(memory.buffer, data_nd, 8);
			mr = new MatlabRuntime(wi);
		});
		it("Should correctly return value at index for uint32",() =>{
			head_nd = wi.create_mxarray_ND(arr_1d,0,9/*int32*/);
			wi.set_array_index_i32(head_nd, 1,2);
			wi.set_array_index_i32(head_nd, 2,2147483647);
			wi.set_array_index_i32(head_nd, 3,-12321);
			wi.set_array_index_i32(head_nd, 4,-1321);
			expect(wi.get_array_index_i32(head_nd, 1)).to.equal(2);
			expect(wi.get_array_index_i32(head_nd, 2)).to.equal(2147483647);
			expect(wi.get_array_index_i32(head_nd, 3)).to.equal(0);
			expect(wi.get_array_index_i32(head_nd, 4)).to.equal(0);
		});
		it("Should correctly return value at index for int32",() =>{
			head_nd = wi.create_mxarray_ND(arr_1d,0,5/*int32*/);
			wi.set_array_index_i32(head_nd, 1,2);
			wi.set_array_index_i32(head_nd, 3,2147483647);
			wi.set_array_index_i32(head_nd, 4,-2147483648);
			wi.set_array_index_i32(head_nd, 2,4);
			expect(wi.get_array_index_i32(head_nd, 1)).to.equal(2);
			expect(wi.get_array_index_i32(head_nd, 3)).to.equal(2147483647);
			expect(wi.get_array_index_i32(head_nd, 4)).to.equal(-2147483648);
			expect(wi.get_array_index_i32(head_nd, 2)).to.equal(4);
		});
		it("Should correctly return value at index for f64",() =>{
			head_nd = wi.create_mxarray_ND(arr_1d);
			wi.set_array_index_f64(head_nd, 1,2.12313);
			wi.set_array_index_f64(head_nd, 2,4.2131);
			wi.set_array_index_f64(head_nd, 1000,1000.1221);
			expect(wi.get_array_index_f64(head_nd, 1)).to.equal(2.12313);
			expect(wi.get_array_index_f64(head_nd, 2)).to.equal(4.2131);
			expect(wi.get_array_index_f64(head_nd, 1000)).to.equal(1000.1221);
		});
		it("Should correctly return value at index for f32",() =>{
			head_nd = wi.create_mxarray_ND(arr_1d);
			wi.set_array_index_f64(head_nd, 1,2.12313);
			wi.set_array_index_f64(head_nd, 2,4.2131);
			wi.set_array_index_f64(head_nd, 1000,1000.1221);
			expect(wi.get_array_index_f64(head_nd, 1)).to.equal(2.12313);
			expect(wi.get_array_index_f64(head_nd, 2)).to.equal(4.2131);
			expect(wi.get_array_index_f64(head_nd, 1000)).to.equal(1000.1221);
		});
		it("Should correctly return value at index for int8",() =>{
			head_nd = wi.create_mxarray_ND(arr_1d,0,3);
			let start_arr = wi.mxarray_core_get_array_ptr(head_nd);
			wi.set_array_index_i8(head_nd, 1,-127);
			wi.set_array_index_i8(head_nd, 2,256);
			wi.set_array_index_i8(head_nd, 3,-256);
			wi.set_array_index_i8(head_nd, 4,-1);
			wi.set_array_index_i8(head_nd, 5,127);
			wi.set_array_index_i8(head_nd, 6,12);
			expect(wi.get_array_index_i8(head_nd, 1)).to.equal(-127);
			expect(wi.get_array_index_i8(head_nd, 2)).to.equal(127);
			expect(wi.get_array_index_i8(head_nd, 3)).to.equal(-128);
			expect(wi.get_array_index_i8(head_nd, 4)).to.equal(-1);
			expect(wi.get_array_index_i8(head_nd, 5)).to.equal(127);
			expect(wi.get_array_index_i8(head_nd, 6)).to.equal(12);
		});
		it("Should correctly return value at index for uint8",() =>{
			head_nd = wi.create_mxarray_ND(arr_1d,0,7);
			let start_arr = wi.mxarray_core_get_array_ptr(head_nd);
			wi.set_array_index_i8(head_nd, 1,-127);
			wi.set_array_index_i8(head_nd, 2,129);
			wi.set_array_index_i8(head_nd, 3,-256);
			wi.set_array_index_i8(head_nd, 4,-2121);
			wi.set_array_index_i8(head_nd, 5,500);
			wi.set_array_index_i8(head_nd, 6,255);
			expect(wi.get_array_index_i8(head_nd, 1)).to.equal(0);
			expect(wi.get_array_index_i8(head_nd, 2)).to.equal(129);
			expect(wi.get_array_index_i8(head_nd, 3)).to.equal(0);
			expect(wi.get_array_index_i8(head_nd, 4)).to.equal(0);
			expect(wi.get_array_index_i8(head_nd, 5)).to.equal(255);
			expect(wi.get_array_index_i8(head_nd, 6)).to.equal(255);
		});
		it("Should throw an error if index is less than 1",() =>{
			try{
				wi.set_array_index_i32(head_nd,1,232);
				wi.get_array_index_i32(head_nd,-1,232);
				expect("I did not throw error").to.equal("I threw error");
			}catch( err ) {
				expect(err.message).to.equal("Subscript indices must either be real positive integers or logicals");
			}
		});
		it("Should throw an error if index is larger than array length",() =>{
			try{
				wi.get_array_index_i32(head_nd,1441,232);
				expect("I did not throw error").to.equal("I threw error");
			}catch( err ) {
				expect(err.message).to.equal("Index exceeds matrix dimensions");
			}
		});
	});
	describe("#get_indices", ()=>{
		let memory;
		let mr;
		beforeEach(async ()=>{
			wi= await WebAssembly.instantiate(file,libjs);
			wi = wi.instance.exports;
			memory = wi.mem;
			mr = new MatlabRuntime(wi);
		});
		it('should throw an error when any of the inputs are null', () => {
			// TODO: Check how McLab handles a(). In matlab this gives the entire array
		});
		// TODO: Case where indices are not integers
		it('should return an empty array of size 0x0x0 when given as input ([],[],[])', () => {
			let arr = new MxNDArray(wi, [3,7,2]);
			arr.set_indices([[38,39,41,42]],[3,3,3,3]);
			let arr2 = arr.get([[2,3],[6,7],[2]]);
			expect(Array.from(arr2.getContents())).to.deep.equal(Array.from(new Float64Array([3,3,3,3])));
		});
		it('should throw error if one dimension is not a vector when input argument is larger than 1', () => {
			let arr = new MxNDArray(wi, [3,7,2]);
			// Create index dims
			let get_dims_vec = wi.create_mxvector(3,5);

			// First dim
			let first_dim = wi.create_mxvector(1);
			wi.set_array_index_f64(first_dim,1,3);

			// Second dim, this accessing dim is 2x2
			let second_wrong_dim = wi.create_mxvector(2);
			wi.set_array_index_f64(second_wrong_dim,1,2);
			wi.set_array_index_f64(second_wrong_dim,2,2);
			let second_dim = wi.create_mxarray_ND(second_wrong_dim);
			wi.set_array_index_f64(second_dim,1,2);
			wi.set_array_index_f64(second_dim,2,2);
			wi.set_array_index_f64(second_dim,3,2);
			wi.set_array_index_f64(second_dim,4,2);
			// console.log(wi.numel(second_dim));
			// Third dim
			let third_dim = wi.create_mxvector(1);
			wi.set_array_index_f64(third_dim,1,2);

			// Set index dims
			wi.set_array_index_i32(get_dims_vec,1,first_dim);
			wi.set_array_index_i32(get_dims_vec,2,second_dim);
			wi.set_array_index_i32(get_dims_vec,3,third_dim);
			let arr2 = new MxNDArray(wi, wi.get_f64(arr._arr_ptr, get_dims_vec));
			expect(Array.from(arr2.getContents())).to.deep.equal([0,0,0,0]);
			expect(Array.from(arr2.size().getContents())).to.deep.equal([1,4]);
		});
		it('should return an empty array of size 0x0 when given as input ([1,2,3],[],[1])', () => {
			let arr = new MxNDArray(wi, [3,7,2]);
			let arr2 = arr.get([[1,2,3],[],[]]);
			expect(arr2.getContents().length).to.equal(0);
			expect(arr2.size().get(1)).to.equal(3);
			expect(arr2.size().get(2)).to.equal(0);
			expect(arr2.size().get(3)).to.equal(0);
		});
		it('should throw an error when an accessing index is 0 or less than 0 ', function () {
			let arr = new MxNDArray(wi, [2,2]);
			try{
				arr.get_indices([[-1]]);
			}catch(err){
				expect(err.message).to.equal("Subscript indices must either be real positive integers or logicals");
			}
		});
		it('should correctly return the last value from array', () => {
			let arr = new MxNDArray( wi, [ 3, 7, 2]);
			arr.set_index(42, 1723);
			let val = arr.get([ [42] ]);
			expect(val.getContents()[0]).to.equal(1723);
		});
		it('should throw an error when the dimensions of the accessing cell of array is one the accessing index' +
			'  inside that array is more than the length of the actual array ', function () {
			let arr = new MxNDArray(wi, [3,7,2]);
			try{
				let arr2 = arr.get_indices([[1,2,42]]);

			}catch(err) {
				expect(err.message).to.equal("Index exceeds matrix dimensions");
			}
		});
		it('should throw error if a dimension index is larger than the length of that particular dimension', () => {
			let arr = new MxNDArray(wi, [3,7,2]);
			try{
				let arr2 = arr.get_indices([[1,2,3],[8],[3]]);
			}catch(err) {
				expect(err.message).to.equal("Index exceeds matrix dimensions");
			}
		});
		it('should get array using vector or colon operator', () => {
			let param_arr = wi.create_mxvector(2,5);
			let dim_1 = wi.create_mxvector(1);
			let dim_2 = wi.create_mxvector(1);
			wi.set_array_index_f64(dim_1, 1, 1);
			wi.set_array_index_f64(dim_2, 1, 100);
			wi.set_array_index_i32(param_arr, 1, dim_1);
			wi.set_array_index_i32(param_arr, 2, dim_2);
			let colon_arr = wi.colon(param_arr);
			let copy_arr = wi.clone(colon_arr);
			let new_dims = wi.create_mxvector(2);
			wi.set_array_index_f64(new_dims, 1, 100);
			wi.set_array_index_f64(new_dims, 2, 1);
			let arr = wi.reshape(copy_arr, new_dims);
			let size2 = wi.size(arr);
			let input_vec = wi.create_mxvector(1,5);
			wi.set_array_index_i32(input_vec, 1, arr);
			let arr_res = wi.get_f64(colon_arr, input_vec);
			let arr_2 = new MxNDArray(wi, arr_res);
			expect(wi.numel(arr_res)).to.equal(100);
			expect(wi.ndims(arr_res)).to.equal(2);
			expect(arr_2.size().get(1)).to.equal(100);
			expect(arr_2.size().get(2)).to.equal(1);
		});
		it("should return 5x1 when initial array is 10x1 and indice is colon 1x5",()=>{
			let arr = mr.colon(1,10);
			let arr_t = mr.transpose(arr);
			let res = arr_t.get([[1,2,3,4,5]]);
			expect(Array.from(res.size().getContents())).to.deep.equal([5,1]);
			expect(Array.from(res.getContents())).to.deep.equal([1,2,3,4,5]);
		});
		it("should correctly return a 2x2 array with values 1,2,3,4", ()=>{
			let param_arr = wi.create_mxvector(2,5);
			let dim_1 = wi.create_mxvector(1);
			let dim_2 = wi.create_mxvector(1);
			wi.set_array_index_f64(dim_1, 1, -5);
			wi.set_array_index_f64(dim_2, 1, 5);
			wi.set_array_index_i32(param_arr, 1, dim_1);
			wi.set_array_index_i32(param_arr, 2, dim_2);
			let colon_arr = wi.colon(param_arr);
			expect(Array.from((new MxNDArray(wi, colon_arr)).getContents())).to.deep.equal( [-5,-4,-3,-2,-1,0,1,2,3,4,5] );
		});
		it("should correctly return a 1x4 array with values 1,2,3,4", ()=>{
			let colon_arr = mr.colon(1,4);
			let res_arr = colon_arr.get([[1,2,3,4]]);
			expect(Array.from(res_arr.getContents())).to.deep.equal( [1,2,3,4] );
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
			expect(wi.get_array_index_f64(arr._arr_ptr,26)).to.equal(26);
			expect(wi.get_array_value_multiple_indeces_f64(arr._arr_ptr,values.arr_ptr)).to.equal(26);
		});
		it('should set correctly when using a scalar', () => {
			let arr = new MxNDArray(wi, [5,6]);
			arr.set( [[1,2,3,4,5],[1]],[1]);
			expect(Array.from(arr.get([[1,2,3,4,5],[1]]).getContents())).to.deep.equal([1,1,1,1,1]);
		});

	});
});