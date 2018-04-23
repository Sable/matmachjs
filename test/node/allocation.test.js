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
// TODO: Create import object into wasm, separate both wasm-interp,wasm-node etc.
chai.use(sinonChai);


///////////////////////////////////////////////////////////////



const file = fs.readFileSync("/home/sable/dherre3/Documents/Research/mc2wasm/src/main/wasm/bin/get_mem.wasm");
let wasmInstance;
let memory;
let malloc;
const PAGE_SIZE = 65536;
const HEAP_OFFSET = 64;
describe("Memory",()=>{

    describe("#malloc",()=>{
        beforeEach(async ()=>{
            wasmInstance= await WebAssembly.instantiate(file, {});
            wasmInstance = wasmInstance.instance.exports;
            memory = wasmInstance.mem;
            malloc = wasmInstance.malloc;

            // console.log(wasmInstance)
        });
        it("Throws error when size is negative", ()=>{
            let malloc = wasmInstance.malloc;
            expect(malloc.bind(malloc, -2)).to.throw();
            // expect(true).to.be(true)
        });
        it("Expect heap top to grow correctly when input is unaligned",()=>{
            // Total: 16(footer/header)+ 10(size) + 6(alignment) = 32
            let heap_top_start = wasmInstance.get_heap_top();
            let a = malloc(10);
            let heap_top_end = wasmInstance.get_heap_top();
            expect(a).to.equal(heap_top_start+8);
            expect(heap_top_end-heap_top_start).to.equal(32);
        });
        it("Expect heap top to grow correctly when input is aligned",()=>{
            // Total: 16(footer/header)+ 8(size) + 0(alignment) = 24
            let heap_top_start = wasmInstance.get_heap_top();
            let a = malloc(8);
            let heap_top_end = wasmInstance.get_heap_top();
            expect(a).to.equal(heap_top_start+8);
            expect(heap_top_end-heap_top_start).to.equal(24);
        });
        it("Should return the correct position for the pointer",()=>{
            // Total: 16(footer/header)+ 8(size) + 0(alignment) = 24
            let heap_top_start = wasmInstance.get_heap_top();
            let a = malloc(8);
            expect(a).to.equal(heap_top_start+8);
        });
        it("Should have set the free bits to one in the correct memory positions",()=>{
            let array = malloc(10);
            expect(wasmInstance.get_mem_free_bit(array)).to.equal(1);
        });
        it("Should have set the size to the correct payload for both aligned/unaligned accesses",()=>{
            let array = malloc(10);
            expect(wasmInstance.get_mem_payload_size(array)).to.equal(16);
            let array2 = malloc(8);
            expect(wasmInstance.get_mem_payload_size(array2)).to.equal(8);
        });


        it("Should correctly grow memory if there is no more memory for page", ()=>{
            // Max Page Size: 5,
            expect(malloc.bind(malloc,
                5*PAGE_SIZE - HEAP_OFFSET - 16)).to.not.throw();//16 bits for header/footer of malloc.
        });
        it("Should throw correct unreachable error if it cannot grow memory anymore", ()=>{
            // Max Page Size: 5,
            expect(malloc.bind(malloc,
                5*PAGE_SIZE - HEAP_OFFSET - 15)).to.throw();//One more bit than the maximum allocated data
        });

    })


});