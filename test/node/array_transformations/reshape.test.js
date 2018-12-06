
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

const { MxNDArray, MxVector } = require(path.join(__dirname,"../../../bin/classes/Runtime.js"));

const file = fs.readFileSync(path.join(__dirname,"../../../")+"/bin/matmachjs.wasm");
let wi;
let memory;

describe('Array Transformations', () => {
    beforeEach(async () => {
		libjs.js.mem = new WebAssembly.Memory({initial: 1});
		wi = await WebAssembly.instantiate(file, libjs);
		wi = wi.instance.exports;
		memory = wi.mem;
    });
    describe('#reshape', () => {
        it('should throw error when a arr_ptr parameter is null', () => {
            try{
                wi.reshape();
                expect("wi.reshape").to.equal("fail");
            }catch(err)
            {
                expect(err.message).to.equal("Not enough input arguments.");
            }
            try{
                wi.reshape(1231,0);
                expect("wi.reshape").to.equal("fail");
            }catch(err)
            {
                expect(err.message).to.equal("Not enough input arguments.");
            }
            try{
                wi.reshape(0,21312);
                expect("wi.reshape").to.equal("fail");
            }catch(err)
            {
                expect(err.message).to.equal("Not enough input arguments.");
            }
        });
        it("should throw error if resize dimensions are not a row vector", ()=>{
            let dim_ptr = wi.create_mxvector(3);
            wi.set_array_index_f64(dim_ptr, 1, 3);
            wi.set_array_index_f64(dim_ptr, 2, 7);
            wi.set_array_index_f64(dim_ptr, 3, 2);
            let arr_ptr = wi.create_mxarray_ND(dim_ptr);
            let new_dim_ptr = wi.create_mxvector(2,0,0,1,0);
            wi.set_array_index_f64(dim_ptr, 1, 21);
            wi.set_array_index_f64(dim_ptr, 2, 2);
            try{
                arr_ptr = wi.reshape(arr_ptr, new_dim_ptr);
                expect("wi.reshape").to.equal("fail");
            }catch(err){
                expect(err.message).to.equal("Size vector should be a row vector with real elements.");
            }
        });
        it('should throw error if length of new shape does not match the length of the array', () => {
            let dim_ptr = wi.create_mxvector(3);
            wi.set_array_index_f64(dim_ptr, 1, 3);
            wi.set_array_index_f64(dim_ptr, 2, 7);
            wi.set_array_index_f64(dim_ptr, 3, 2);
            let arr_ptr = wi.create_mxarray_ND(dim_ptr);
            let new_dim_ptr = wi.create_mxvector(2);
            wi.set_array_index_f64(new_dim_ptr, 1, 21);
            wi.set_array_index_f64(new_dim_ptr, 2, 1);
            try{
                wi.reshape(arr_ptr, new_dim_ptr);
                expect("reshape").to.equal("fail");
            }catch(err){
                expect(err.message).to.equal("To RESHAPE the number of elements must not change.");
            }
        });
        it('should return correctly [21,2] array on data, when given [3,7,2], [21,2] as input' ,()=>{
            let dim_ptr = wi.create_mxvector(3);
            wi.set_array_index_f64(dim_ptr, 1, 3);
            wi.set_array_index_f64(dim_ptr, 2, 7);
            wi.set_array_index_f64(dim_ptr, 3, 2);
            let arr_ptr = wi.create_mxarray_ND(dim_ptr);
            let new_dim_ptr = wi.create_mxvector(2);
            wi.set_array_index_f64(new_dim_ptr, 1, 21);
            wi.set_array_index_f64(new_dim_ptr, 2, 2);
            let new_arr = wi.reshape(arr_ptr, new_dim_ptr);
            expect(wi.numel(new_arr)).to.equal(42);
            expect(wi.ndims(new_arr)).to.equal(2);
            let size_ptr = wi.size(new_arr);
            expect(Array.from(new Float64Array(memory.buffer, wi.mxarray_core_get_array_ptr(size_ptr), wi.numel(size_ptr))))
                .to.deep.equal([21,2]);
        });
        it("should return a 1x4 array for a 2x2 despite giving as reshape input 1x4x1x1x1", ()=>{
            var arr = new MxNDArray(wi, [2,2]);
	        var vec = new MxVector(wi, 5);
            vec.set_indices([[1,2,3,4,5]],[1,4,1,1,1]);
	        wi.reshape(arr._arr_ptr, vec._arr_ptr);
	        expect(Array.from(arr.size().getContents())).to.deep.equal([1,4]);
        });
    });

});