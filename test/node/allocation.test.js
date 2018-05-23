/**
 * This script will test allocation
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
let wasmInstance;
let memory;
let malloc;
const PAGE_SIZE = 65536;
let HEAP_OFFSET = 32764;
describe("Memory",()=>{
	
    describe("#malloc",()=>{
	    beforeEach(async ()=>{
		    wasmInstance= await WebAssembly.instantiate(file,libjs);
		    wasmInstance = wasmInstance.instance.exports;
		    memory = wasmInstance.mem;
		    malloc = wasmInstance.malloc;
        });
        it("Should always allocate and leave the next free segment with 4 byte alignment",()=>{

        });
        it("Throws error when size is negative", ()=>{
			let malloc = wasmInstance.malloc;
            expect(malloc.bind(malloc, -2)).to.throw();
        });
        it("Expect heap top to grow correctly when input is unaligned",()=>{
            // Total: 8(footer/header)+ 10(size) + 6(alignment) = 24
            let heap_top_start = wasmInstance.get_heap_top();
            let a = malloc(10);
            let heap_top_end = wasmInstance.get_heap_top();
            expect(a).to.equal(heap_top_start+4);
            expect(heap_top_end-heap_top_start).to.equal(24);
        });
        it("Expect heap top to grow correctly when input is aligned",()=>{
            // Total: 8(footer/header)+ 8(size) + 0(alignment) = 24
            let header_plus_footer = 8;
            let heap_top_start = wasmInstance.get_heap_top();
            let a = malloc(8);
            let heap_top_end = wasmInstance.get_heap_top();
            expect(a).to.equal(heap_top_start+4);
            expect(heap_top_end-heap_top_start).to.equal(16);
        });
        it("Should return the correct position for the pointer",()=>{
            // Total: 8(footer/header)+ 8(size) + 0(alignment) = 24
            let heap_top_start = wasmInstance.get_heap_top();
            let a = malloc(8);
            expect(a).to.equal(heap_top_start+4);
        });
        it("Should have set the free bits to one in the correct memory positions",()=>{
        	// 10 bytes, + 6 alignment + 4(last element, size)
            let array = malloc(10);
            expect(wasmInstance.get_mem_free_bit(array)).to.equal(1);
	        expect(wasmInstance.get_mem_free_bit_footer(array)).to.equal(1);
        });
        it(`Should have set the size to the correct payload for both 
            aligned/unaligned accesses`,()=>{
            let array = malloc(10); // Should align to 16
            expect(wasmInstance.get_mem_payload_size(array)).to.equal(16);
            let array2 = malloc(8);
            expect(wasmInstance.get_mem_payload_size(array2)).to.equal(8);
        });

        it("Should correctly grow memory if there is no more memory for page",async ()=>{
			// Max Page Size: 5,
			libjs.js.mem = WebAssembly.Memory({initial:1, maximum:5});
			wasmInstance= await WebAssembly.instantiate(file,libjs);
	        wasmInstance = wasmInstance.instance.exports;
			HEAP_OFFSET =  wasmInstance.get_heap_top();			
            malloc = wasmInstance.malloc;
            expect(malloc.bind(malloc,
                5*PAGE_SIZE - HEAP_OFFSET - 20)).to.not.throw();//16 bits for header/footer of malloc.
        });
        it("Should throw correct unreachable error if it cannot grow memory anymore",async ()=>{
			// Max Page Size: 5,
			libjs.js.mem = WebAssembly.Memory({initial:1, maximum:5});
	        wasmInstance= await WebAssembly.instantiate(file, libjs);
			wasmInstance = wasmInstance.instance.exports;
			HEAP_OFFSET = wasmInstance.get_heap_top();
	        malloc = wasmInstance.malloc;
            expect(malloc.bind(malloc,
                5*PAGE_SIZE - HEAP_OFFSET - 19)).to.throw();//One more bit than the maximum allocated data
        });
        it("Should set footer correctly",()=>{
        	// Start + 8 for header + 12(10 for allocated, 6 for alignment / always 64 bit aligned), should give the footer
	        let start = wasmInstance.malloc(10);
	        let mem = new Int32Array(wasmInstance.mem.buffer,start+16,1);
	        expect(mem[0]-1).to.equal(16); // Minus one from free-bit

        });

    });
    

});