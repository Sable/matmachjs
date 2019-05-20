
// @flow
// Optimization if you asked for the tranpose of a colon operation
function get_colon_transpose(total/*:Array<number>*/,target/*:Array<number>*/,shape/*:Array<number>*/,
         b/*:Array<Array<number>>*/,dim/*:number*/, mult/*:number*/, offset/*:number*/)/*:number*/ {
    /// assumes that indeces are well behaved
   b[dim].forEach(elem => {
       let new_offset = offset + mult*(elem-1);
       let new_mult = mult * shape[dim];
       if(dim === b.length-1)
       {
           total.push(target[new_offset]);
       }else{
           get_colon_transpose(total, target,shape, b, dim+1, new_mult, new_offset);
       }
   });
    return 1;
}
let total/*:Array<number>*/ = [];
function get_colon(total/*:Array<number>*/, target/*:Array<number>*/,shape/*:Array<number>*/,
         indices/*:Array<Array<number>>*/,dim/*:number*/, mult/*:number*/, offset/*:number*/
         ,mult_ind/*:number*/, offset_ind/*:number*/)/*:void*/ {
    /// assumes that indeces are well behaved, that is in increasing order and within range
    indices[dim].forEach((elem,ind) => {
       let new_offset = offset + mult*(elem-1);
       let new_mult = mult * shape[dim];
       let new_offset_ind = offset_ind + mult_ind*ind;
       let new_mult_in = mult_ind * indices[dim].length;
       if(dim === indices.length-1)
       {
           total[new_offset_ind] = target[new_offset];
       }else{
           get_colon(total, target,shape, indices, dim+1, new_mult, new_offset, new_mult_in, new_offset_ind);
       }
   });
}

function get_colon_algo(arr, indeces)
{
    let shape = shape_arr(arr);
    let length = verify_incedes_get(arr,shape, indeces);
    console.log(length);
    let total = new Array(length);
    get_colon(total, arr, shape, indeces, 0, 1, 0, 1, 0);
    console.log("tota", total);
}

function shape_arr(arr)
{
    return [3,7,2];
}

function verify_incedes_get(arr/*:Array<number>*/, shape/*:Array<number>*/, indeces/*:Array<Array<number>>*/)
{
    
    let numel = arr.length;
    let total_elem = 1;
    indeces.forEach( (indeces_dim_arr,i) => {
        total_elem *= indeces_dim_arr.length;
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
    return total_elem;
}
/**
TESTS
 */
// This is a 3*7*2 array in matlab represented in column major
let data = [0.8909,0.9593,0.5472,0.1386,0.1493,0.2575,0.8407,0.2543,0.8143,0.2435,0.9293,0.3500,0.1966,0.2511,0.6160,0.4733,0.3517,0.8308,0.5853,0.5497,0.9172,0.2858,0.7572,0.7537,0.3804,0.5678,0.0759,0.0540,0.5308,0.7792,0.9340,0.1299,0.5688,0.4694,0.0119,0.3371,0.1622,0.7943,0.3112,0.5285,0.1656,0.6020];
get_colon_algo(data, [[1,2],[1,3,5,7],[1]]); // Should work
try {
    
get_colon_algo(data, [[1,2],[1,3,5,0],[1]]); // Should throw error
} catch (err) {
    console.log(err.message);
    
}
try {
    get_colon_algo(data, [[1,0]]); // Should throw error
    
} catch (err) {
    console.log(err.message);
}
get_colon_algo(data, [[1,2,41,40]]);// Should work, 4
try {
   get_colon_algo(data, [[43]]); // Should throw error
} catch (err) {
    console.log(err.message);
}
try {
  let data2 =  get_colon_algo(data, [[1,2],[1,3,5,6],[]]); // Should throw error
  console.log("data2", data2);
} catch (err) {
    console.log("WJAT", err.message);
}
/** 
    Set Colon operation
    Need to change in case is only one argument to the shape of the argument.
*/
function set_colon(values/*:Array<number>*/, target/*:Array<number>*/,shape/*:Array<number>*/,
         indeces/*:Array<Array<number>>*/,dim/*:number*/, mult/*:number*/, offset/*:number*/
         ,mult_ind/*:number*/, offset_ind/*:number*/)/*:void*/ {
    /// assumes that indeces are well behaved, that is in increasing order and within range
   indeces[dim].forEach((elem,ind) => {
       let new_offset = offset + mult*(elem-1);
       let new_mult = mult * shape[dim];
       let new_offset_ind = offset_ind + mult_ind*ind;
       let new_mult_in = mult_ind * indeces[dim].length;
       
       if(dim === indeces.length-1)
       {
           target[new_offset] = values[new_offset_ind];
       }else{
           set_colon(values, target, shape, indeces, dim+1, new_mult, new_offset, new_mult_in, new_offset_ind);
       }
   });
}
function verify_incedes_set(arr/*:Array<number>*/,values/*:Array<number>*/, shape/*:Array<number>*/, indeces/*:Array<Array<number>>*/)
{
    let numel = arr.length;
    let total_values = 1;
    indeces.forEach( (indeces_dim_arr,i) => {
        total_values*=indeces_dim_arr.length;
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
    if(total_values !== values.length)
    {
        throw new Error("Subscripted assignment dimension mismatch.");
    }
}
function set_colon_algo(arr,values, indeces/*:Array<Array<number>>*/)
{
    let shape = shape_arr(arr);
    verify_incedes_set(arr,values,shape, indeces);
    set_colon(values, arr, shape, indeces, 0, 1, 0, 1, 0);
    console.log(arr);
}
set_colon_algo(data, [1,2], [[1],[2],[1,2]]);
set_colon_algo(data, [1,2], [[1],[2],[1,2]]);

// console.log("Not enough input arguments.".length);