

function mxcreate(shape = [1,1]){
	let total_length;
	let a;
	if(typeof shape === 'number'){
		total_length = len;
		a = new Float64Array(total_length);
		a._shape = [1,1];
	}else if(shape instanceof Array) {
		total_length = 0;
		shape.forEach((item)=>{
			if(total_length === 0) total_length = 1;
			total_length*= item;
		});
		a = new Float64Array(total_length);
		a._shape = shape;
	}else{
		throw Error("Unsupported Input");
	}
	return a;
}
// let mxnewshape = mxcreate([0,0]);
function verify_pairwise(m1,m2){
	if(typeof m1 === 'undefined' || typeof m2 === 'undefined') throw Error('Not enough input arguments');

	let bshape = m2._shape;
	let ashape = m1._shape;
	let len_a = ashape.length;
	let len_b = bshape.length;
	let numDim = (bshape.length > ashape.length)?len_b:len_a;
	let mxnewshape = mxcreate([1,numDim]);

	for(let i = 0; i< numDim;i++){
		if(i > len_a-1){
			mxnewshape[i] = bshape[i];
		}else if(i > len_b-1){
			mxnewshape[i] = ashape[i];
		}else{
			let curr_a = ashape[i];
			let curr_b = bshape[i];
			if(curr_b === curr_a) {
				mxnewshape[i] = curr_a;
			}else if( curr_a === 1 && curr_b !== 1){
				mxnewshape[i] = curr_b;
			}else if( curr_a !== 1 && curr_b === 1) {
				mxnewshape[i] = curr_a;
			}else {
				throw Error("Dimension mismatch");
			}
		}
	}
	return mxcreate(Array.from(mxnewshape));
}

function pairwise(m1,m2, func_ptr) {
	let total = verify_pairwise(m1,m2);
	traverse_pairwise(total, m1, m2, func_ptr,0,0, 1, 0,1,0,1);
	return total;
}



function traverse_pairwise(total, a, b, func_ptr,idx, offset_tot, mult_tot, offset_a,mult_a,offset_b,mult_b) {
	let ashape = a._shape;
	let bshape = b._shape;
	let total_shape = total._shape;
	let len_dim = total_shape[idx];
	// console.log(total_shape.length, len_dim);
	for(let i = 0; i < len_dim;i++){
		// console.log(i, len_dim);
		// Total
		let new_offset_tot = offset_tot + i * mult_tot;
		let new_mult_tot = mult_tot * total_shape[idx];
		// a
		let new_offset_a;
		let new_mult_a;
		if ( idx > ashape.length-1 || i > ashape[idx]-1){
			new_offset_a = offset_a;
			new_mult_a = mult_a;
		}else{
			new_offset_a = offset_a + i * mult_a;
			new_mult_a = mult_a * ashape[idx];
		}

		// b
		let new_offset_b;
		let new_mult_b;
		if( idx > bshape.length-1 || i > bshape[idx]-1){
			new_offset_b = offset_b;
			new_mult_b = mult_b;
		}else {
			new_offset_b = offset_b + i * mult_b;
			new_mult_b = mult_b * bshape[idx];
		}
		console.log(idx , total_shape.length - 1);
		if (idx === total_shape.length - 1) {
			// console.log(new_offset_tot, new_offset_a, new_offset_b);
			total[new_offset_tot] = func_ptr(a[new_offset_a], b[new_offset_b]);
		} else {
			// console.log("what");
			traverse_pairwise(total, a,b,func_ptr,idx+1,  new_offset_tot, new_mult_tot, new_offset_a,new_mult_a,new_offset_b,new_mult_b);
		}
	}
}

let a = mxcreate([1,2]);
let b = mxcreate([1,2]);
a[0] = 1;
a[1] = 2;
b[0] = 1;
b[1] = 3;
console.log(pairwise(a,b,(f1,f2)=>f1+f2));

let c = mxcreate([1,0]);
c[0] = 1;
let d = mxcreate([0,0,0,0]);
console.log(pairwise(c,d,(f1,f2)=>f1+f2));