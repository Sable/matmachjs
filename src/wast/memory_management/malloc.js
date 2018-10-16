const fs = require("fs");

const STACK_ALIGN = 16;
const WASM_PAGE_SIZE = 65536;
var TOTAL_MEMORY = 16777216;
var TOTAL_STACK = 5242880;
var STATIC_BASE, STATICTOP, staticSealed; // static area
var STACK_BASE, STACKTOP, STACK_MAX; // stack area
var DYNAMIC_BASE, DYNAMICTOP_PTR; // dynamic area handled by sbrk
var Module = {};
Module['print'] = typeof console !== 'undefined' ? console.log.bind(console) : (typeof print !== 'undefined' ? print : null);
Module['printErr'] = typeof printErr !== 'undefined' ? printErr : ((typeof console !== 'undefined' && console.warn.bind(console)) || Module['print']);
Module['reallocBuffer'] = wasmReallocBuffer;

STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0;

var staticSealed = false;

DYNAMICTOP_PTR = staticAlloc(4);

STACK_BASE = STACKTOP = alignMemory(STATICTOP);

STACK_MAX = STACK_BASE + TOTAL_STACK;

DYNAMIC_BASE = alignMemory(STACK_MAX);
function alignMemory(size, factor) {
    if (!factor) factor = STACK_ALIGN; // stack alignment (16-byte) by default
    var ret = size = Math.ceil(size / factor) * factor;
    return ret;
  }
function staticAlloc(size) {
    assert(!staticSealed);
    var ret = STATICTOP;
    STATICTOP = (STATICTOP + size + 15) & -16;
    return ret;
  }

const importObj = {
    "env":{
        "memory": new WebAssembly.Memory({ 'initial': TOTAL_MEMORY / WASM_PAGE_SIZE }),
        "STACKTOP": STACKTOP,
        "STACK_MAX":STACK_MAX,
        "DYNAMICTOP_PTR":DYNAMICTOP_PTR,
        "abortOnCannotGrowMemory":abortOnCannotGrowMemory,
        "enlargeMemory":enlargeMemory,
        "abortStackOverflow":abortStackOverflow,
        "getTotalMemory":getTotalMemory,
        "___setErrNo":___setErrNo
    }
};


console.log(WebAssembly.instantiate);
WebAssembly.instantiate(fs.readFileSync('stealing_malloc.wasm'), importObj)
.then(obj => {
   var ptr =  obj.instance.exports._malloc(24);
   
    var free_ptr = obj.instance.exports._free(ptr);
   var ptr2 = obj.instance.exports._malloc(30);
    //    obj.instance.exports._free(ptr2);
    // obj.instance.exports._free(ptr2);
    // obj.instance.exports._free(ptr2);
   var ptr3 = obj.instance.exports._malloc(56);
   console.log(ptr, ptr2, ptr3);
   var ptr3 = obj.instance.exports._malloc(1);


});

  /** @type {function(*, string=)} */
  function assert(condition, text) {
    if (!condition) {
      abort('Assertion failed: ' + text);
    }
  }



  function abortOnCannotGrowMemory() {
    abort('Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value ' + TOTAL_MEMORY + ', (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ');
  }

  function enlargeMemory() {
    // TOTAL_MEMORY is the current size of the actual array, and DYNAMICTOP is the new top.
    assert(HEAP32[DYNAMICTOP_PTR>>2] > TOTAL_MEMORY); // This function should only ever be called after the ceiling of the dynamic heap has already been bumped to exceed the current total size of the asm.js heap.
  
  
    var PAGE_MULTIPLE =  WASM_PAGE_SIZE ; // In wasm, heap size must be a multiple of 64KB. In asm.js, they need to be multiples of 16MB.
    var LIMIT = 2147483648 - PAGE_MULTIPLE; // We can do one page short of 2GB as theoretical maximum.
  
    if (HEAP32[DYNAMICTOP_PTR>>2] > LIMIT) {
      Module.printErr('Cannot enlarge memory, asked to go up to ' + HEAP32[DYNAMICTOP_PTR>>2] + ' bytes, but the limit is ' + LIMIT + ' bytes!');
      return false;
    }
  
    var OLD_TOTAL_MEMORY = TOTAL_MEMORY;
    TOTAL_MEMORY = Math.max(TOTAL_MEMORY, MIN_TOTAL_MEMORY); // So the loop below will not be infinite, and minimum asm.js memory size is 16MB.
  
    while (TOTAL_MEMORY < HEAP32[DYNAMICTOP_PTR>>2]) { // Keep incrementing the heap size as long as it's less than what is requested.
      if (TOTAL_MEMORY <= 536870912) {
        TOTAL_MEMORY = alignUp(2 * TOTAL_MEMORY, PAGE_MULTIPLE); // Simple heuristic: double until 1GB...
      } else {
        TOTAL_MEMORY = Math.min(alignUp((3 * TOTAL_MEMORY + 2147483648) / 4, PAGE_MULTIPLE), LIMIT); // ..., but after that, add smaller increments towards 2GB, which we cannot reach
      }
    }
  
    var start = Date.now();
  
    var replacement = Module['reallocBuffer'](TOTAL_MEMORY);
    if (!replacement || replacement.byteLength != TOTAL_MEMORY) {
      Module.printErr('Failed to grow the heap from ' + OLD_TOTAL_MEMORY + ' bytes to ' + TOTAL_MEMORY + ' bytes, not enough memory!');
      if (replacement) {
        Module.printErr('Expected to get back a buffer of size ' + TOTAL_MEMORY + ' bytes, but instead got back a buffer of size ' + replacement.byteLength);
      }
      // restore the state to before this call, we failed
      TOTAL_MEMORY = OLD_TOTAL_MEMORY;
      return false;
    }
  
    // everything worked
  
    updateGlobalBuffer(replacement);
    updateGlobalBufferViews();
  
    Module.printErr('enlarged memory arrays from ' + OLD_TOTAL_MEMORY + ' to ' + TOTAL_MEMORY + ', took ' + (Date.now() - start) + ' ms (has ArrayBuffer.transfer? ' + (!!ArrayBuffer.transfer) + ')');

  
  
    return true;
}


