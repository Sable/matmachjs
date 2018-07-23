
const { MatlabRuntime, MxVector, MxNDArray } = require("../../../bin/classes/Runtime");
function mxcreate(shape = [1,1]){
    let total_length;
    let a;
    if(typeof shape === 'number'){
        total_length = len;
        a = new Float64Array(total_length);        
        a._shape = [1,1];
    }else if(shape instanceof Array) {
        total_length = 1
        shape.forEach((item)=>{
            total_length*= item;
        });
        a = new Float64Array(total_length);
        a._shape = shape;
    }else{
        throw Error("Unsupported Input");
    }
    return a;
}

function horzcat(...args) {
    let arr = verify_input_and_instantiate_result_concatation(1, ...args);
    let i = 0;
    for (let k = 0; k < args.length; k++) {
        for (let k2 = 0; k2 < args[k].length; k2++) {
           arr[i] = args[k][k2];
           i++;
        }
    }
    return arr;
}
function clone_dim(arr) {
    return arr.map(it => it);
}
function mxclone (arr){
    let shape_new = arr._shape.map(it=>it);
    let a = mxcreate(shape_new);
    arr.forEach((it,i)=>a[i] = it);
    return a;
}

let arr = mxcreate([1,30,4]);
let arr4 = mxcreate([1,20,4])
let arr2 = mxcreate([1,2,4]);
let res = horzcat(arr,arr2,arr4);
// console.log(res.length, res._shape);

function concat(dim, ...args){
    let arr = verify_input_and_instantiate_result_concatation(dim, ...args);
    concat_into_res(dim, arr, args);
    return arr;
}

function vertcat(...args) {
    let arr = verify_input_and_instantiate_result_concatation(0, ...args);
    concat_into_res(1, arr, args);
    return arr;
}
// traverse through each array
let arr_ver = mxcreate([1,20,4]);
let arr4_ver = mxcreate([2,20,4])
let arr2_ver = mxcreate([11,20,4]);
// console.log(vertcat(arr_ver, arr4_ver, arr2_ver).length);

function verify_input_and_instantiate_result_concatation(dim, ...args){
    if(!args.every((item)=>item instanceof Float64Array)) 
        throw new Error("Unsupported input");
    
    if(args.length == 0 ) return mxcreate([]);
    // if(args[0].length == 0)
    //      throw new Error(`Warning: This concatenation operation includes an empty array
    // with an incorrect number of rows.
    // Concatenation including empty arrays will require all arrays to
    // have the same number of rows in a future release.`);
    let shape_len = args[0]._shape.length;
    let first = args[0]._shape;
    let new_length_column = args[0]._shape[dim]; 
    for (let i = 1; i < args.length; i++) {
        const dim_ptr = args[i];
        if(dim_ptr._shape.length !== shape_len )
             throw new Error("Dimensions of matrices being concatenated are not consistent.");
        for (let l = 0; l < first.length; l++) {
            if(l != dim && first[l] !== dim_ptr._shape[l]) 
                throw new Error("Dimensions of matrices being concatenated are not consistent.");
        }
        new_length_column+= dim_ptr._shape[dim];
    }
    let new_shape = clone_dim(first);
    new_shape[dim] = new_length_column;
    let arr = mxcreate(new_shape);
    return arr;
}

// @flow
function concat_into_res( concat_dim, res_mat/*:number[]*/, matrices ){
    let row_num = res_mat._shape[concat_dim];
    let size_prev = 0;
    matrices.forEach((mat)=>{
            traverse_concat(concat_dim, res_mat,row_num, mat,mat._shape,size_prev, 0, 0, 1, 0, 1 );
            size_prev+= (mat._shape[concat_dim] );
    });
}
// concat_vert([],[],0,0,0, 1,0,1,0);

function traverse_concat(concat_dim, total,total_new_dim, mat, shape, size_prev, idx, offset,mult, offset_tot, mult_tot) {
    for (let i = 0; i < shape[idx]; i++) {
        // Calculating offset current matrix
        let new_offset = offset + i*mult;
        let new_mult = mult*shape[idx];
        let new_offset_tot;
        let new_mult_tot;
        if( idx === concat_dim){
	        new_offset_tot =  offset_tot + (size_prev + i)*mult_tot;
	        console.log("LINE", idx, new_offset_tot, offset_tot , size_prev, mult_tot);
	        new_mult_tot = mult_tot*total_new_dim;
        }else{
	        new_offset_tot = offset_tot + i*mult_tot;
	        new_mult_tot = mult_tot*shape[idx];
        }
	    // console.log("TOTO1",mat,"DIM:",idx, ",i:", i, ",size_prev:", size_prev,"mult", mult_tot, "off", new_offset_tot,offset_tot);
	    if (idx === shape.length -1) {
	        console.log("TOTO2",mat,"DIM:",idx, ",i:", i, ",size_prev:", size_prev,"mult", mult_tot, "off", new_offset_tot,offset_tot);
            total[new_offset_tot] = mat[new_offset];
        }else{
            traverse_concat(concat_dim, total,total_new_dim, mat,shape,size_prev, idx+1,new_offset, new_mult, new_offset_tot, new_mult_tot);
        }
    }
}
let arr_trav = mxcreate([1,2]);
arr_trav[0] = 1;
arr_trav[1] = 2;

let arr_trav2 = mxcreate([2,2]);
arr_trav2[0] = 3;
arr_trav2[1] = 4;
arr_trav2[2] = 5;
arr_trav2[3] = 6;
let arr_trav3 = mxcreate([5,2]);
for (let i = 0; i < 5; i++) {
    arr_trav3[i]+= 7+i;
}
for (let i = 0; i < 5; i++) {
    arr_trav3[i+5]+= 12+i;
}
// let arr_tot = verify_input_and_instantiate_result_concatation(0, arr_trav, arr_trav2, arr_trav);

// console.log(concat(0,arr_trav, arr_trav2, arr_trav3));
// console.log(concat(1,arr, arr2, arr4)._shape);
let arr_hor = new Float64Array(10);
arr_hor._shape = [2,5];
for(let i =0;i< 10;i++){
    arr_hor[i] = i+11;
}
let arr_hor2 = new Float64Array(6);
arr_hor2._shape = [2,3];
for(let i =0;i< 6;i++){
	arr_hor2[i] = i+5;
}

let arr_hor3 = new Float64Array(4);
arr_hor3._shape = [2,2];
for(let i =0;i< 6;i++){
	arr_hor3[i] = i+1;
}
console.log(concat(1,  arr_hor3,arr_hor2, arr_hor));
