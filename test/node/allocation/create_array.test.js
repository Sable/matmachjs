/**
 * This script will test the following functions:
 * create_array_1d, malloc, zeroesnxn, init_array
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
let wi; // wasmInstance
let memory;
let malloc;

describe('Allocate Matlab Arrays', () => {
    describe("#create_mxvector",()=>{
        beforeEach(async ()=>{
            wi= await WebAssembly.instantiate(file,libjs);
            wi = wi.instance.exports;
            memory = wi.mem;
        });
        it("should create an empty array correctly", ()=>{
            let arr = wi.create_mxvector(0);
	        expect(wi.numel(arr)).to.equal(0);
	        expect(wi.mxarray_core_get_mclass(arr)).to.equal(0);
	        expect(wi.mxarray_core_get_simple_class(arr)).to.equal(0);
	        expect(wi.ndims(arr)).to.equal(2);
	        expect(wi.isscalar(arr)).to.equal(0);
            let size_arr = wi.size(arr);
	        expect(wi.get_array_index_f64(size_arr, 1)).to.equal(1);
	        expect(wi.get_array_index_f64(size_arr, 2)).to.equal(0);
        });


        
	    it("Should set other meta data correctly",()=>{
            let arr_8 = new Int8Array(wi.mem.buffer);
            let arr_pointer = wi.create_mxvector(5,0);
            expect([ arr_8[arr_pointer + 24],arr_8[arr_pointer + 25]]).to.deep.equal([0,0]);
        });
        it('Should set dimensions correctly', () => {
            let arr_pointer = wi.create_mxvector(5);
            
            let arr = new Int32Array(wi.mem.buffer,arr_pointer);
            let dim_ptr = arr[4];
            let arr_f64 = new Float64Array(wi.mem.buffer, dim_ptr, 4);
            expect([arr_f64[0],arr_f64[1]]).to.deep.equal([1,5]);
            // Testing transpose
            arr_pointer = wi.create_mxvector(5,0,0,1,0);

            arr = new Int32Array(wi.mem.buffer,arr_pointer);
             dim_ptr = arr[4];
             arr_f64 = new Float64Array(wi.mem.buffer, dim_ptr, 4);
            expect([arr_f64[0],arr_f64[1]]).to.deep.equal([5,1]);

        });

        it("Should create array and set the length should be set appropriately",()=>{
            let array = wi.create_mxvector(10,0);
            expect(wi.mxarray_core_get_array_length(array)).to.be.equal(10);
            let array2 = wi.create_mxvector(20,0);
            expect(wi.mxarray_core_get_array_length(array2)).to.be.equal(20);
        });
    
        it("Should correctly give dimensions",()=>{
            let array = wi.create_mxvector(10,0);
            expect(wi.ndims(array)).to.be.equal(2);
            let array2 = wi.create_mxvector(20,0);
            expect(wi.ndims(array2)).to.be.equal(2);
        });
    });
    describe("#get_mxarray_dimension_number", ()=>{
        beforeEach(async ()=>{
            libjs.js.mem = new WebAssembly.Memory({initial:1});
            wi= await WebAssembly.instantiate(file,libjs);
            wi = wi.instance.exports;
            memory = wi.mem;
            malloc = wi.malloc;

        });
        it("should return 1 when the input is 1", ()=>{
            let arr = wi.create_mxvector(1);
            wi.set_array_index_f64(arr,1,1);
            let dim_num = wi.get_mxarray_dimension_number(arr);
            expect(dim_num).to.equal(1);
        });
        it('should return the same number of none of the last dimensions are one', () => {
            let arr = wi.create_mxvector(5);
            wi.set_array_index_f64(arr,1,10);
            wi.set_array_index_f64(arr,2,2);
            wi.set_array_index_f64(arr,3,3);
            wi.set_array_index_f64(arr,4,4);
            wi.set_array_index_f64(arr,5,5);
            let dim_num = wi.get_mxarray_dimension_number(arr);
            expect(dim_num).to.equal(5);
        });
        it('should return the same number if some dimensions are zero', () => {
            let arr = wi.create_mxvector(5);
            wi.set_array_index_f64(arr,1,4);
            let dim_num = wi.get_mxarray_dimension_number(arr);
            expect(dim_num).to.equal(5);
        });
        it('should return 1 if the dimensions are less than 2', () => {
            let arr = wi.create_mxvector(1);
            wi.set_array_index_f64(arr,1,10);
            let dim_num = wi.get_mxarray_dimension_number(arr);
            expect(dim_num).to.equal(1);
        });
         it('should return the 4 if the dimensions after the fourth one are all 1', () => {
            let arr = wi.create_mxvector(8);
            wi.set_array_index_f64(arr,1,10);
            wi.set_array_index_f64(arr,2,10);
            wi.set_array_index_f64(arr,3,10);
            wi.set_array_index_f64(arr,4,0);
            wi.set_array_index_f64(arr,5,1);
            wi.set_array_index_f64(arr,6,1);
            wi.set_array_index_f64(arr,7,1);
            wi.set_array_index_f64(arr,8,1);
            let dim_num = wi.get_mxarray_dimension_number(arr);
            expect(dim_num).to.equal(4);
        });
	    it('should return the 6 after dimension 6th is 0', () => {
		    let arr = wi.create_mxvector(8);
		    wi.set_array_index_f64(arr,1,10);
		    wi.set_array_index_f64(arr,2,10);
		    wi.set_array_index_f64(arr,3,10);
		    wi.set_array_index_f64(arr,4,0);
		    wi.set_array_index_f64(arr,5,1);
		    wi.set_array_index_f64(arr,6,0);
		    wi.set_array_index_f64(arr,7,1);
		    wi.set_array_index_f64(arr,8,1);
		    let dim_num = wi.get_mxarray_dimension_number(arr);
		    expect(dim_num).to.equal(6);
	    });
    });
    describe("#mxarray_core_get_simple_class_byte_size",()=>{
        let mxarray_core_get_simple_class_byte_size;
        beforeEach(async ()=>{
            libjs.js.mem = new WebAssembly.Memory({initial:1});
            wi= await WebAssembly.instantiate(file,libjs );
            wi = wi.instance.exports;
            memory = wi.mem;
            mxarray_core_get_simple_class_byte_size = wi.mxarray_core_get_simple_class_byte_size;
    
            // console.log(wi)
        });
        it("Should give the correct size for a given type",()=>{
            expect(mxarray_core_get_simple_class_byte_size(0)).to.equal(8);//Double
            expect(mxarray_core_get_simple_class_byte_size(1)).to.equal(4);//single
            expect(mxarray_core_get_simple_class_byte_size(2)).to.equal(2);//int16
            expect(mxarray_core_get_simple_class_byte_size(3)).to.equal(1);//int8
            expect(mxarray_core_get_simple_class_byte_size(4)).to.equal(8);//int64
            expect(mxarray_core_get_simple_class_byte_size(5)).to.equal(4);//int32
            expect(mxarray_core_get_simple_class_byte_size(6)).to.equal(2);//uint16
            expect(mxarray_core_get_simple_class_byte_size(7)).to.equal(1);//uint8
            expect(mxarray_core_get_simple_class_byte_size(8)).to.equal(8);//uint64
            expect(mxarray_core_get_simple_class_byte_size(9)).to.equal(4);//uint32
            expect(mxarray_core_get_simple_class_byte_size(11)).to.equal(1);//char
            expect(mxarray_core_get_simple_class_byte_size(13)).to.equal(4);//string
            expect(mxarray_core_get_simple_class_byte_size(15)).to.equal(1);//logical
        });
        it("Should create cell array correctly", ()=>{

        });
    });



    describe("#create_array",()=>{
        let create_array;
        let create_mxarray_ND;
        beforeEach(async ()=>{
	        wi= await WebAssembly.instantiate(file,libjs);
            wi = wi.instance.exports;
	        memory = wi.mem;
        });
	    it("should create an empty array correctly", ()=>{
		    let arr = wi.create_mxvector(0);
		    let arr_size = wi.numel(arr);
		    expect(wi.numel(arr)).to.equal(0);
		    expect(wi.mxarray_core_get_mclass(arr)).to.equal(0);
		    expect(wi.mxarray_core_get_simple_class(arr)).to.equal(0);
		    expect(wi.ndims(arr)).to.equal(2);
		    expect(wi.isscalar(arr)).to.equal(0);
		    let size_arr = wi.size(arr);
		    expect(wi.get_array_index_f64(size_arr, 1)).to.equal(1);
		    expect(wi.get_array_index_f64(size_arr, 2)).to.equal(0);
	    });
        it('should throw error if input is not a row vector',  () => {
            let arr_1d = wi.create_mxvector(4,0,0,1,0);
		    wi.set_array_index_f64(arr_1d, 1,30);
		    wi.set_array_index_f64(arr_1d, 2,2);
		    wi.set_array_index_f64(arr_1d, 3,4);
            wi.set_array_index_f64(arr_1d, 4,6);
            // console.log(wi.is_row_vector(arr_1d));
            // libjs.js.printString(2560, 1031);

	        try {
                wi.create_mxarray_ND(arr_1d);

                expect(1+1).to.throw(3);
            }catch(err)
            {
                expect(err.message).to.equal("Size vector should be a row vector with real elements.");
            }
        });
        it('should return 4 dimensions when given [2,3,5,2,1,1,1,1]', () => {
            let arr_1d = wi.create_mxvector(8);
		    wi.set_array_index_f64(arr_1d, 1,2);
		    wi.set_array_index_f64(arr_1d, 2,3);
		    wi.set_array_index_f64(arr_1d, 3,5);
            wi.set_array_index_f64(arr_1d, 4,2);
            wi.set_array_index_f64(arr_1d, 5,1);
            wi.set_array_index_f64(arr_1d, 6,1);
            wi.set_array_index_f64(arr_1d, 7,1);
            wi.set_array_index_f64(arr_1d, 8,1);
            // console.log(wi.is_row_vector(arr_1d));
            let arr = wi.create_mxarray_ND(arr_1d);
            expect(wi.ndims(arr)).to.equal(4);
        });
        it("should check that dim array is f64 for now", ()=>{ // F64 Hardcode

        });
        it("should create square matrix if input array has size 1", () => {
            let arr_1d = wi.create_mxvector(1);
            wi.set_array_index_f64(arr_1d, 1,2);
            let arr = wi.create_mxarray_ND(arr_1d);
            let arr_size = wi.size(arr);
            expect([wi.get_array_index_f64(arr_size,1),wi.get_array_index_f64(arr_size,2)]).to.deep.equal([2,2]);
        });
        it('should set the number of elements correctly for normal case', () => {
            let arr_1d = wi.create_mxvector(4);
            wi.set_array_index_f64(arr_1d, 1,2);
            wi.set_array_index_f64(arr_1d, 2,2);
            wi.set_array_index_f64(arr_1d, 3,2);
            wi.set_array_index_f64(arr_1d, 4,2);
            let arr = wi.create_mxarray_ND(arr_1d);
            expect(wi.numel(arr)).to.equal(16);
        });
        it('should set the number of elements correctly for square matrix', () => {
            let arr_1d = wi.create_mxvector(1);
            wi.set_array_index_f64(arr_1d, 1,3);
            expect(wi.numel(wi.create_mxarray_ND(arr_1d))).to.deep.equal(9);
        });
        it('should set the number of elements correctly for zero input',() => {
            let arr_1d = wi.create_mxvector(4);
            let arr = wi.create_mxarray_ND(arr_1d);
	        let arr_size = wi.size(arr);
	        expect(wi.ndims(arr)).to.equal(4);
	        expect(wi.numel(arr)).to.equal(0);
	        expect(wi.get_array_index_f64(arr_size,1)).to.equal(0);
	        expect(wi.get_array_index_f64(arr_size,2)).to.equal(0);
	        expect(wi.get_array_index_f64(arr_size,3)).to.equal(0);
	        expect(wi.get_array_index_f64(arr_size,4)).to.equal(0);
        });
	    it('Should correctly set array header',  () => {
            let arr_1d = wi.create_mxvector(4);
		    let arr_header = new Int32Array(memory.buffer, arr_1d, 6);
		    let arr_data = new Float64Array(memory.buffer, wi.mxarray_core_get_array_ptr(arr_1d), 4);
		    wi.set_array_index_f64(arr_1d, 1,30);
		    wi.set_array_index_f64(arr_1d, 2,2);
		    wi.set_array_index_f64(arr_1d, 3,4);
            wi.set_array_index_f64(arr_1d, 4,6);
            let arr_nd = wi.create_mxarray_ND(arr_1d);
		    let arr_header_nd = new Int32Array(memory.buffer, arr_nd, 6);
		    expect(arr_header_nd[1]).to.equal(1440); // Total array length
		    expect(arr_header_nd[3]).to.equal(4); // Number of dimensions
	    });
		it('should return correct strides [1,2] for C order [30,2,4,6] array ',()=>{
			let arr_1d = wi.create_mxvector(4);
			wi.set_array_index_f64(arr_1d, 1,30);
			wi.set_array_index_f64(arr_1d, 2,2);
			wi.set_array_index_f64(arr_1d, 3,4);
			wi.set_array_index_f64(arr_1d, 4,6);
			let arr_nd = wi.create_mxarray_ND(arr_1d);
			let attr = new Int8Array(memory.buffer, arr_nd + 24, 1);
			let arr_header_nd = new Int32Array(memory.buffer, arr_nd, 7);
			let strides = new Float64Array(memory.buffer, arr_header_nd[5], 4);
			expect(Array.from(strides)).to.deep.equal([1,30,60,240]);
			expect(attr[0]).to.equal(0);
			
		});

    });

});
