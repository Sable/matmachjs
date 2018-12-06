
const path = require("path");
const fs = require("fs");
const libjs = require(path.join(__dirname,"../../")+"/bin/matmachjs-lib.js");
const file = fs.readFileSync(path.join(__dirname,"../../")+"/bin/matmachjs.wasm");

const { MxVector } = require(path.join(__dirname,"../../")+"/bin/classes/mxarray/MxVector.js");
const { MxNDArray } = require("../../../bin/classes/mxarray/MxNdArray");
async function turtle() {
	let wi= await WebAssembly.instantiate(file,libjs);
	wi = wi.instance.exports;
	console.log(MxNDArray);
	let array = new MxNDArray(wi, [3,7,2]);
	array.set([[3,1],[1,7],[2]],[4,2,5,7]);
	console.log(array.numel());
	console.log(array.ndims());
	console.log(array.get([[42]]));

	// array.set_indices()
}

turtle();