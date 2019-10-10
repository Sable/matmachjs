export interface MatMachWasm {

	mem:WebAssembly.Memory;
	___errno_location():number;

	_sbrk(...args):number;

	_free(...args):number;

	_malloc(...args):number;

	get_stack_top():number;

	undefined():number;

	tic():number;

	toc():number;

	get_heap_top_ptr():number;

	mxarray_core_get_array_ptr(...args):number;

	get_mxarray_dimension_number(...args):number;

	copy_mxarray_header(...args):number;

	copy_mxarray_structure(...args):number;

	create_mxarray_2D(...args):number;

	isequaln(...args):number;

	isequaln_two(...args):number;

	isequal(...args):number;

	isequal_two(...args):number;

	create_mxarray_ND(...args):number;

	get_array_index_i8(...args):number;

	set_array_index_i8(...args):number;

	get_array_index_i32(...args):number;

	set_array_index_i32(...args):number;

	create_mxarray_empty(...args):number;

	create_mxmatrix(...args):number;

	create_mxvector(...args):number;

	set_array_index_i32_no_check(...args):number;

	get_array_index_i32_no_check(...args):number;

	set_array_index_f64_no_check(...args):number;

	get_array_index_f64_no_check(...args):number;

	get_array_index_f64(...args):number;

	set_array_index_f64(...args):number;

	mxarray_core_set_type_attribute(...args):number;

	mxarray_core_get_simple_class_byte_size(...args):number;

	mxarray_core_get_mclass(...args):number;

	mxarray_core_get_simple_class(...args):number;

	get_array_byte_size(...args):number;

	mxarray_core_get_array_length(...args):number;

	get_elem_byte_size(...args):number;

	is_real(...args):number;

	is_signed(...args):number;

	numel(...args):number;

	size_S(...args):number;

	size_M(...args):number;

	size(...args):number;

	mxarray_core_get_dimensions_ptr(...args):number;

	ndims(...args):number;

	isscalar(...args):number;

	ones_S():number;

	length(...args):number;

	ismatrix(...args):number;

	isempty(...args):number;

	isrow(...args):number;

	iscolumn(...args):number;

	isvector(...args):number;

	linespace_SSS(...args):number;

	linespace_SS(...args):number;

	colon_two(...args):number;

	colon_three(...args):number;

	free_macharray(...args):number;

	colon(...args):number;

	clone(...args):number;

	set_array_value_multiple_indeces_f64(...args):number;

	get_array_value_multiple_indeces_f64(...args):number;

	get_f64(...args):number;

	get_f64_one_index_SM(...args):number;

	get_f64_one_index_colon(...args):number;

	get_f64_one_index_spread(...args):number;

	set_f64(...args):number;

	get_stride_f64_all_M(...args):number;

	set_stride_f64_all_MS(...args):number;

	set_stride_f64_all_MM(...args):number;

	memcpy(...args):number;

	reshape(...args):number;

	verify_input_and_instantiate_result_concatation(...args):number;

	cat_S(...args):number;

	cat_M(...args):number;

	cat_SM(...args):number;

	cat_MM(...args):number;

	concat(...args):number;

	vertcat(...args):number;

	horzcat(...args):number;

	horzcat_corder(...args):number;

	eye_2D(...args):number;

	eye(...args):number;

	transpose_S(...args):number;

	transpose_M(...args):number;

	rand(...args):number;

	rand_2D(...args):number;

	randn_2D(...args):number;

	end(...args):number;

	zeros_2D(...args):number;

	ones_2D(...args):number;

	ones(...args):number;

	ones_experimental(...args):number;

	ones_experimental2(...args):number;

	zeros(...args):number;

	fill(...args):number;

	randn(...args):number;

	size_MS(...args):number;

	create_mxarray_with_initial_value(...args):number;

	randi_2D(...args):number;

	randi(...args):number;

	mod_SS(...args):number;

	rem_SS(...args):number;

	times_SS(...args):number;

	mpower_SS(...args):number;

	mpower_MM(...args):number;

	mpower_MS(...args):number;

	mpower_SM(...args):number;

	mrdivide_SS(...args):number;

	mrdivide_SM(...args):number;

	mrdivide_MS(...args):number;

	mldivide_SS(...args):number;

	mldivide_SM(...args):number;

	mldivide_MS(...args):number;

	mrdivide_MM(...args):number;

	mldivide_MM(...args):number;

	rdivide_SS(...args):number;

	ldivide_SS(...args):number;

	le_SS(...args):number;

	lt_SS(...args):number;

	ge_SS(...args):number;

	gt_SS(...args):number;

	eq_SS(...args):number;

	and_SS(...args):number;

	or_SS(...args):number;

	ne_SS(...args):number;

	disp_M(...args):number;

	disp_S(...args):number;

	plus_SS(...args):number;

	plus2_SM(...args):number;

	plus_MS(...args):number;

	minus_SS(...args):number;

	minus_MM(...args):number;

	minus_SM(...args):number;

	minus_MS(...args):number;

	times_MS(...args):number;

	plus_SM(...args):number;

	times_SM(...args):number;

	times2_SM(...args):number;

	rem_SM(...args):number;

	rem_MS(...args):number;

	rem_MM(...args):number;

	mod_SM(...args):number;

	mod_MS(...args):number;

	mod_MM(...args):number;

	rdivide_SM(...args):number;

	rdivide_MS(...args):number;

	rdivide_MM(...args):number;

	ldivide_SM(...args):number;

	ldivide_MS(...args):number;

	ldivide_MM(...args):number;

	power_MS(...args):number;

	power_SM(...args):number;

	power_MM(...args):number;

	mxarray_size_MS_nocheck(...args):number;

	mxarray_stride_MS_nocheck(...args):number;

	le_SM(...args):number;

	le_MS(...args):number;

	le_MM(...args):number;

	lt_SM(...args):number;

	lt_MS(...args):number;

	lt_MM(...args):number;

	ge_SM(...args):number;

	ge_MS(...args):number;

	ge_MM(...args):number;

	gt_SM(...args):number;

	gt_MS(...args):number;

	gt_MM(...args):number;

	eq_SM(...args):number;

	eq_MS(...args):number;

	eq_MM(...args):number;

	and_SM(...args):number;

	and_MS(...args):number;

	and_MM(...args):number;

	or_SM(...args):number;

	or_MS(...args):number;

	or_MM(...args):number;

	ne_SM(...args):number;

	ne_MS(...args):number;

	ne_MM(...args):number;

	times_MM(...args):number;

	plus_MM_broadcasting(...args):number;

	power_MM_broadcasting(...args):number;

	times_MM_broadcasting(...args):number;

	plus_MM(...args):number;

	verify_pairwise(...args):number;

	sum_S(...args):number;

	prod_M(...args):number;

	sum_M(...args):number;

	sum_all_M(...args):number;

	prod_all_M(...args):number;

	mean_all_M(...args):number;

	prod_MM(...args):number;

	sum_MM(...args):number;

	prod_MS(...args):number;

	sum_MS(...args):number;

	mean_MSS(...args):number;

	mean_MS(...args):number;

	mean_M(...args):number;

	mean(...args):number;

	sum(...args):number;

	any(...args):number;

	all_nonzero_reduction(...args):number;

	any_nonzero_reduction(...args):number;

	all(...args):number;

	prod(...args):number;

	convert_scalar_to_mxarray(...args):number;

	mtimes_SM(...args):number;

	mtimes_MS(...args):number;

	mtimes_MM(...args):number;

	floor_S(...args):number;

	round_S(...args):number;

	round_M(...args):number;

	ceil_S(...args):number;

	sqrt_S(...args):number;

	uminus_S(...args):number;

	uplus_S(...args):number;

	abs_S(...args):number;

	fix_S(...args):number;

	sqrt_M(...args):number;

	ceil_M(...args):number;

	uminus_M(...args):number;

	uplus_M(...args):number;

	abs_M(...args):number;

	not_S(...args):number;

	not_M(...args):number;

	fix_M(...args):number;

	sin_M(...args):number;

	sin_M_noallocation(...args):number;

	cos_M(...args):number;

	tan_M(...args):number;

	exp_M(...args):number;

	log_M(...args):number;

	log10_M(...args):number;

	log2_M(...args):number;

	floor_M(...args):number;

	gcCheckExternalToIncreaseRCSite(...args):number;

	gcGetExternalFlag(...args):number;

	gcSetExternalFlag(...args):number;

	gcCheckExternalToDecreaseRCSite(...args):number;

	gcGetRC(...args):number;

	gcCheckExternalToSetReturnFlagAndSetRCZero(...args):number;

	gcCheckExternalAndReturnFlagToFreeSite(...args):number;

	gcCheckExternalToResetReturnFlag(...args):number;

	gcInitiateRC(...args):number;

	gcDecreaseRCSite(...args):number;

	gcIncreaseRCSite(...args):number;

	gcSetReturnFlagAndSetRCToZero(...args):number;

	gcSetRCToZero(...args):number;

	gcCheckReturnFlagToFreeSite(...args):number;

	gcFreeSite(...args):number;

	gcGetReturnFlag(...args):number;

	gcResetReturnFlag(...args):number;


}