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
const { MxNDArray, MatlabRuntime} = require(path.join(__dirname,"../../../bin/classes/Runtime.js"));

let wi;
let mr;

describe('#create_mxarray_empty(dim_num, simple_class, class, complex)', () => {
	beforeEach(async ()=>{
		wi= await WebAssembly.instantiate(file,libjs);
		wi = wi.instance.exports;
		memory = wi.mem;
		mr = new MatlabRuntime(wi);
	});
	describe('Arguments', () => {
		it('should throw error when num of dimension is negative', () => {
			try{
				wi.create_mxarray_empty(-3)
				expect(1+1).to.equal(4);
			}catch(err){
				expect(err.message).to.equal("Subscript indices must either be real positive integers or logicals");
			}
		});
		it('should return a 0x0 array when passed dim_num = 1 or 2', () => {
			let arr1 = new MxNDArray(wi, wi.create_mxarray_empty(2));
			expect(arr1.numel()).to.equal(0);
			expect(Array.from(arr1.size().getContents())).to.deep.equal([0,0]);
			let arr = new MxNDArray(wi, wi.create_mxarray_empty(1));
			expect(arr.numel()).to.equal(0);
			expect(Array.from(arr.size().getContents())).to.deep.equal([0,0]);
		});
		it('should return a 0x0x0x0 when passed dim_num =4', () => {
			let arr = new MxNDArray(wi, wi.create_mxarray_empty(5));
			expect(arr.numel()).to.equal(0);
			expect(Array.from(arr.size().getContents())).to.deep.equal([0,0,0,0,0]);

		});
	});
});