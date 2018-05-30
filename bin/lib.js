let memory = WebAssembly.Memory({initial:10});
const { TextDecoder,TextEncoder } = require('util');
function printError(offset, length) {
    var bytes = new Uint8Array(module.exports.js.mem.buffer, offset, length);
    var string = new TextDecoder('utf8').decode(bytes);
    throw new Error(string);
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
    console.log("NUMBER:", number);
    return number;
}

module.exports = {
    "js":{
        "mem":memory,
        "printError":printError,
        "printWho":printWhos,
        "printString":printString,
        "printDouble":printDouble,
        "printDoubleNumber":printDouble,
        "js_set_array_f64":set_array_f64,
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
        "0":"Invalid Assertion: class number is incorrect in function $get_mclass",
        "1":"Invalid Assertion: elem_size number is incorrect in function $set_type_attribute",
        "2":"Invalid Assertion: simple_class number is incorrect in function $set_type_attribute",
        "3":"Invalid Assertion: complex number is incorrect in function $set_type_attribute",
        "4":"Invalid Assertion: operation only valid for array type"
    };
    if(!condition)
    {
        throw new Error(errors[error_number]);
    }
}
console.log("Subscript indices must either be real positive integers or logicals".length);


///// JAVASCRIPT API

function set_array_f64(arr,indeces, values)
{

}