(module
;; @name $verify_input_and_instantiate_result_concatation
;; @module Concatanation
;; @description Verifies the input for concatanation along a dimension
;; and returns an instantiated matrix with the right size and dimension for the
;; matrices being concatanated.
;; NOTE: Matlab is not consistent on how they define the function
;; and how they implement it. For instance a 1x1 array will be 
;; concatanated with a 0x0 array, even though in the function description
;; They require the input matrices to have the same dimension value
    (func $verify_input_and_instantiate_result_concatation (param $dim i32)(param $input_arrays i32)(result i32)
        (local $length_input i32) (local $first_array_ptr i32)(local $shape_len i32)(local $shape_first i32)
        (local $new_length_column f64)(local $i i32)(local $j i32)
        (local $temp_mat_ptr i32)
        (local $temp_mat_shape_ptr i32)
        ;; Requires $dim to be 1 or greater
        get_local $dim
        i32.const 1
        i32.lt_s
        if
            i32.const 12
            call $throwError
        end

        get_local $input_arrays
        call $is_null
        get_local $input_arrays
        call $numel
        tee_local $length_input
        i32.eqz
        i32.or
        if
            (call $create_mxarray_empty (i32.const 2)
                (i32.const 0)(i32.const 0)(i32.const 0))
            return
        end
        (set_local $first_array_ptr 
            (call $get_array_index_i32 (get_local $input_arrays)(i32.const 1)))
        (set_local $shape_first 
            (call $size (get_local $first_array_ptr)(i32.const 0)))
        (tee_local $shape_len 
            (call $numel (get_local $shape_first)))
        get_local $dim
        i32.lt_s
        if
            i32.const 13
            call $throwError
        end
        (set_local $new_length_column 
            (call $get_array_index_f64 (get_local $shape_first)(get_local $dim)))
        (set_local $i (i32.const 2))

        ;; Loop and checks the shapes of each of the inputs
        ;; The must have the same length in each dimension for all except
        ;; the concatanating dimension
        loop
            block
                (br_if 0 (i32.gt_s (get_local $i)(get_local $length_input)))

                (set_local $temp_mat_ptr 
                    (call $get_array_index_i32 
                        (get_local $input_arrays)(get_local $i)))
                (tee_local $temp_mat_shape_ptr 
                    (call $size (get_local $temp_mat_ptr)(i32.const 0)))
                call $numel
                get_local $shape_len
                i32.ne
                ;; Throw error when they do not have the same number of dimensions
                if
                    i32.const 11
                    call $throwError
                end
                (set_local $j (i32.const 1))
                ;; Second loop, checks all the dimensions
                loop
                    block
                        (br_if 0 (i32.gt_s (get_local $j)(get_local $shape_len)))
                        ;; First condition $j != dim
                        (i32.and 
                            (i32.ne (get_local $dim)(get_local $j))
                            (f64.ne 
                                (call $get_array_index_f64 
                                    (get_local $shape_first)(get_local $j))
                                (call $get_array_index_f64 
                                    (get_local $temp_mat_shape_ptr)(get_local $j))))
                        if
                            i32.const 11
                            call $throwError
                        end
                    (set_local $j (i32.add (get_local $j)(i32.const 1)))
                    br 1
                    end
                end
                (set_local $new_length_column 
                    (f64.add (get_local $new_length_column)
                            (call $get_array_index_f64 (get_local $temp_mat_shape_ptr)(get_local $dim))))
                (set_local $i (i32.add (get_local $i) (i32.const 1)))
                br 1
            end
        end 
        ;; Use the size of first as shape, change length of 
        ;; concatanating dimension.
        
        (call $set_array_index_f64 
            (get_local $shape_first)(get_local $dim)(get_local $new_length_column))
        (call $create_mxarray_ND 
            (get_local $shape_first)
            (i32.const 0)
            (i32.const 0)
            (i32.const 0)
            (i32.const 0)
        ) 
        return 
    )
    (func $concat_into_result_matrix (param $concat_dim i32)(param $result_matrix_ptr i32)(param $input_matrices i32)
        (; Concanatanates each input matrix into result matrix , 
            $size_prev represents the offset of the current matrix in terms of the concatanating dimension
            calls traverse_concat, which recursively traverses a given matrix setting the result of the concatanating matrix ;)
        (local $concat_dim_length i32) (local $result_matrix_shape_ptr i32)(local $i i32)(local $size_prev i32)(local $curr_mat i32)

        (set_local $result_matrix_shape_ptr (call $size (get_local $result_matrix_ptr)(i32.const 0)))
        (set_local $concat_dim_length (call $get_array_index_f64 (get_local $result_matrix_shape_ptr)(get_local $concat_dim)))


        (set_local $length_input (call $numel (get_local $input_matrices)))
        (set_local $i (i32.const 1))
        loop
            block
            (br_if 0 (i32.gt_s (get_local $i)(get_local $length_input)))
            (set_local $curr_mat (call $get_array_index_f64 (get_local $input_matrices)(get_local $i)))
            (set_local $curr_mat_shape (call $size (get_local $curr_mat)(i32.const 0)))
            (call $traverse_concat 
                (get_local $concat_dim)
                (get_local $result_matrix_ptr)
                (get_local $concat_dim_length)
                (get_local $curr_mat)
                (get_local $curr_mat_shape)
                (get_local $size_prev)
                (i32.const 1) ;; First dim
                (i32.const 0)(i32.const 1)(i32.const 0)(i32.const 1)
            )
            (set_local $size_prev (i32.add (get_local $size_prev)(call $get_array_index_f64 (get_local $curr_mat_shape)(get_local $i))))
            (set_local $i (i32.add (get_local $i)(i32.const 1)))
            br 1
            end
        end
    )

    (func $traverse_concat (param $concat_dim i32)(param $total_ptr i32)(param $total_new_dim_size i32)(param $mat_ptr i32)
        (; Traverses a current matrix completely and sets the right indices on the result matrix;)
        (param $mat_shape_ptr i32)(param $size_prev i32)(param $curr_dim i32)(param $offset i32)
        (param $mult i32)(param $offset_tot i32)(param $mult_tot i32)
        (local $i i32)(local $shape_dim_len i32)(local $shape_len i32)(local $new_offset i32)(local $new_mult i32)
        (local $new_offset_tot i32)(local $new_mult_tot i32)(local $i_index i32)

        (set_local $shape_dim_len (i32.trunc_s/f64 (call $get_array_index_f64 (get_local $mat_shape_ptr)(get_local $curr_dim))))
        (set_local $shape_len (call $numel (get_local $mat_shape_ptr)))
        (set_local $i (i32.const 1))
        loop
            block
                (br_if 0 (i32.gt_s (get_local $i)(get_local $shape_dim_len)))
                (set_local $i_index (i32.sub (get_local $i)(i32.const 1)))
                (set_local $new_offset 
                    (i32.add (get_local $offset)
                        (i32.mul (get_local $mult)(get_local $i_index))))
                (set_local $new_mult 
                    (i32.mul (get_local $mult)(get_local $shape_dim_len)))
                get_local $curr_dim
                get_local $concat_dim
                i32.eq
                if
                   (set_local $new_offset_tot 
                    (i32.add (i32.add (get_local $size_prev)(get_local $offset_tot))
                        (i32.mul (get_local $mult_tot)(get_local $i_index))))
                    (set_local $new_mult_tot 
                        (i32.mul (get_local $mult_tot)(get_local $total_new_dim_size)))
                else
                    (set_local $new_offset_tot 
                        (i32.add 
                            (get_local $offset_tot)
                            (i32.mul (get_local $mult_tot)(get_local $i_index))))
                    (set_local $new_mult_tot 
                        (i32.mul (get_local $mult_tot)(get_local $shape_dim_len)))
                end
                get_local $curr_dim
                get_local $shape_len
                i32.eq
                if
                    (call $set_array_index_f64 (get_local $total_ptr)(i32.add (get_local $new_offset_tot)(i32.const 1))
                        (call $get_array_index_f64 (get_local $mat_ptr)(i32.add (get_local $new_offset)(i32.const 1))))
                else
                    (call $traverse_concat 
                        (get_local $concat_dim)
                        (get_local $result_matrix_ptr)
                        (get_local $concat_dim_length)
                        (get_local $mat_ptr)
                        (get_local $mat_shape_ptr)
                        (get_local $size_prev)
                        (i32.add (get_local $curr_dim)(i32.const 1))
                        (get_local $new_offset)(get_local $new_mult)(get_local $new_offset_tot)(get_local $new_mult_tot)
                    )
                end
                (set_local $i (i32.add (get_local $i)(i32.const 1)))
                br 1
            end
        end    
    )

)