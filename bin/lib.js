let memory = WebAssembly.Memory({initial:10});
const { TextDecoder } = require('util');
function printError(offset, length) {
    var bytes = new Uint8Array(memory.buffer, offset, length);
    console.log(bytes);
    var string = Number(new TextDecoder('utf8').decode(bytes));
    console.log(string);
}

module.exports = {
    "js":{
        "mem":memory,
        "print_error":printError
    }
};