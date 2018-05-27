
//@flow 
// Optimization if you asked for the tranpose of a colon operation
function get_colon_transpose(total/*:Array<number>*/,target/*:Array<number>*/,shape/*:Array<number>*/,
         b/*:Array<Array<number>>*/,dim/*:number*/, mult/*:number*/, offset/*:number*/)/*:number*/ {
    /// assumes that indeces are well behaved
   b[dim].forEach(elem => {
       var new_offset = offset + mult*(elem-1);
       var new_mult = mult * shape[dim];
       if(dim === b.length-1)
       {
           total.push(target[new_offset]);
       }else{
           get_colon_transpose(total, target,shape, b, dim+1, new_mult, new_offset);
       }
   });
    return 1;
}
var total/*:Array<number>*/ = [];
function get_colon(total/*:Array<number>*/, target/*:Array<number>*/,shape/*:Array<number>*/,
         b/*:Array<Array<number>>*/,dim/*:number*/, mult/*:number*/, offset/*:number*/
         ,mult_ind/*:number*/, offset_ind/*:number*/)/*:void*/ {
    /// assumes that indeces are well behaved, that is in increasing order and within range
   b[dim].forEach((elem,ind) => {
       var new_offset = offset + mult*(elem-1);
       var new_mult = mult * shape[dim];
       var new_offset_ind = offset_ind + mult_ind*ind;
       var new_mult_in = mult_ind * b[dim].length;
       if(dim === b.length-1)
       {
           total[new_offset_ind] = target[new_offset];
       }else{
           get_colon(total, target,shape, b, dim+1, new_mult, new_offset, new_mult_in, new_offset_ind);
       }
   });
}

function run_algorithm(arr, indeces)
{
    let shape = shape_arr(arr);
    let total = [];
    verify_incedes_get(arr,shape, indeces);
    get_colon(total, arr, shape, indeces, 0, 1, 0, 1, 0);
    console.log(total);
}

function shape_arr(arr)
{
    return [3,7,2];
}
function verify_incedes_get(arr/*:Array<number>*/, shape/*:Array<number>*/, indeces/*:Array<Array<number>>*/)
{
    let numel = arr.length;
    indeces.forEach( (indeces_dim_arr,i) => {
        indeces_dim_arr.forEach( ind =>{
            if(ind === 0 )
            {
                throw new Error("Subscript indices must either be real positive integers or logicals.");
            }else if(  indeces.length > 1 && ind > shape[i] )
            {
                throw new Error("Index exceeds matrix dimensions.");
            }else if(indeces.length === 1 && ind > numel)
            {
                throw new Error("Index exceeds matrix dimensions.");
            }
        });
    });
}
/**
TESTS
 */
// This is a 3*7*2 array in matlab represented in column major
let data = [0.8909,0.9593,0.5472,0.1386,0.1493,0.2575,0.8407,0.2543,0.8143,0.2435,0.9293,0.3500,0.1966,0.2511,0.6160,0.4733,0.3517,0.8308,0.5853,0.5497,0.9172,0.2858,0.7572,0.7537,0.3804,0.5678,0.0759,0.0540,0.5308,0.7792,0.9340,0.1299,0.5688,0.4694,0.0119,0.3371,0.1622,0.7943,0.3112,0.5285,0.1656,0.6020];
run_algorithm(data, [[1,2],[1,3,5,7],[1]]); // Should work
try {
    
run_algorithm(data, [[1,2],[1,3,5,0],[1]]); // Should throw error
} catch (err) {
    console.log(err.message);
    
}
try {
    run_algorithm(data, [[1,0]]); // Should throw error
    
} catch (err) {
    console.log(err.message);
}
run_algorithm(data, [[1,2,41,40]]);// Should work, 4
try {
   run_algorithm(data, [[43]]); // Should throw error
} catch (err) {
    console.log(err.message);
}
try {
   run_algorithm(data, [[1,2],[1,3,5,8],[1]]); // Should throw error
} catch (err) {
    console.log(err.message);
}