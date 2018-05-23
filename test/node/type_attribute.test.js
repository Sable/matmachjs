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
const libjs = require(path.join(__dirname,"../../")+"/bin/lib.js");
const file = fs.readFileSync(path.join(__dirname,"../../")+"/bin/get_mem.wasm");
let wasmInstance;
let memory;
let malloc;

describe('#type_attribute', () => {
    let wasmInstance;
    let memory;
    let malloc;
    let set_type_attribute;        
    beforeEach(async ()=>{
        libjs.js.mem = WebAssembly.Memory({initial:1});
        wasmInstance= await WebAssembly.instantiate(file,libjs);
        wasmInstance = wasmInstance.instance.exports;
        memory = wasmInstance.mem;
        malloc = wasmInstance.malloc;
        set_type_attribute = wasmInstance.set_type_attribute;
        // console.log(wasmInstance)
    });

    it('Should set array attribute of different types correctly', () => {
        let mem = malloc(1);
        let arr = new Int8Array(memory.buffer,mem,4);
        // Array of doubles
        set_type_attribute(mem)
        expect([arr[0],arr[1] ,arr[2], arr[3]]).to.deep.equal([0,0,0,0])
        // Array 0f int16
        set_type_attribute(mem,0,2,0)
        expect([arr[0],arr[1] ,arr[2], arr[3]]).to.deep.equal([0,2,0,0]);
        // Cell- array
        set_type_attribute(mem,1)
        expect([arr[0]]).to.deep.equal([1]);
        
        
    });
});