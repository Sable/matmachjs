


export interface MatWablyBuiltin{
	memory_get_heap_top():number;

	memory_malloc(i32_0:number):number;

	memory_free(i32_0: number): number;

	memory_realloc(i32_0: number, i32_1: number): number;

	memory_get_mem_free_bit(i32_0:number):number;

	memory_get_mem_payload_size(i32_0:number):number;

	memory_get_free_bit_from_array(i32_0:number):number;

	memory_get_mem_free_bit_footer(i32_0:number):number;

	mxarray_core_get_array_ptr(i32_0:number):number;

	mxarray_core_set_type_attribute(i32_0:number, i32_1:number, 
			i32_2:number, i32_3:number):number;

	mxarray_core_element_byte_size(i32_0:number):number;



	mxarray_core_get_simple_class_byte_size(i32_0:number):number;

	mxarray_core_get_mclass(i32_0:number):number;

	mxarray_core_get_simple_class(i32_0:number):number;

	mxarray_core_get_array_length(i32_0:number):number;

	mxarray_core_dimension_number(i32_0:number):number;

	mxarray_core_create_mxarray_ND(i32_0:number, i32_1?:number, i32_2?:number, i32_3?:number, i32_4?:number):number;

	mxarray_core_create_mxarray_empty(i32_0:number, i32_1?:number, i32_2?:number, i32_3?:number):number;

	mxarray_core_create_mxvector(i32_0:number, i32_1?:number, i32_2?:number, i32_3?:number, i32_4?:number, i32_5?:number):number;

	get_array_index_i8(i32_0:number, i32_1:number):number;

	set_array_index_i8(i32_0:number, i32_1:number, i32_2:number):number;

	get_array_index_i32(i32_0:number, i32_1:number):number;

	set_array_index_i32(i32_0:number, i32_1:number, i32_2:number):number;

	get_array_index_f64(i32_0:number, i32_1:number):number;

	set_array_index_f64(i32_0:number, i32_1:number, f64_2:number):number;


	get_array_byte_size(i32_0:number):number;


	get_elem_byte_size(i32_0:number):number;

	is_real(i32_0:number):number;

	is_signed(i32_0:number):number;

	numel(i32_0:number):number;

	size(i32_0:number, i32_1?:number):number;

	ndims(i32_0:number):number;

	isscalar(i32_0:number):number;

	length_S(i32_0:number):number;

	length_M(i32_0:number):number;

	ismatrix(i32_0:number):number;

	isempty(i32_0:number):number;

	isrow(i32_0:number):number;

	iscolumn(i32_0:number):number;

	isvector(i32_0:number):number;

	colon(i32_0:number):number;

	clone(i32_0:number):number;

	get_f64(i32_0:number, i32_1:number):number;

	set_f64(i32_0:number, i32_1:number, i32_2:number):number;

	reshape(i32_0:number, i32_1:number):number;

	verify_input_and_instantiate_result_concatation(i32_0:number, i32_1:number):number;

	concat(i32_0:number, i32_1:number):number;

	COLON_TOKEN():number;

	vertcat(i32_0:number):number;

	horzcat(i32_0:number):number;

	eye_S():number;

	eye_M(i32_0:number):number;

	transpose_S(f64_0:number):number;

	transpose_M(i32_0:number):number;

	zeros(i32_0:number, i32_1:number):number;

	ones(i32_0:number, i32_1:number):number;

	rand(i32_0:number, i32_1:number):number;

	randn(i32_0:number):number;

	randi(f64_0:number, i32_1:number, i32_2:number):number;

	mod_SS(f64_0:number, f64_1:number):number;

	rem_SS(f64_0:number, f64_1:number):number;

	times_SS(f64_0:number, f64_1:number):number;

	rdivide_SS(f64_0:number, f64_1:number):number;

	le_SS(f64_0:number, f64_1:number):number;

	lt_SS(f64_0:number, f64_1:number):number;

	ge_SS(f64_0:number, f64_1:number):number;

	gt_SS(f64_0:number, f64_1:number):number;

	eq_SS(f64_0:number, f64_1:number):number;

	and_SS(f64_0:number, f64_1:number):number;

	or_SS(f64_0:number, f64_1:number):number;

	ne_SS(f64_0:number, f64_1:number):number;

	disp_M(i32_0:number):number;

	disp_S(i32_0:number):number;

	plus_SS(f64_0:number, f64_1:number):number;

	plus_MM(i32_0:number, i32_1:number):number;

