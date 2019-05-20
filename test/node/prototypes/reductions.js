

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
function mxclone (arr){
	let shape_new = arr._shape.map(it=>it);
	let a = mxcreate(shape_new);
	arr.forEach((it,i)=>a[i] = it);
	return a;
}
function findFirstNonSingletonDim(arr_size=[]){
	for(let i = 0;i<arr_size.length;i++){
		if(arr_size[i]> 1){
			return i;
		}
	}
	return 0;
}
function reduce(arr = mxcreate([1,1]),dim, nanFlag=false){
	if(arr.constructor !== Float64Array) throw new Error("Not enough input arguments.");
	if(dim < 0) throw new Error("Dimension argument must be a positive integer scalar within\n" + "indexing range.");
	else if(typeof dim === 'undefined') dim = findFirstNonSingletonDim(arr._size);
	if(dim === -1 || dim > arr._shape.length-1 || arr._shape[dim] === 1) return mxclone(a);
	let shape = Float64Array.from(arr._shape);
	shape[dim] = 1;
	let new_arr = mxcreate(Array.from(shape));
	traverse_reduce(new_arr, arr, arr._shape,dim, 0,0,1,0,1);
	return new_arr;

}
function traverse_reduce(res_arr, arr,shape, dim, curr_dim, offset_tot, mult_tot, offset, mult){
	for (let i  = 0;i <  shape[curr_dim];i++){
		// Calculating offset current matrix
		let new_offset = offset + i*mult;
		let new_mult = mult*shape[curr_dim];
		let new_offset_tot;
		let new_mult_tot;
		if( dim === curr_dim){
			new_offset_tot =  offset_tot;
			new_mult_tot = mult_tot;
		}else{
			new_offset_tot = offset_tot + i*mult_tot;
			new_mult_tot = mult_tot*shape[curr_dim];
		}
		if (curr_dim === shape.length -1) {
			res_arr[new_offset_tot] += arr[new_offset];
		}else{
			traverse_reduce(res_arr, arr, shape,dim, curr_dim+1, new_offset_tot, new_mult_tot, new_offset, new_mult);
		}
	}
}

let a = mxcreate([1,3]);
a.forEach((it,i)=>a[i]=i); //[0,2,4;1,3,5]
console.log(reduce(a,1));