function abortStackOverflow(allocSize) {
    abort('Stack overflow! Attempted to allocate ' + allocSize + ' bytes on the stack, but stack has only ' + (STACK_MAX - stackSave() + allocSize) + ' bytes available!');
  }
  function getTotalMemory() {
    return TOTAL_MEMORY;
  }
  
function ___setErrNo(value) {
    if (Module['___errno_location']) HEAP32[((Module['___errno_location']())>>2)]=value;
    else Module.printErr('failed to set errno from JS');
    return value;
} 
function updateGlobalBuffer(buf) {
    Module['buffer'] = buffer = buf;
}

function updateGlobalBufferViews() {
    Module['HEAP8'] = HEAP8 = new Int8Array(buffer);
    Module['HEAP16'] = HEAP16 = new Int16Array(buffer);
    Module['HEAP32'] = HEAP32 = new Int32Array(buffer);
    Module['HEAPU8'] = HEAPU8 = new Uint8Array(buffer);
    Module['HEAPU16'] = HEAPU16 = new Uint16Array(buffer);
    Module['HEAPU32'] = HEAPU32 = new Uint32Array(buffer);
    Module['HEAPF32'] = HEAPF32 = new Float32Array(buffer);
    Module['HEAPF64'] = HEAPF64 = new Float64Array(buffer);
}

function alignUp(x, multiple) {
    if (x % multiple > 0) {
      x += multiple - (x % multiple);
    }
    return x;
  }

function wasmReallocBuffer(size) {
    var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE; // In wasm, heap size must be a multiple of 64KB. In asm.js, they need to be multiples of 16MB.
    size = alignUp(size, PAGE_MULTIPLE); // round up to wasm page size
    var old = Module['buffer'];
    var oldSize = old.byteLength;
    if (Module["usingWasm"]) {
      // native wasm support
      try {
        var result = Module['wasmMemory'].grow((size - oldSize) / wasmPageSize); // .grow() takes a delta compared to the previous size
        if (result !== (-1 | 0)) {
          // success in native wasm memory growth, get the buffer from the memory
          return Module['buffer'] = Module['wasmMemory'].buffer;
        } else {
          return null;
        }
      } catch(e) {
        console.error('Module.reallocBuffer: Attempted to grow from ' + oldSize  + ' bytes to ' + size + ' bytes, but got error: ' + e);
        return null;
      }
    }
  }