	plus_SM(f64_0:number, i32_1:number):number;

	plus_MS(i32_0:number, f64_1:number):number;

	minus_SS(f64_0:number, f64_1:number):number;

	minus_MM(i32_0:number, i32_1:number):number;

	minus_SM(f64_0:number, i32_1:number):number;

	minus_MS(i32_0:number, f64_1:number):number;

	times_MS(i32_0:number, f64_1:number):number;

	times_SM(f64_0:number, i32_1:number):number;

	times_MM(i32_0:number, i32_1:number):number;

	rem_SM(f64_0:number, i32_1:number):number;

	rem_MS(i32_0:number, f64_1:number):number;

	rem_MM(i32_0:number, i32_1:number):number;

	mod_SM(f64_0:number, i32_1:number):number;

	mod_MS(i32_0:number, f64_1:number):number;

	mod_MM(i32_0:number, i32_1:number):number;

	rdivide_SM(f64_0:number, i32_1:number):number;

	rdivide_MS(i32_0:number, f64_1:number):number;

	rdivide_MM(i32_0:number, i32_1:number):number;

	ldivide_SM(f64_0:number, i32_1:number):number;

	ldivide_MS(i32_0:number, f64_1:number):number;

	ldivide_MM(i32_0:number, i32_1:number):number;

	power_SM(f64_0:number, i32_1:number):number;

	power_MS(i32_0:number, f64_1:number):number;

	power_MM(i32_0:number, i32_1:number):number;

	le_SM(f64_0:number, i32_1:number):number;

	le_MS(i32_0:number, f64_1:number):number;

	le_MM(i32_0:number, i32_1:number):number;

	lt_SM(f64_0:number, i32_1:number):number;

	lt_MS(i32_0:number, f64_1:number):number;

	lt_MM(i32_0:number, i32_1:number):number;

	ge_SM(f64_0:number, i32_1:number):number;

	ge_MS(i32_0:number, f64_1:number):number;

	ge_MM(i32_0:number, i32_1:number):number;

	gt_SM(f64_0:number, i32_1:number):number;

	gt_MS(i32_0:number, f64_1:number):number;

	gt_MM(i32_0:number, i32_1:number):number;

	eq_SM(f64_0:number, i32_1:number):number;

	eq_MS(i32_0:number, f64_1:number):number;

	eq_MM(i32_0:number, i32_1:number):number;

	and_SM(f64_0:number, i32_1:number):number;

	and_MS(i32_0:number, f64_1:number):number;

	and_MM(i32_0:number, i32_1:number):number;

	or_SM(f64_0:number, i32_1:number):number;

	or_MS(i32_0:number, f64_1:number):number;

	or_MM(i32_0:number, i32_1:number):number;

	ne_SM(f64_0:number, i32_1:number):number;

	ne_MS(i32_0:number, f64_1:number):number;

	ne_MM(i32_0:number, i32_1:number):number;

	verify_pairwise(i32_0:number, i32_1:number):number;

	sum_S(f64_0:number):number;

	sum(i32_0:number, i32_1:number, i32_2?:number):number;

	any(i32_0:number, i32_1:number):number;

	all(i32_0:number, i32_1:number):number;

	prod(i32_0:number, i32_1:number, i32_2?:number):number;

	convert_scalar_to_mxarray(f64_0:number):number;

	mtimes_SM(f64_0:number, i32_1:number):number;

	mtimes_MS(i32_0:number, f64_1:number):number;

	mtimes_MM(i32_0:number, i32_1:number):number;

	round_S(f64_0:number):number;

	round_M(i32_0:number):number;

	ceil_S(f64_0:number):number;

	ceil_M(i32_0:number):number;

	sqrt_S(f64_0:number):number;

	sqrt_M(i32_0:number):number;

	uminus_S(f64_0:number):number;

	uminus_M(i32_0:number):number;

	uplus_S(f64_0:number):number;

	uplus_M(i32_0:number):number;

	abs_S(f64_0:number):number;

	abs_M(i32_0:number):number;

	not_S(f64_0:number):number;

	not_M(i32_0:number):number;

	fix_S(f64_0:number):number;

	fix_M(i32_0:number):number;

	sin_M(i32_0:number):number;

	cos_M(i32_0:number):number;

	tan_M(i32_0:number):number;

	exp_M(i32_0:number):number;

	log_M(i32_0:number):number;

	log10_M(i32_0:number):number;

	log2_M(i32_0:number):number;

}
