let memory = WebAssembly.Memory({initial:10});
const { TextDecoder,TextEncoder } = require('util');
function printError(offset, length) {
    var bytes = new Uint8Array(module.exports.js.mem.buffer, offset, length);
    var string = new TextDecoder('utf8').decode(bytes);
    console.error(string);
}

function printString(offset, length) {
    var bytes = new Uint8Array(module.exports.js.mem.buffer, offset, length);
    var string = new TextDecoder('utf8').decode(bytes);
    console.log(string);
}
function printWhos(size, bytes, class_type)
{
    let name_class = '';
    switch(class_name)
    {
        case 0: 
            name_class = "double";
    }   
}
function printDouble(number)
{
    console.log(number);
}

module.exports = {
    "js":{
        "mem":memory,
        "printError":printError,
        "printWho":printWhos,
        "printString":printString,
        "printDouble":printDouble,
        "assert_header":1
    },
    "test":{
        "assert":assert
    }
};

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}
String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

/////////////// ASSERT ////////////////////

function assert(condition, error_number) {
    let errors = {
        "0":"Invalid Assertion: mclass number is incorrect in function $get_mclass",
        "1":"Invalid Assertion: simpleclass number is incorrect in function $get_simple_class",
        "2":"Invalid Assertion: elem_byte_size number is incorrect in function $get_elem_byte_size"
    };
    if(condition)
    {
        throw new Error(errors[error_number]);
    }
}