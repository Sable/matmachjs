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
describe('Array Properties', () => {
    beforeEach(async ()=>{
        wi= await WebAssembly.instantiate(file,libjs);
        wi = wi.instance.exports;
        memory = wi.mem;
    });
    describe("#numel", ()=> {
	    it('should throw error when no input is passed', function () {
		    try{
			    console.log(wi.numel(-1));
			    expect(1+1).to.equal(3)
		    }catch(err)
		    {
			    expect(err.message).to.equal("Not enough input arguments.");
		    }
	    });
	    describe('#create_mxvector', () => {
            it('should output the right number of elements', () => {
                let arr = wi.create_mxvector(4);
                expect(wi.numel(arr)).to.equal(4);
                arr = wi.create_mxvector(20);
                expect(wi.numel(arr)).to.equal(20);
                arr = wi.create_mxvector(0);
                expect(wi.numel(arr)).to.equal(0);
                arr = wi.create_mxvector(-1);
                expect(wi.numel(arr)).to.equal(0);
            });
        });
        describe('#create_mxarray', () => {
            it('should output the right number of elements', () => {
                let arr = wi.create_mxvector(4);
                wi.set_array_index_f64(arr,1,10);
                wi.set_array_index_f64(arr,2,10);
                wi.set_array_index_f64(arr,3,10);
                wi.set_array_index_f64(arr,4,10);
                arr = wi.create_mxarray_ND(arr);
                expect(wi.numel(arr)).to.equal(10000);
                arr = wi.create_mxvector(4);
                arr = wi.create_mxarray_ND(arr);
                expect(wi.numel(arr)).to.equal(0);
                arr = wi.create_mxvector(5);
                wi.set_array_index_f64(arr,1,10);
                wi.set_array_index_f64(arr,2,10);
                wi.set_array_index_f64(arr,3,10);
                wi.set_array_index_f64(arr,4,10);
                arr = wi.create_mxarray_ND(arr);
                expect(wi.numel(arr)).to.equal(0);
                
            });
      
        });
        
    });
    describe('#size',  ()=> {
    	it("should throw error when input is -1",()=>{
    		try{
			    console.log(wi.size(-1));
			    expect(1+1).to.equal(3)
		    }catch(err)
		    {
			    expect(err.message).to.equal("Not enough input arguments.");
		    }
	    });
        it("should return correct size for different matrices", ()=>{
            let arr = wi.create_mxvector(4);
            let size_arr = wi.size(arr);
	        expect(wi.numel(size_arr)).to.equal(2);
	        expect(wi.get_array_index_f64(size_arr, 1)).to.equal(1);
	        expect(wi.get_array_index_f64(size_arr, 2)).to.equal(4);
        });
	    it("should return correct output for different matrices", ()=>{
		    let arr = wi.create_mxvector(-1);
		    let size_arr = wi.size(arr);
		    expect(wi.numel(size_arr)).to.equal(2);
		    expect(wi.get_array_index_f64(size_arr, 1)).to.equal(1);
		    expect(wi.get_array_index_f64(size_arr, 2)).to.equal(0);
		    arr = wi.create_mxvector(-1,0,0,1,0);
		    size_arr = wi.size(arr);
		    expect(wi.numel(size_arr)).to.equal(2);
		    expect(wi.get_array_index_f64(size_arr, 1)).to.equal(0);
		    expect(wi.get_array_index_f64(size_arr, 2)).to.equal(1);
	    });

    });

    describe('#length', () => {
        it('should throw error on -1 input', () => {
	        try{
		        wi.length(-1);
		        expect(1+1).to.equal(3);
	        }catch(err)
	        {
		        expect(err.message).to.equal("Not enough input arguments.");
	        }

        });
        it('should return maximum dim size array for normal vectors', () => {
            expect(wi.length(wi.create_mxvector(5))).to.equal(5);
	        expect(wi.length(wi.create_mxvector(5,0,0,0,-1))).to.equal(5);
	        expect(wi.length(wi.create_mxvector(-1,0,0,0,-1))).to.equal(1);
	        expect(wi.length(wi.create_mxvector(1,0,0,0,-1))).to.equal(1);

        });
	    it('should return maximum dim size array for normal arrays', () => {
		    let dim_arr = wi.create_mxvector(3);
		    wi.set_array_index_f64(dim_arr, 1, 20);
		    wi.set_array_index_f64(dim_arr, 2, 100);
		    wi.set_array_index_f64(dim_arr, 3, 20);
		    let arr = wi.create_mxarray_ND(dim_arr);
		    expect(wi.length(wi.create_mxarray_ND(wi.create_mxvector(5)))).to.equal(0);
		    expect(wi.length(arr)).to.equal(100);
	    });
	    it('should return maximum dim size array for structs', () => {
 		    expect(wi.length(wi.create_mxvector(3,3))).to.equal(3);


	    });
	    it('should return maximum dim size array for cell_arrays', () => {
		    expect(wi.length(wi.create_mxvector(20,2))).to.equal(20);

	    });
    });     
    describe('#isrow', function () {
        it("should return true when row vector of size 0x1", ()=>{
            let arr_pointer = wi.create_mxvector(0);
            let arr = new Int32Array(memory.buffer, arr_pointer, 6);
            expect(wi.isrow(arr_pointer)).to.equal(1);
        });
        it("should return true when row vector is created", ()=>{
               let arr_pointer = wi.create_mxvector(5,0);
               expect(wi.isrow(arr_pointer)).to.equal(1);
        });
        it("should return false if is not row vector", ()=>{
            let arr_pointer = wi.create_mxvector(5,0,0,1,0);
            expect(wi.isrow(arr_pointer)).to.equal(0);
        });
    });
    describe('#iscolumn', () => {
        it('should throw error if input is null', () => {
	        try{
		        wi.iscolumn(-1);
	        }catch(err){
				expect(err.message).to.equal("Not enough input arguments.")
	        }
        });
        it('should return 0 if input is 1xn', () => {
	        let arr_pointer = wi.create_mxvector(5);
	        let size_ptr = wi.size(arr_pointer);
	        expect(wi.iscolumn(arr_pointer)).to.equal(0);
        });
	    it('should return 1 if input is nx1', () => {
		    let arr_pointer = wi.create_mxvector(5,0,0,1,0);
		    expect(wi.iscolumn(arr_pointer)).to.equal(1);
	    });
	    it('should return 1 if input is 1xn for an mxarray', () => {
		    let arr_pointer = wi.create_mxvector(2);
		    wi.set_array_index_f64(arr_pointer,1,5);
		    wi.set_array_index_f64(arr_pointer,2,1);
		    let matrix_ptr = wi.create_mxarray_ND(arr_pointer);
		    expect(wi.iscolumn(matrix_ptr)).to.equal(1);
	    });
        it('should return 0 if input is matrix', () => {
	        let arr_pointer = wi.create_mxvector(2);
	        wi.set_array_index_f64(arr_pointer,1,2);
	        wi.set_array_index_f64(arr_pointer,2,3);
	        let matrix_ptr = wi.create_mxarray_ND(arr_pointer);
	        expect(wi.iscolumn(matrix_ptr)).to.equal(0);
        });
        it('should return 0 if input is 0x0', () => {
	        let arr_pointer = wi.create_mxvector(2);
	        let matrix_ptr = wi.create_mxarray_ND(arr_pointer);
	        expect(wi.iscolumn(matrix_ptr)).to.equal(0);
        });
    });
    describe('#isvector', () => {
        it('should throw error if input is null', () => {
	        try{
		        wi.isvector(-1);
	        }catch(err){
		        expect(err.message).to.equal("Not enough input arguments.")
	        }
        });
	    it('should return 1 if input is 1xn', () => {
		    let arr_pointer = wi.create_mxvector(5);
		    let size_ptr = wi.size(arr_pointer);
		    expect(wi.isvector(arr_pointer)).to.equal(1);
	    });
	    it('should return 1 if input is nx1', () => {
		    let arr_pointer = wi.create_mxvector(5,0,0,0,1);
		    expect(wi.isvector(arr_pointer)).to.equal(1);
	    });
	    it('should return 0 if dim > 2', () => {
		    let arr_pointer = wi.create_mxvector(3);
		    wi.set_array_index_f64(arr_pointer,1,5);
		    wi.set_array_index_f64(arr_pointer,2,1);
		    let matrix_ptr = wi.create_mxarray_ND(arr_pointer);
		    expect(wi.isvector(matrix_ptr)).to.equal(0);
	    });
	    it('should return 0 if nxm where, n & m are both larger than 1', () => {
		    let arr_pointer = wi.create_mxvector(3);
		    wi.set_array_index_f64(arr_pointer,1,5);
		    wi.set_array_index_f64(arr_pointer,2,5);
		    let matrix_ptr = wi.create_mxarray_ND(arr_pointer);
		    expect(wi.isvector(matrix_ptr)).to.equal(0);
	    });
        it('should return 0 if input is 0x0', () => {
	        let arr_pointer = wi.create_mxvector(2);
	        let matrix_ptr = wi.create_mxarray_ND(arr_pointer);
	        expect(wi.isvector(matrix_ptr)).to.equal(0);
        });
    });
    describe('#ismatrix', () => {
        it('should throw error if input is null', () => {
	        try{
		        wi.ismatrix(-1);
	        }catch(err){
		        expect(err.message).to.equal("Not enough input arguments.")
	        }
        });
        it('should return 1 if input is mxn, where m & n>=0', () => {
	        let arr_pointer = wi.create_mxvector(2);
	        wi.set_array_index_f64(arr_pointer,1,5);
	        wi.set_array_index_f64(arr_pointer,2,5);
	        let matrix_ptr = wi.create_mxarray_ND(arr_pointer);
	        expect(wi.ismatrix(matrix_ptr)).to.equal(1);
        });
        it('should return 0 if more than 2 dim', () => {
	        let arr_pointer = wi.create_mxvector(3);
	        wi.set_array_index_f64(arr_pointer,1,5);
	        wi.set_array_index_f64(arr_pointer,2,5);
	        let matrix_ptr = wi.create_mxarray_ND(arr_pointer);
	        expect(wi.ismatrix(matrix_ptr)).to.equal(0);
        });
    });
    describe('#isempty', () => {
        it('should throw error if input is null', () => {
	        try{
		        wi.isempty(-1);
	        }catch(err){
		        expect(err.message).to.equal("Not enough input arguments.")
	        }
        });
        it('should return 1 if input is has more than 1 element', () => {
	        let arr_pointer = wi.create_mxvector(4);
	        expect(wi.isempty(arr_pointer)).to.equal(0);
        });
	    it('should return 1 if input is  0x0x0x0', () => {
		    let arr_pointer = wi.create_mxvector(4);
		    let matrix_ptr = wi.create_mxarray_ND(arr_pointer);
		    expect(wi.isempty(matrix_ptr)).to.equal(1);
	    });
        it('should return 1 if input is 0x1', () => {
	        let arr_pointer = wi.create_mxvector(0);
	        expect(wi.isempty(arr_pointer)).to.equal(1);
        });
	    it('should return 1 if input is 1x0', () => {
		    let arr_pointer = wi.create_mxvector(0,0,0,0,1);
		    expect(wi.isempty(arr_pointer)).to.equal(1);
	    });
    });
});


