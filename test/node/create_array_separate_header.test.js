// /**
//  * This script will test the following functions:
//  * create_array_1d, malloc, zeroesnxn, init_array
//  * 
//  */
// const chai = require("chai");
// const expect = require("chai").expect;
// const sinon = require("sinon");
// const sinonChai = require("sinon-chai");
// const fs = require("fs");
// const path = require("path");
// // TODO: Create import object into wasm, separate both wasm-interp,wasm-node etc.
// chai.use(sinonChai);


// ///////////////////////////////////////////////////////////////
// const libjs = require(path.join(__dirname,"../../")+"/bin/lib.js");


// const file = fs.readFileSync(path.join(__dirname,"../../")+"/bin/get_mem.wasm");
// let wasmInstance;
// let memory;
// let malloc;
// const PAGE_SIZE = 65536;
// let HEAP_OFFSET = 64; 
// describe('Allocate Matlab Arrays', () => {
//     describe("#set_type_attribute",()=>{
        
//     });
//     describe("#set_header",()=>{
//         beforeEach(async ()=>{
//             libjs.js.mem = WebAssembly.Memory({initial:1});
//             wasmInstance= await WebAssembly.instantiate(file,libjs);
//             wasmInstance = wasmInstance.instance.exports;
//             memory = wasmInstance.mem;
//             malloc = wasmInstance.malloc;
//             // console.log(wasmInstance)
//         });
//         it("Should set type attribute correctly",()=>{
            
//         });
//     });

//     describe("#create_array_1D",()=>{
//         beforeEach(async ()=>{
//             libjs.js.mem = WebAssembly.Memory({initial:1});
//             wasmInstance= await WebAssembly.instantiate(file,libjs);
//             wasmInstance = wasmInstance.instance.exports;
//             memory = wasmInstance.mem;
//             malloc = wasmInstance.malloc;
//         });
//         it("Should start array at correct section",()=>{
//             let heap_top = wasmInstance.get_heap_top();
//             let arr = wasmInstance.create_array_1D(5,0);
//             // 24 for metadata, 4 for malloc header
//             // expect(arr).to.be.equal(heap_top+24);
//         });
 

        
//         it("Should set other meta data correctly",()=>{
//             let ar = new Int8Array(wasmInstance.mem.buffer);
//             let arr_pointer = wasmInstance.create_array_1d(5,0);
//             expect([ar[arr_pointer-4],ar[arr_pointer-8],ar[arr_pointer-12],ar[arr_pointer-16], ar[arr_pointer-20]]).to.deep.equal([5,0,2,5,1]);
//         });  
//         it("Should correctly allocate elements of different types",()=>{
//             // Allocate 10, int16 elements, 10*2 = 20 bytes + 4 for alignment+4. Type: 1->16bit
//             // Checked by checking for the footer of the memory
//            // let memBytes = new Int8Array(wasmInstance.mem.buffer);
//             // let arr4 = wasmInstance.create_array_1d(10,3); // 8 bit allocation
//             // expect((new Int32Array(wasmInstance.mem.buffer,arr4+16, 1))[0], 1).to.equal(1);
//             // let arr = wasmInstance.create_array_1d(10,2);// 16 bit allocation
//             // expect((new Int32Array(wasmInstance.mem.buffer,arr+28, 1))[0], 1).to.equal(1);
//             // let arr2 = wasmInstance.create_array_1d(10,1); // 32 bit allocation
//             // expect((new Int32Array(wasmInstance.mem.buffer,arr2+44, 1))[0], 1).to.equal(1);
//             // let arr3 = wasmInstance.create_array_1d(10,0);// 64 bit allocation
//             // expect((new Int32Array(wasmInstance.mem.buffer,arr3+84, 1))[0], 1).to.equal(1);
//         });
//         it("Should set meta data correctly",()=>{
//             let ar = new Int8Array(wasmInstance.mem.buffer);
//             let arr_pointer = wasmInstance.create_array_1d(5,0);
//             expect([ar[arr_pointer-4],ar[arr_pointer-8],ar[arr_pointer-12],ar[arr_pointer-16], ar[arr_pointer-20]]).to.deep.equal([5,0,2,5,1]);
//         });
//         it("Should correctly set the type",()=>{
//             let array = wasmInstance.create_array_1d(10,0);
//             expect(wasmInstance.get_array_type(array)).to.be.equal(0);
//             let array2 = wasmInstance.create_array_1d(20,0);
//             expect(wasmInstance.get_array_type(array2)).to.be.equal(0);
    
