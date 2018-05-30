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
const libjs = require(path.join(__dirname,"../../")+"/bin/lib.js");


const file = fs.readFileSync(path.join(__dirname,"../../")+"/bin/get_mem.wasm");
let wasmInstance;
let memory;
let malloc;
const PAGE_SIZE = 65536;
let HEAP_OFFSET = 64;

describe("GET and SET for arrays" , () => {
	describe("#get_elem_array_index_NS", () => {
		let memory;
		let arr_1d;
		let arr_header_nd;
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
			data_nd = wasmInstance.get_array_start(head_nd);
			arr_data_nd = new Float64Array(memory.buffer, data_nd, 8);
		});
		it("Should correctly return value at index for uint32",() =>{
			head_nd = wasmInstance.create_mxarray_ND(arr_1d,0,9/*int32*/);
			wasmInstance.set_array_index_i32(head_nd, 1,2);
			wasmInstance.set_array_index_i32(head_nd, 2,2147483647);
			wasmInstance.set_array_index_i32(head_nd, 3,-12321);
			wasmInstance.set_array_index_i32(head_nd, 4,-1321);
			expect(wasmInstance.get_array_index_i32(head_nd, 1)).to.equal(2);
			expect(wasmInstance.get_array_index_i32(head_nd, 2)).to.equal(2147483647);
			expect(wasmInstance.get_array_index_i32(head_nd, 3)).to.equal(0);
			expect(wasmInstance.get_array_index_i32(head_nd, 4)).to.equal(0);

		});
		it("Should correctly return value at index for int32",() =>{
			head_nd = wasmInstance.create_mxarray_ND(arr_1d,0,5/*int32*/);
			console.log("Signed", wasmInstance.is_signed(arr_1d));
			wasmInstance.set_array_index_i32(head_nd, 1,2);
			wasmInstance.set_array_index_i32(head_nd, 3,2147483647);
			wasmInstance.set_array_index_i32(head_nd, 4,-2147483648);
			wasmInstance.set_array_index_i32(head_nd, 2,4);
			expect(wasmInstance.get_array_index_i32(head_nd, 1)).to.equal(2);
			expect(wasmInstance.get_array_index_i32(head_nd, 3)).to.equal(2147483647);
			expect(wasmInstance.get_array_index_i32(head_nd, 4)).to.equal(-2147483648);
			expect(wasmInstance.get_array_index_i32(head_nd, 2)).to.equal(4);
		});
		it("Should correctly return value at index for f64",() =>{
			head_nd = wasmInstance.create_mxarray_ND(arr_1d);
			wasmInstance.set_array_index_f64(head_nd, 1,2.12313);
			wasmInstance.set_array_index_f64(head_nd, 2,4.2131);
			wasmInstance.set_array_index_f64(head_nd, 1000,1000.1221);
			expect(wasmInstance.get_array_index_f64(head_nd, 1)).to.equal(2.12313);
			expect(wasmInstance.get_array_index_f64(head_nd, 2)).to.equal(4.2131);
			expect(wasmInstance.get_array_index_f64(head_nd, 1000)).to.equal(1000.1221);
		});
		it("Should correctly return value at index for f32",() =>{
			head_nd = wasmInstance.create_mxarray_ND(arr_1d);
			wasmInstance.set_array_index_f64(head_nd, 1,2.12313);
			wasmInstance.set_array_index_f64(head_nd, 2,4.2131);
			wasmInstance.set_array_index_f64(head_nd, 1000,1000.1221);
			expect(wasmInstance.get_array_index_f64(head_nd, 1)).to.equal(2.12313);
			expect(wasmInstance.get_array_index_f64(head_nd, 2)).to.equal(4.2131);
			expect(wasmInstance.get_array_index_f64(head_nd, 1000)).to.equal(1000.1221);
		});
		it("Should correctly return value at index for int8",() =>{
			head_nd = wasmInstance.create_mxarray_ND(arr_1d,0,3);
			let start_arr = wasmInstance.get_array_start(head_nd);
			wasmInstance.set_array_index_i8(head_nd, 1,-127);
			wasmInstance.set_array_index_i8(head_nd, 2,256);
			wasmInstance.set_array_index_i8(head_nd, 3,-256);
			wasmInstance.set_array_index_i8(head_nd, 4,-1);
			wasmInstance.set_array_index_i8(head_nd, 5,127);
			wasmInstance.set_array_index_i8(head_nd, 6,12);
			expect(wasmInstance.get_array_index_i8(head_nd, 1)).to.equal(-127);
			expect(wasmInstance.get_array_index_i8(head_nd, 2)).to.equal(127);
			expect(wasmInstance.get_array_index_i8(head_nd, 3)).to.equal(-128);
			expect(wasmInstance.get_array_index_i8(head_nd, 4)).to.equal(-1);
			expect(wasmInstance.get_array_index_i8(head_nd, 5)).to.equal(127);
			expect(wasmInstance.get_array_index_i8(head_nd, 6)).to.equal(12);
		});
		it("Should correctly return value at index for uint8",() =>{
			head_nd = wasmInstance.create_mxarray_ND(arr_1d,0,7);
			let start_arr = wasmInstance.get_array_start(head_nd);
			wasmInstance.set_array_index_i8(head_nd, 1,-127);
			wasmInstance.set_array_index_i8(head_nd, 2,129);
			wasmInstance.set_array_index_i8(head_nd, 3,-256);
			wasmInstance.set_array_index_i8(head_nd, 4,-2121);
			wasmInstance.set_array_index_i8(head_nd, 5,500);
			wasmInstance.set_array_index_i8(head_nd, 6,255);
			expect(wasmInstance.get_array_index_i8(head_nd, 1)).to.equal(0);
			expect(wasmInstance.get_array_index_i8(head_nd, 2)).to.equal(129);
			expect(wasmInstance.get_array_index_i8(head_nd, 3)).to.equal(0);
			expect(wasmInstance.get_array_index_i8(head_nd, 4)).to.equal(0);
			expect(wasmInstance.get_array_index_i8(head_nd, 5)).to.equal(255);
			expect(wasmInstance.get_array_index_i8(head_nd, 6)).to.equal(255);
		});

		it("Should throw an error if index is less than 1",() =>{
			try{
				wasmInstance.set_array_index_i32(head_nd,1,232);
				wasmInstance.get_array_index_i32(head_nd,-1,232);
				expect("I did not throw error").to.equal("I threw error");
			}catch( err ) {
				expect(err.message).to.equal("Subscript indices must either be real positive integers or logicals");
			}
		});
		it("Should throw an error if index is larger than array length",() =>{
			try{
				wasmInstance.get_array_index_i32(head_nd,1441,232);
				expect("I did not throw error").to.equal("I threw error");
			}catch( err ) {
				expect(err.message).to.equal("Index exceeds matrix dimensions");
			}
		});


	});
	describe("#get_array", ()=>{
		it('should throw an error when an accessing index is 0 or less than 0 ', function () {

		});
		it('should throw an error when the dimensions of the accessing cell of array is one the accessing index' +
			'  inside that array is more than the length of the actual array ', function () {

		});
		it('should throw error if a dimension index is larger than the length of that particular dimension', function () {

		});
	});
	describe("#set_elem_array_index_NS", () => {

		let memory;
		let arr_1d;
		let arr_header_nd;
		let arr_data_nd;
		let head_nd;
		let data_nd;
		let printErrorSpy;
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
			data_nd = wasmInstance.get_array_start(head_nd);
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
			console.log(a);
			wasmInstance.set_array_index_i32(head_nd, 1,2);
			wasmInstance.set_array_index_i32(head_nd, 2,4);
			wasmInstance.set_array_index_i32(head_nd, 3,123);
			wasmInstance.set_array_index_i32(head_nd, 4,12312);
			// expect(Array.from(arr_data_nd)).to.deep.equal([2,4,123,12312])
		});

	});
});
