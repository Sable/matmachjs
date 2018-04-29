let memory = WebAssembly.Memory({initial:10});
const { TextDecoder } = require('util');
function printError(offset, length) {
    var bytes = new Uint8Array(module.exports.js.mem.buffer, offset, length);
    var string = new TextDecoder('utf8').decode(bytes);
    console.error(string);
}
module.exports = {
    "js":{
        "mem":memory,
        "printError":printError,
        "printWho":printWhos
    }
};
function printWhos(size, bytes, class_type)
{
    let name_class = '';
    switch(class_name)
    {
        case 0: 
            name_class = "double";
    }   
}
console.log("Error: Negative length is not allowed in this context\n".length);