
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
const { MxVector } = require(path.join(__dirname,"../../../")+"bin/classes/mxarray/MxVector.js");
const { MxNDArray } = require(path.join(__dirname,"../../../")+ "bin/classes/mxarray/MxNdArray.js");

(async ()=>{
	let wi;
	let memory;
	libjs.js.mem = WebAssembly.Memory({initial: 1});
	wi = await WebAssembly.instantiate(file, libjs);
	wi = wi.instance.exports;
	memory = wi.mem;
	return wi;
}).then((wi)=>{
	function log_M2(arr_ptr, length){
		let arr = new Float64Array(wi.mem.buffer, arr_ptr, length);
		let res_ptr = wi.clone(arr_ptr);
		let res = new Float64Array(wi.mem.buffer, res_ptr, length);
		for(let i = 0;i< length; i++){
			res[i] = Math.log(arr[i]);
		}
		return res_ptr;
	}
	let arr = mr.randn([3,3]);
	let arr2 = wi.times_MS(arr.arr_ptr, 4);


});
