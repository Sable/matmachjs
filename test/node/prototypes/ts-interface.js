
const { MatlabRuntime } = require("./matlab-runtime.js");

MatlabRuntime.instantiateRuntime(wi)
    .then((mr)=>{
        let a = mr.ones([1,2]); // Returns 1x2 MxArray
        let b = mr.lit([[2],[1]]); // Returns 2x1 MxArray
        let c = mr.add(a,b); // Returns 2x2 array
        mr.disp(c); // Prints
    });