//         });
//         it("Should create array and set the length should be set appropriately",()=>{
//             let array = wasmInstance.create_array_1d(10,0);
//             expect(wasmInstance.array_length(array)).to.be.equal(10);
//             let array2 = wasmInstance.create_array_1d(20,0);
//             expect(wasmInstance.array_length(array2)).to.be.equal(20);
//         });
    
//         it("Should correctly give dimensions",()=>{
//             let array = wasmInstance.create_array_1d(10,0);
//             expect(wasmInstance.array_dim_num(array)).to.be.equal(2);
//             let array2 = wasmInstance.create_array_1d(20,0);
//             expect(wasmInstance.array_dim_num(array2)).to.be.equal(2);
    
//         });
//         it("Should allocate metadata correctly even if array length is negative",()=>{
//             let array = wasmInstance.create_array_1d(-1,0);
//             expect(wasmInstance.array_dim_num(array)).to.be.equal(2);
//             expect(wasmInstance.array_length(array)).to.be.equal(0);
//         });
//     });
//     describe("#get_simple_class_byte_size",()=>{
//         let get_simple_class_byte_size;
//         beforeEach(async ()=>{
//             libjs.js.mem = WebAssembly.Memory({initial:1});
//             wasmInstance= await WebAssembly.instantiate(file,libjs );
//             wasmInstance = wasmInstance.instance.exports;
//             memory = wasmInstance.mem;
//             get_simple_class_byte_size = wasmInstance.get_simple_class_byte_size;
    
//             // console.log(wasmInstance)
//         });
//         it("Should give the correct size for a given type",()=>{
//             expect(get_simple_class_byte_size(0)).to.equal(8);//Double
//             expect(get_simple_class_byte_size(1)).to.equal(4);//single
//             expect(get_simple_class_byte_size(2)).to.equal(2);//int16
//             expect(get_simple_class_byte_size(3)).to.equal(1);//int8
//             expect(get_simple_class_byte_size(4)).to.equal(8);//int64
//             expect(get_simple_class_byte_size(5)).to.equal(4);//int32
//             expect(get_simple_class_byte_size(6)).to.equal(2);//uint16
//             expect(get_simple_class_byte_size(7)).to.equal(1);//uint8
//             expect(get_simple_class_byte_size(8)).to.equal(8);//uint64
//             expect(get_simple_class_byte_size(9)).to.equal(4);//uint32
//             expect(get_simple_class_byte_size(11)).to.equal(1);//char
//             expect(get_simple_class_byte_size(13)).to.equal(4);//string
//             expect(get_simple_class_byte_size(15)).to.equal(1);//logical
//         });
//     });
//     describe("#create_array",()=>{
//         let create_array;
        
//         beforeEach(async ()=>{
//             wasmInstance= await WebAssembly.instantiate(file,libjs);
//             wasmInstance = wasmInstance.instance.exports;
//             memory = wasmInstance.mem;
//             create_array = wasmInstance.create_array;
            
//         });
//         it("Should return 0 if dimensions are negative or 0",()=>{
//             let arr_1d = wasmInstance.create_array_1d(2,1);
//             let arr = new Int32Array(memory.buffer, arr_1d, 2);
//             // Two dimensions
//             arr[0] = -2;		
//             arr[1] = 10;
//             expect(wasmInstance.create_array(arr_1d,0)).to.equal(0);
//             // Two dimensions
//             arr[0] = 0;		
//             arr[1] = 10;
//             expect(wasmInstance.create_array(arr_1d,0)).to.equal(0);
//             // Two dimensions
//             arr[0] = 2;		
//             arr[1] = 10;
//             expect(wasmInstance.create_array(arr_1d,0)).to.not.equal(0);	
//         });
//         it("Should test the heap top ends in the right position for many multidimensional entries ",()=>{
            
//         });
//         it("Should align initial array position for different dimension numbers",()=>{
    
//         });
//         it("Should set the dimensions of array correctly",()=>{
    
//         });
//         it("Should set the length of the array correctly for different dimensions",()=>{
    
//         });
//         it("Should set the type of the array correctly",()=>{
    
//         });
//         it("Should create multi-dimensional arrays of many sizes correctly",()=>{
    
//         });
//         it("Should align beginning of arrays correctly for both aligned/unaligned",()=>{
    
//         });
//         it("Should correctly allocate the right bytes for different arrays",()=>{
    
//         });
//     });    
// }); 
