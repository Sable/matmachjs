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
let wi;
let memory;

describe('Array Properties', () => {
    beforeEach(async ()=>{
        libjs.js.mem = WebAssembly.Memory({initial:1});
        wi= await WebAssembly.instantiate(file,libjs);
        wi = wi.instance.exports;
        memory = wi.mem;

    });
    describe('#size', function () {
        it("should return correct output for different matrices", ()=>{
            let arr = wi.create_mxvector(4);
            let arr_f64 = new Int32Array(memory.buffer, arr, 6);
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
		    arr = wi.create_mxvector(-1,0,0,0,1);
		    size_arr = wi.size(arr);
		    expect(wi.numel(size_arr)).to.equal(2);
		    expect(wi.get_array_index_f64(size_arr, 1)).to.equal(0);
		    expect(wi.get_array_index_f64(size_arr, 2)).to.equal(1);
	    });
    });
    describe('#is_row_vector', function () {
        it("should return true when row vector of size 0x1", ()=>{
            let arr_pointer = wi.create_mxvector(0);
            let arr = new Int32Array(memory.buffer, arr_pointer, 6);
            expect(wi.is_row_vector(arr_pointer)).to.equal(1);
        });
        it("should return true when row vector is created", ()=>{
               let arr_pointer = wi.create_mxvector(5,0);
               expect(wi.is_row_vector(arr_pointer)).to.equal(1);
        });
        it("should return false if is not row vector", ()=>{
            let arr_pointer = wi.create_mxvector(5,0,0,0,1);
            expect(wi.is_row_vector(arr_pointer)).to.equal(0);
        });
    });
});


