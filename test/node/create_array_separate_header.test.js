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
// TODO: Create import object into wasm, separate both wasm-interp,wasm-node etc.
chai.use(sinonChai);


///////////////////////////////////////////////////////////////
const libjs = require(path.join(__dirname,"../../")+"/bin/lib.js");


const file = fs.readFileSync(path.join(__dirname,"../../")+"/bin/get_mem.wasm");
let wasmInstance;
let memory;
let malloc;
const PAGE_SIZE = 65536;
let HEAP_OFFSET = 64;
describe('Allocate Matlab Arrays', () => {
    describe("#set_type_attribute",()=>{
        
    });
    describe("#set_header",()=>{
        beforeEach(async ()=>{
            libjs.js.mem = WebAssembly.Memory({initial:1});
            wasmInstance= await WebAssembly.instantiate(file,libjs);
            wasmInstance = wasmInstance.instance.exports;
            memory = wasmInstance.mem;
            malloc = wasmInstance.malloc;
            // console.log(wasmInstance)
        });
        it("Should set type attribute correctly",()=>{
            
        });
    });

    describe("#create_array_1D",()=>{
        beforeEach(async ()=>{
            libjs.js.mem = WebAssembly.Memory({initial:1});
            wasmInstance= await WebAssembly.instantiate(file,libjs);
            wasmInstance = wasmInstance.instance.exports;
            memory = wasmInstance.mem;
            malloc = wasmInstance.malloc;

        });
        it("Should start array at correct section",()=>{
            let heap_top = wasmInstance.get_heap_top();
            let arr = wasmInstance.create_array_1D(5,0);
            let arr_start = wasmInstance.get_array_start(arr);
            // 24 for metadata, 4 for malloc header
            expect(arr_start).to.be.equal(arr+24/*meta info*/ + 4/*footer*/+4/*header_arr*/);
        });

	    it('Should insert type attribute correctly', () => {
		    let ar = new Int8Array(wasmInstance.mem.buffer);
		    let arr_pointer = wasmInstance.create_array_1D(5,0);
		    let heap_top = wasmInstance.get_heap_top();
		    ar[heap_top] = wasmInstance.set_type_attribute(heap_top);
		    expect(ar[arr_pointer+4]).to.equal(ar[heap_top]);
	    });

	    it("Should set other meta data correctly",()=>{
            let ar = new Int8Array(wasmInstance.mem.buffer);
            let arr_pointer = wasmInstance.create_array_1D(5,0);
            
            expect([ar[arr_pointer+8],ar[arr_pointer+12], ar[arr_pointer+16],ar[arr_pointer+20]]).to.deep.equal([5,2,5,1]);
        });
        it("Should correctly allocate elements of different types",()=>{
            // Allocate 10, int16 elements, 10*2 = 20 bytes + 4 for alignment+4. Type: 1->16bit
            // Checked by checking for the footer of the memory
           // let memBytes = new Int8Array(wasmInstance.mem.buffer);
            // let arr4 = wasmInstance.create_array_1d(10,3); // 8 bit allocation
            // expect((new Int32Array(wasmInstance.mem.buffer,arr4+16, 1))[0], 1).to.equal(1);
            // let arr = wasmInstance.create_array_1d(10,2);// 16 bit allocation
            // expect((new Int32Array(wasmInstance.mem.buffer,arr+28, 1))[0], 1).to.equal(1);
            // let arr2 = wasmInstance.create_array_1d(10,1); // 32 bit allocation
            // expect((new Int32Array(wasmInstance.mem.buffer,arr2+44, 1))[0], 1).to.equal(1);
            // let arr3 = wasmInstance.create_array_1d(10,0);// 64 bit allocation
            // expect((new Int32Array(wasmInstance.mem.buffer,arr3+84, 1))[0], 1).to.equal(1);
        });

        it("Should correctly set the type",()=>{
            let array = wasmInstance.create_array_1d(10,0);
            expect(wasmInstance.get_array_type(array)).to.be.equal(0);
            let array2 = wasmInstance.create_array_1d(20,0);
            expect(wasmInstance.get_array_type(array2)).to.be.equal(0);
        });
        it("Should create array and set the length should be set appropriately",()=>{
            let array = wasmInstance.create_array_1d(10,0);
            expect(wasmInstance.array_length(array)).to.be.equal(10);
            let array2 = wasmInstance.create_array_1d(20,0);
            expect(wasmInstance.array_length(array2)).to.be.equal(20);
        });
    
        it("Should correctly give dimensions",()=>{
            let array = wasmInstance.create_array_1d(10,0);
            expect(wasmInstance.array_dim_num(array)).to.be.equal(2);
            let array2 = wasmInstance.create_array_1d(20,0);
            expect(wasmInstance.array_dim_num(array2)).to.be.equal(2);
    
        });
        it("Should allocate metadata correctly even if array length is negative",()=>{
            let array = wasmInstance.create_array_1d(-1,0);
            expect(wasmInstance.array_dim_num(array)).to.be.equal(2);
            expect(wasmInstance.array_length(array)).to.be.equal(0);
        });
    });
    describe("#get_simple_class_byte_size",()=>{
        let get_simple_class_byte_size;
        beforeEach(async ()=>{
            libjs.js.mem = WebAssembly.Memory({initial:1});
            wasmInstance= await WebAssembly.instantiate(file,libjs );
            wasmInstance = wasmInstance.instance.exports;
            memory = wasmInstance.mem;
            get_simple_class_byte_size = wasmInstance.get_simple_class_byte_size;
    
            // console.log(wasmInstance)
        });
        it("Should give the correct size for a given type",()=>{
            expect(get_simple_class_byte_size(0)).to.equal(8);//Double
            expect(get_simple_class_byte_size(1)).to.equal(4);//single
            expect(get_simple_class_byte_size(2)).to.equal(2);//int16
            expect(get_simple_class_byte_size(3)).to.equal(1);//int8
            expect(get_simple_class_byte_size(4)).to.equal(8);//int64
            expect(get_simple_class_byte_size(5)).to.equal(4);//int32
            expect(get_simple_class_byte_size(6)).to.equal(2);//uint16
            expect(get_simple_class_byte_size(7)).to.equal(1);//uint8
            expect(get_simple_class_byte_size(8)).to.equal(8);//uint64
            expect(get_simple_class_byte_size(9)).to.equal(4);//uint32
            expect(get_simple_class_byte_size(11)).to.equal(1);//char
            expect(get_simple_class_byte_size(13)).to.equal(4);//string
            expect(get_simple_class_byte_size(15)).to.equal(1);//logical
        });
    });
    describe("#set_elem_array_index_NS", () => {
	    let create_array;
	    let create_array_ND;
	    beforeEach(async ()=>{
		    wasmInstance= await WebAssembly.instantiate(file,libjs);
		    wasmInstance = wasmInstance.instance.exports;
		    memory = wasmInstance.mem;
		    create_array = wasmInstance.create_array;
		    create_array_ND = wasmInstance.create_array_ND;
	    });
	    it("Should reallocate array when index is more than length",() =>{

	    });

	    it("Should throw an error if value passed does not match what is expected",() =>{

	    });
	    it("Should throw an error when index is less than 1",() =>{

	    });
	    it("Should update pointer in header of array when index is more than length",() =>{

	    });

	    it("Should correctly set value for all the various simple classes",() =>{

	    });
    });
	describe("#get_elem_array_index_NS", () => {
		let create_array;
		let create_array_ND;
		beforeEach(async ()=>{
			wasmInstance= await WebAssembly.instantiate(file,libjs);
			wasmInstance = wasmInstance.instance.exports;
			memory = wasmInstance.mem;
			create_array = wasmInstance.create_array;
			create_array_ND = wasmInstance.create_array_ND;
		});


		it("Should throw an error if index is less than 1",() =>{

		});
		it("Should throw an error if index is larger than array length",() =>{

		});

		it("Should correctly return value at index for all the various simple classes",() =>{

		});
	});
    describe("#create_array",()=>{
        let create_array;
        let create_array_ND;
        beforeEach(async ()=>{
            wasmInstance= await WebAssembly.instantiate(file,libjs);
            wasmInstance = wasmInstance.instance.exports;
            memory = wasmInstance.mem;
            create_array = wasmInstance.create_array;
	        create_array_ND = wasmInstance.create_array_ND;
        });
	    it('Should correctly set array header',  () => {
		    let arr_1d = wasmInstance.create_array_1D(4,5);
		    let arr_header = new Int32Array(memory.buffer, arr_1d, 6);
		    let arr_data = new Int32Array(memory.buffer, wasmInstance.get_array_start(arr_1d), 4);
		    // console.log(wasmInstance.set_elem_array_index_i32(arr_1d, 1,20));
		    wasmInstance.set_elem_array_index_i32(arr_1d, 1,30);
		    wasmInstance.set_elem_array_index_i32(arr_1d, 2,2);
		    wasmInstance.set_elem_array_index_i32(arr_1d, 3,4);
		    wasmInstance.set_elem_array_index_i32(arr_1d, 4,6);

		    let arr_nd = wasmInstance.create_array_ND(arr_1d);
		    let arr_header_nd = new Int32Array(memory.buffer, arr_nd, 8);
		    
		    expect(arr_header_nd[2]).to.deep.equal(1440); // Total array length
		    expect(arr_header_nd[3]).to.deep.equal(4); // Number of dimensions
		    expect(arr_header_nd[4]).to.deep.equal(30); // First dim
		    expect(arr_header_nd[5]).to.deep.equal(2); // Second dim
		    expect(arr_header_nd[6]).to.deep.equal(4); // Third dim
		    expect(arr_header_nd[7]).to.deep.equal(6); // Fourth dim
	    });
        it("Should return 0 if dimensions are negative or 0",()=>{
            let arr_1d = wasmInstance.create_array_1d(2,1);
            let arr = new Int32Array(memory.buffer, arr_1d, 2);
            // Two dimensions
            arr[0] = -2;
            arr[1] = 10;
            expect(wasmInstance.create_array(arr_1d,0)).to.equal(0);
            // Two dimensions
            arr[0] = 0;
            arr[1] = 10;
            expect(wasmInstance.create_array(arr_1d,0)).to.equal(0);
            // Two dimensions
            arr[0] = 2;
            arr[1] = 10;
            expect(wasmInstance.create_array(arr_1d,0)).to.not.equal(0);
        });
        it("Should test the heap top ends in the right position for many multidimensional entries ",()=>{
            
        });
        it("Should align initial array position for different dimension numbers",()=>{
    
        });
        it("Should set the dimensions of array correctly",()=>{
    
        });
        it("Should set the length of the array correctly for different dimensions",()=>{
    
        });
        it("Should set the type of the array correctly",()=>{
    
        });
        it("Should create multi-dimensional arrays of many sizes correctly",()=>{
    
        });
        it("Should align beginning of arrays correctly for both aligned/unaligned",()=>{
    
        });
        it("Should correctly allocate the right bytes for different arrays",()=>{
    
        });
    });
});
