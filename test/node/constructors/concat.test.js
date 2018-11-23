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
const { MxNDArray, MatlabRuntime} = require(path.join(__dirname,"../../../bin/classes/Runtime.js"));

let wi;
let mr;
let memory;
describe('Concatanation Module', () => {

    describe('#verify_input_and_instantiate_result_concatation(dim, input_matrices)', () => {
	    beforeEach(async ()=>{
		    wi= await WebAssembly.instantiate(file,libjs);
		    wi = wi.instance.exports;
		    memory = wi.mem;
		    mr = new MatlabRuntime(wi);
	    });
        it('should return empty matrix if there are no input matrices', () => {
	        let arr = new MxNDArray(wi, wi.verify_input_and_instantiate_result_concatation(1));
	        expect(Array.from(arr.size().getContents())).to.deep.equal([0,0]);
	        expect(arr.numel()).to.equal(0);
        });
        it('should throw error if dim input is less than 1', () => {
           try{
	           let arr_res = new MxNDArray(wi, wi.verify_input_and_instantiate_result_concatation(-2));
	           expect(1+1).to.equal(3);
           }catch(err){
                expect(err.message).to.equal("Concatanating dimension must be larger than 0");
           }
        });
        it('should throw error when concatanating dimension is larger than the shape of inputs', () => {
            let arr1 = new MxNDArray(wi,[3,7,2,2]);
		    let arr2 = new MxNDArray(wi,[3,7,2,2,4]);
		    let input_args = wi.create_mxvector(2,5);
		    wi.set_array_index_i32(input_args,1,arr1._arr_ptr);
		    wi.set_array_index_i32(input_args,2,arr2._arr_ptr);
		    try{
			    let arr_res = new MxNDArray(wi, wi.verify_input_and_instantiate_result_concatation(7,input_args));
			    expect(1+1).to.equal(3);
		    }catch(err) {
			    expect(err.message).to.equal("Concatanating dimension larger than the input arguments dimensions.");
		    }
        });
        it('should return empty matrix with 0x0, if matrices passed are 0x0,0x0', () => {
            let arr1 = new MxNDArray(wi,[0,0]);
	        let arr2 = new MxNDArray(wi,[0,0]);
	        let input_args = wi.create_mxvector(2,5);
	        wi.set_array_index_i32(input_args,1,arr1._arr_ptr);
	        wi.set_array_index_i32(input_args,2,arr2._arr_ptr);
	        let arr_res = new MxNDArray(wi, wi.verify_input_and_instantiate_result_concatation(1,input_args));
	        expect(Array.from(arr_res.size().getContents())).to.deep.equal([0,0]);
	        expect(arr_res.numel()).to.equal(0);
        });
        it('should throw error when the shape length of '+
        'some input arguments are inconsistent with the res',()=>{
	        let arr1 = new MxNDArray(wi,[3,7,2,2]);
	        let arr2 = new MxNDArray(wi,[3,7,2,2,4]);
	        let input_args = wi.create_mxvector(2,5);
	        wi.set_array_index_i32(input_args,1,arr1._arr_ptr);
	        wi.set_array_index_i32(input_args,2,arr2._arr_ptr);
	        try{
	            let arr_res = new MxNDArray(wi, wi.verify_input_and_instantiate_result_concatation(2,input_args));
	            expect(1+1).to.equal(3);
            }catch(err) {
	            expect(err.message).to.equal("Dimensions of matrices being concatenated are not consistent.");
            }
        });
        it('should throw error if any of the input'+
        'matrices have a different length for a particular dimension that is'+
        'different from the concatanating dimension', () => {
	        let arr1 = new MxNDArray(wi,[3,7,2,2]);
	        let arr2 = new MxNDArray(wi,[4,15,2,2]);
	        let input_args = wi.create_mxvector(2,5);
	        wi.set_array_index_i32(input_args,1,arr1._arr_ptr);
	        wi.set_array_index_i32(input_args,2,arr2._arr_ptr);
	        try{
		        let arr_res = new MxNDArray(wi, wi.verify_input_and_instantiate_result_concatation(2, input_args));
		        expect(1+1).to.equal(3);
	        }catch(err) {
		        expect(err.message).to.equal("Dimensions of matrices being concatenated are not consistent.");
	        }
        });
        it('should correctly return [8,2], if given, [2,2],[5,2],[1,2] and dim = 1', () => {
	        let arr1 = new MxNDArray(wi,[2,2]);
	        let arr2 = new MxNDArray(wi,[5,2]);
	        let arr3 = new MxNDArray(wi,[1,2]);
	        let input_args = wi.create_mxvector(3,5);
	        wi.set_array_index_i32(input_args,1,arr1._arr_ptr);
	        wi.set_array_index_i32(input_args,2,arr2._arr_ptr);
	        wi.set_array_index_i32(input_args,3,arr3._arr_ptr);
	        let arr_res = new MxNDArray(wi, wi.verify_input_and_instantiate_result_concatation(1, input_args));
	        expect(Array.from(arr_res.size().getContents())).to.deep.equal([8,2]);
	        expect(arr_res.numel()).to.equal(16);
        });
        it('should correctly return [5,52,3], if given, [5,30,3],[5,22,3] and dim = 2', () => {
	        let arr1 = new MxNDArray(wi,[5,30,3]);
	        let arr2 = new MxNDArray(wi,[5,22,3]);
	        let input_args = wi.create_mxvector(2,5);
	        wi.set_array_index_i32(input_args,1,arr1._arr_ptr);
	        wi.set_array_index_i32(input_args,2,arr2._arr_ptr);
	        let arr_res = new MxNDArray(wi, wi.verify_input_and_instantiate_result_concatation(2, input_args));
	        expect(Array.from(arr_res.size().getContents())).to.deep.equal([5,52,3]);
	        expect(arr_res.numel()).to.equal(780);
        });
        it('should correctly return [5,52,3], if given, [5,52,3] and dim = 1', () => {
	        let arr1 = new MxNDArray(wi,[5,52,3]);
	        let input_args = wi.create_mxvector(1,5);
	        wi.set_array_index_i32(input_args,1,arr1._arr_ptr);
	        let arr_res = new MxNDArray(wi, wi.verify_input_and_instantiate_result_concatation(2, input_args));
	        expect(Array.from(arr_res.size().getContents())).to.deep.equal([5,52,3]);
	        expect(arr_res.numel()).to.equal(780);
        });
    });
	describe('#concat', () => {
		// Verifies input
		beforeEach(async ()=>{
			wi= await WebAssembly.instantiate(file,libjs);
			wi = wi.instance.exports;
			memory = wi.mem;
			mr = new MatlabRuntime(wi);
		});
        it('should return correct result for matrices [1,2], [2,2], [5,2] to result in a [8,2] when dim is 1',()=>{
            let arr = mr.colon(7,16);
            arr = mr.reshape(arr, [5,2]);
            let arr2 = new MxNDArray(wi, [1,2]);
            arr2.set_indices([[1,2]],[1,2]);
	        let arr3 = new MxNDArray(wi, [2,2]);
	        arr3.set_indices([[1,2,3,4]],[3,4,5,6]);
	        let res = mr.concat(1,[ arr2, arr3,arr]);
	        expect(Array.from(res.getContents()))
		        .to.deep.equal([ 1, 3, 4, 7, 8, 9, 10, 11, 2, 5, 6, 12, 13, 14, 15, 16 ]);
			expect(Array.from(res.size().getContents())).to.deep.equal([8,2]);
        });
	});
	describe("#horzcat", ()=>{
		// Verifies input
		beforeEach(async ()=>{
			wi= await WebAssembly.instantiate(file,libjs);
			wi = wi.instance.exports;
			memory = wi.mem;
			mr = new MatlabRuntime(wi);
		});
		it('should return correct result for ', () => {
			let arr = mr.colon(11,20);
			arr = mr.reshape(arr, [2,5]);
			let arr2 = new MxNDArray(wi, [2,3]);
			arr2.set_indices([[1,2,3,4,5,6]],[1,2,3,4,5,6]);
			let arr3 = new MxNDArray(wi, [2,2]);
			arr3.set_indices([[1,2,3,4]],[7,8,9,10]);
			let res = mr.horzcat([arr2, arr3,arr]);
			expect(Array.from(res.size().getContents())).to.deep.equal([2,10]);
			expect(Array.from(res.getContents()))
				.to.deep.equal([ 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20 ]);

		});
		// it('should ')

	});
	describe("#vertcat",()=>{
		// Verifies input
		beforeEach(async ()=>{
			wi= await WebAssembly.instantiate(file,libjs);
			wi = wi.instance.exports;
			memory = wi.mem;
			mr = new MatlabRuntime(wi);
		});
		it('should return correct result for matrices [1,2], [2,2], [5,2] to result in a [8,2] when dim is 1 ', () => {
			let arr = mr.colon(7,16);
			arr = mr.reshape(arr, [5,2]);
			let arr2 = new MxNDArray(wi, [1,2]);
			arr2.set_indices([[1,2]],[1,2]);
			let arr3 = new MxNDArray(wi, [2,2]);
			arr3.set_indices([[1,2,3,4]],[3,4,5,6]);
			let res = mr.vertcat([arr2, arr3,arr]);
			expect(Array.from(res.getContents()))
				.to.deep.equal([ 1, 3, 4, 7, 8, 9, 10, 11, 2, 5, 6, 12, 13, 14, 15, 16 ]);
			expect(Array.from(res.size().getContents())).to.deep.equal([8,2]);
		});
	});
});