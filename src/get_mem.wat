(module $memory
    ;; (import "js" "mem" (memory $mem 1))
    ;; (import "js" "printError" (func $printError (param i32 i32)(result i32)))
    ;; (import "js" "printString" (func $printString (param i32 i32)(result i32)))
    ;; (import "js" "printDouble" (func $printDouble (param i32)(result i32)))
    ;; (import "js" "printDoubleNumber" (func $printDoubleNumber (param f64) (result f64)))    
    ;; (import "test" "assert" (func $assert (param i32 i32)))
    ;; Dummy variables which will be commented out
    (func $printString (param i32 i32)(result i32) i32.const 1)
    (func $printError (param i32 i32)(result i32) i32.const 1)
    (func $printDouble (param i32)(result i32) i32.const 1)
    (func $printDoubleNumber (param f64) (result f64) f64.const 0)
    (func $assert (param i32 i32))

    (global $ASSERT_HEADER_FLAG i32 (i32.const 1))
    (memory $mem 1 5)
    (export "mem" (memory $mem))

    (global $HEAP_TOP (mut i32) (i32.const 32764)) ;; For off from alignment due to the footer/header size of four
    (global $HEAP_START (mut i32) (i32.const 32764))
    (global $PAGE_SIZE i32 (i32.const 65536))
    (global $FLAG_CHECK_SIZE_MEM (mut i32) (i32.const 1)) ;; Should be imported
    ;; (start $init)
    (func $init 
        (local i32 i32 i32 i32 i32)
        i32.const 100
        set_local 0
        i32.const 97
        set_local 1
        i32.const 118
        set_local 2
        i32.const 105
        set_local 3
        i32.const 100
        set_local 4
        get_global $HEAP_TOP
        get_local 0
        i32.store8 offset=0
        get_global $HEAP_TOP
        get_local 1
        i32.store8 offset=1
        get_global $HEAP_TOP
        get_local 2
        i32.store8 offset=2
        get_global $HEAP_TOP
        get_local 3
        i32.store8 offset=3
        get_global $HEAP_TOP
        get_local 4 
        i32.store8 offset=4
        ;; get_global $HEAP_TOP
        ;; i32.const 5
        ;; call $printString
        ;; drop
        ;; i32.const 136
        ;; f64.const 20
        ;; f64.store
        i32.const 136
        i32.load offset=0
        call $printDouble
        drop
        get_global $HEAP_TOP
        i32.const 8
        i32.add
        set_global $HEAP_TOP
       
    )

    (data $mem (i32.const 0) "Out-of-memory, trying to allocate a larger memory than available\n\00\00\00\00\00\00\00\00Error: Negative length is not allowed in this context\n")
    (data $mem (i32.const 136) "Index out-of-bound\n\00\00\00\00\00\00")
    (data $mem (i32.const 160) "Index exceeds matrix dimensions\00\00")
    (data $mem (i32.const 198) "Subscript indices must either be real positive integers or logicals\00\00\00\00\00\00")
    (data $mem (i32.const 272) "Size vector should be a row vector with real elements.")
    (data $mem (i32.const 328) "Not enough input arguments.")
    (data $mem (i32.const 360) "Too many input arguments.")
    (data $mem (i32.const 384) "Error in null.")
    

    ;; (data $mem (i32.const 136) "\f3\e0\01\00")

    ;; (data  $mem (i32.const 80) "Error: Negative length is not allowed in this context\n")
    ;;
    (func $throwError (param $error i32)
        (local $offset i32)(local $length i32)
        (;
            Errors:
                0: "Allocating larger memory than expected"
                1: "Negative length is not allowed in this context"
                2: "Index out-of-bounds"
        ;)
        block  block  block block block block block block block block
            get_local $error
            br_table 0 1 2 3 4 5 6 7 8 
            end
               (set_local $offset (i32.const 0))
               (set_local $length (i32.const 65))
               br 8
            end
               (set_local $offset (i32.const 80))
               (set_local $length (i32.const 47))
               br 7
            end 
              (set_local $offset (i32.const 136))
              (set_local $length (i32.const 10)) 
               br 6
            end
                (set_local $offset (i32.const 160))
                (set_local $length (i32.const 31)) 
                br 5
            end
                (set_local $offset (i32.const 198))
                (set_local $length (i32.const 67)) 
                br 4
            end
                (set_local $offset (i32.const 272))
                (set_local $length (i32.const 54)) 
                br 3
            end
                (set_local $offset (i32.const 328))
                (set_local $length (i32.const 27)) 
                br 2
            end
                (set_local $offset (i32.const 360))
                (set_local $length (i32.const 24)) 
                br 1
            end
                (set_local $offset (i32.const 384))
                (set_local $length (i32.const 13)) 
                br 0
        end 
        get_local $offset
        get_local $length
        call $printError
        drop
        unreachable
    )
    

    (func $main
        ;; For testing purposes
    )
    (func $get_flag_check_size_mem (result i32)
        get_global $FLAG_CHECK_SIZE_MEM
    )
    (func $set_flag_check_size_mem (param i32) (result i32)
        get_local 0
        set_global $FLAG_CHECK_SIZE_MEM
        get_global $FLAG_CHECK_SIZE_MEM
    )
    (export "size_s" (func $size_s))
    (func $size_s (param $type i32) (result i32)
        (local $type_size i32)
        ;; @name size_s#memory  
        ;; @param $type Contains the type for the array, 
        ;;    i.e double | single | int8 | int16 | int32 | int64 | uint8 | uint16 | uint32 | uint64
        ;; @return i32, size for that type
        ;; @description
        ;;      Create a 1d array of $n size
        ;;      and type
        ;; TODO: Expand to also unsigned types
           block block block block block
            get_local $type
            br_table 0 1 2 3 4
            end
            ;; 64
            (set_local $type_size (i32.const 8))
            br 3
            end
            ;; 32
            (set_local $type_size (i32.const 4))
            br 2
            end
            ;; 16
            (set_local $type_size (i32.const 2))
            br 1
            end
            ;; 8
            (set_local $type_size (i32.const 1))
        end
        (return (get_local $type_size))
    )
    (export "get_array_start" (func $get_array_start))
    (func $get_array_start (param $arr_header i32)(result i32)
        get_local $arr_header
        i32.load offset=8 align=4
        return
    )
    (export "get_mxarray_dimension_number" (func $get_mxarray_dimension_number))
    (func $get_mxarray_dimension_number (param $dim_array_ptr i32) (result i32)
        (local $dim_number i32)(local $i i32)(local $temp f64)(local $one_index i32)(local $input_dim_array_ptr i32)
        (local $dim_array_elem_byte_size i32)
        (set_local $dim_array_elem_byte_size (call $get_array_byte_size (get_local $dim_array_ptr)))
        (set_local $dim_number (i32.load offset=4 align=4 (get_local $dim_array_ptr)))
        (set_local $input_dim_array_ptr (call $get_array_start (get_local $dim_array_ptr)))
        loop
            block
                (br_if 0 (i32.eq (get_local $i)(get_local $dim_number))) ;; condition
                (tee_local $temp (f64.load (i32.add (get_local $input_dim_array_ptr) (i32.mul (get_local $dim_array_elem_byte_size)(get_local $i)))))
                f64.const 1
                f64.eq
                get_local $i
                i32.const 2
                i32.ge_s
                i32.and
                if
                    get_local $one_index                
                    i32.eqz
                    if
                        (set_local $one_index (get_local $i))
                    end
                else
                    (set_local $one_index (i32.const 0))
                end
               (set_local $i (i32.add (get_local $i)(i32.const 1)));; Increase here so that we do not have to increase later
                br 1
            end
        end
        get_local $one_index
        i32.eqz
        if (result i32)
            get_local $dim_number
        else
            get_local $one_index
        end
    )

    (export "create_mxarray_ND" (func $create_mxarray_ND))
    (func $create_mxarray_ND  (param $dim_array i32)(param $class i32) (param $simple_class i32)
    (param $complex i32)(param $byte_size_elem i32)
    (result i32)
    (;
        TODO(dherre3): This function assumes that the dimension array is a double.
        TODO(dherre3): Check that function handles empty input
        TODO(dherre3): Check capacity
        TODO(dherre3): Throw error if floating point input is not an integer
    ;)
        (local $dim_number i32)(local $array_length f64)(local $array_length_i32 i32)(local $loop_dim_number i32)
        (local $i i32) (local $input_dim_array_ptr i32) (local $temp f64) (local $header_size i32) (local $array_size i32)
        (local $array_data_ptr i32)(local $array_header_ptr i32)(local $dim_array_ptr i32)(local $input_dim_array_byte_size i32)
        ;; Get the size of bytes for type
        ;; ()
        get_local $dim_array
        call $get_array_length
        i32.eqz
        get_local $dim_array
        call $isrow
        i32.eqz
        i32.or 
        if
            i32.const 5
            call $throwError
        end
        (set_local $input_dim_array_byte_size (call $get_array_byte_size (get_local $dim_array)))
        (tee_local $loop_dim_number (call $get_mxarray_dimension_number (get_local $dim_array)))
        i32.const 1
        i32.eq
        if
            (set_local $dim_number (i32.add (i32.const 1)(get_local $loop_dim_number)))
        else 
            (set_local $dim_number (get_local $loop_dim_number))
        end
        ;; Get total array size
        (set_local $input_dim_array_ptr (call $get_array_start (get_local $dim_array)))
        get_local $byte_size_elem
        i32.eqz
        if
            get_local $class
            i32.eqz
            if
                (set_local $byte_size_elem (call $get_simple_class_byte_size (get_local $simple_class)))
            else
                (set_local $byte_size_elem (i32.const 4))
            end
        end
        (set_local $array_length (f64.const 1))
        ;; Allocate header
        i32.const 24
        call $malloc
        tee_local  $array_header_ptr
        get_local $dim_number
        i32.store offset=12 align=4 ;; Set dimensions
        
        ;; Allocate dimensions
        get_local $array_header_ptr
        (call $malloc (i32.add (i32.mul (get_local $dim_number)(i32.const 8))(i32.const 8)))
        i32.const 8
        i32.add
        tee_local $dim_array_ptr
        i32.store offset=16 align=4
         
        ;; Set dimensions and calculate array length
        loop
            block ;; array iteration
            (i32.eq (get_local $i)(get_local $loop_dim_number))
            br_if 0
            (tee_local $temp (f64.load (i32.add (get_local $input_dim_array_ptr) ;;(poly) This line needs to change to accomodate for other simple classes as input
                 (i32.mul (get_local $input_dim_array_byte_size)(get_local $i)))))
            f64.const 0
            f64.le
            if ;; If dimension is less than or equal 0
                (set_local $temp (f64.const 0))
            end
            
            ;; Get Array length
            (set_local $array_length 
                (f64.mul (get_local $array_length) (get_local $temp)))
            ;; Set dimension in dimension array
            (f64.store (i32.add (get_local $dim_array_ptr) (i32.mul (get_local $input_dim_array_byte_size)(get_local $i)))(get_local $temp))
            (set_local $i (i32.add (get_local $i)(i32.const 1))) ;; Increase loop counter
            br 1
            end
        end
        ;; Get i32 length
        (set_local $array_length_i32 (i32.trunc_s/f64 (get_local $array_length )))
        ;; Check if length is one, if it is set the other dimension to get an square matrix
        get_local $loop_dim_number
        i32.const 1
        i32.eq
        if
            (f64.store (i32.add (get_local $dim_array_ptr) (i32.mul (get_local $input_dim_array_byte_size)(get_local $i)))(get_local $temp))
            (set_local $array_length_i32 (i32.mul (get_local $array_length_i32)(get_local $array_length_i32)))            
        end
        ;; Setting capacity array dim
        get_local $dim_array_ptr
        i32.const 4
        i32.sub
        (i32.mul (get_local $dim_number)(i32.const 8))
        i32.store offset=0 align=4
    
        ;; Setting type attribute
        get_local $array_header_ptr
        get_local $class
        get_local $byte_size_elem
        get_local $simple_class
        call $set_type_attribute
        ;; Setting length
        get_local $array_header_ptr
        get_local $array_length_i32
        i32.store offset=4 align=4
        get_local $array_length_i32
        i32.eqz
        if
            get_local $array_header_ptr
            i32.const -1
            i32.store offset=8 align=4
        else
            ;;Setting Array data ptr, add 8 bytes, 4 for the capacity of the array, 4 for alignment
            get_local $array_header_ptr
            (tee_local $array_size (i32.add (i32.const 8)(i32.mul (get_local $array_length_i32)(get_local $byte_size_elem))))  
            call $malloc
            tee_local $array_data_ptr
            i32.const 8
            i32.add 
            i32.store offset=8 align=4
            ;; Set array capacity
            get_local $array_data_ptr
            get_local $array_size
            i32.store offset=4 align=4
        end

         ;; Setting array dim_number
        get_local $array_header_ptr
        get_local $dim_number
        i32.store offset=12 align=4
        
        ;; Set other attributes
        get_local $array_header_ptr
        ;; isscalar attribute
        get_local $array_length_i32
        i32.const 1
        i32.eq 
        i32.store8 offset=20 align=1
        get_local $array_header_ptr
        get_local $complex;; Complex
        i32.store8 offset=21 align=1
        get_local $array_header_ptr
    )

(export "get_array_index_i8" (func $get_array_index_i8))
    (func $get_array_index_i8 (param $array_ptr i32)(param $i i32)(result i32)
        (local $elem i32)
        get_local $array_ptr
        call $get_array_length
        get_local $i
        i32.lt_s
        if
            i32.const 3
            call $throwError
        end
        (set_local $i (i32.sub (get_local $i)(i32.const 1)))
        get_local $i
        i32.const 0
        i32.lt_s
        if
            i32.const 4
            call $throwError
        end
        get_local $array_ptr
        call $get_array_byte_size
        get_local $i
        i32.mul
        get_local $array_ptr
        call $get_array_start
        i32.add
        set_local $elem
        get_local $array_ptr
        call $is_signed
        if (result i32)
            get_local $elem
            i32.load8_s offset=0 align=1
        else 
            get_local $elem
            i32.load8_u offset=0 align=1
        end
    )
    (export "set_array_index_i8" (func $set_array_index_i8))
    (func $set_array_index_i8 (param $array_ptr i32)(param $i i32)(param $value i32)
        
        get_local $array_ptr
        call $get_array_start
        i32.const 8
        i32.sub
        i32.load offset=0 align=4
        get_local $i
        i32.lt_s
        if
            ;; TODO(dherre3): Grow array to require size
        end
        (set_local $i (i32.sub (get_local $i)(i32.const 1)))
        get_local $i
        i32.const 0
        i32.lt_s
        if
            i32.const 4
            call $throwError
        end
        
        get_local $array_ptr
        call $get_array_byte_size
        get_local $i
        i32.mul
        get_local $array_ptr
        call $get_array_start
        i32.add
        get_local $array_ptr
        call $is_signed
        if (result i32)
            get_local $value
            i32.const 127
            i32.gt_s
            if (result i32)
                i32.const 127
            else 
                get_local $value
                i32.const -128
                i32.lt_s
                if (result i32)
                    i32.const -128
                else 
                    get_local $value
                end
            end
        else 
            get_local $value
            i32.const 255
            i32.gt_s
            if (result i32)
                i32.const 255
            else 
                get_local $value
                i32.const 0
                i32.lt_s
                if (result i32)
                    i32.const 0
                else 
                    get_local $value                    
                end
            end
        end
        i32.store8 offset=0 align=1
    )
    (export "get_array_index_i32" (func $get_array_index_i32))
    (func $get_array_index_i32 (param $array_ptr i32)(param $i i32)(result i32)
        get_local $array_ptr
        call $get_array_length
        get_local $i
        i32.lt_s
        if
            i32.const 3
            call $throwError
        end
        (set_local $i (i32.sub (get_local $i)(i32.const 1)))
        get_local $i
        i32.const 0
        i32.lt_s
        if
            i32.const 4
            call $throwError
        end
        get_local $array_ptr
        call $get_array_byte_size
        get_local $i
        i32.mul
        get_local $array_ptr
        call $get_array_start
        i32.add
        i32.load offset=0 align=4
        return
    )
    (export "set_array_index_i32" (func $set_array_index_i32))
    (func $set_array_index_i32 (param $array_ptr i32)(param $i i32)(param $value i32)
        
        get_local $array_ptr
        call $get_array_start
        i32.const 8
        i32.sub
        i32.load offset=0 align=4
        get_local $i
        i32.lt_s
        if
            ;; TODO(dherre3): Grow array to require size
        end
        (set_local $i (i32.sub (get_local $i)(i32.const 1)))
        get_local $i
        i32.const 0
        i32.lt_s
        if
            i32.const 4
            call $throwError
        end
        get_local $array_ptr
        call $get_array_byte_size
        get_local $i
        i32.mul
        get_local $array_ptr
        call $get_array_start
        i32.add
        get_local $array_ptr
        call $is_signed
        if (result i32)
            get_local $value
            i32.const 2147483647
            i32.gt_s
            if (result i32)
                i32.const 2147483647
            else 
                get_local $value
                i32.const -2147483648
                i32.lt_s
                if (result i32)
                    i32.const -2147483648
                else 
                    get_local $value
                end
            end
        else 
            get_local $value
            i32.const 2147483647
            i32.gt_s
            if (result i32)
                i32.const 2147483647
            else 
                get_local $value
                i32.const 0
                i32.lt_s
                if (result i32)
                    i32.const 0
                else 
                    get_local $value                    
                end
            end
        end
        i32.store offset=0 align=4
    )
    
    (export "create_mxvector" (func $create_mxvector))
    (func $create_mxvector 
        (param $n i32)(param $simple_class i32)(param $class i32)(param $complex i32)(param $column i32)(param $elem_size i32) (result i32)
        (local $array_size i32)
        (local $header_pointer i32)(local $array_pointer i32)(local $dimension_ptr i32)
        (;
        
        ;)
        ;; Check size and if its smaller or equal to 0, set to 0;
        (i32.le_s (get_local $n) (i32.const 0))
        if
            (set_local $n (i32.const 0))
        end
        get_local $elem_size
        i32.eqz 
        if 
            get_local $class
            i32.eqz
            if
                (set_local $elem_size (call $get_simple_class_byte_size (get_local $simple_class)))
            else
                (set_local $elem_size (i32.const 4)) ;; For cell_array, string, function_handle, struct
            end
        end
        (set_local $array_size 
            (i32.mul 
                (get_local $elem_size)
                (get_local $n)))
        ;; Allocate header memory
        ;; 4 for type attribute, 4 for number of elements,  4 for array pointer,  4 for number of dimensions, 4 for dimension pointer , 4 attributes
        i32.const 24 
        call $malloc
        tee_local $header_pointer
        ;; Allocate array memory or return -1 if size is 0
        get_local $array_size
        i32.eqz
        if  (result i32)
            i32.const -1
            tee_local $array_pointer
        else
            get_local $array_size
            i32.const 8 ;; For capacity
            i32.add
            call $malloc
            tee_local $array_pointer
            get_local $array_size
            i32.store offset=4 align=4
            get_local $array_pointer
            i32.const 8
            i32.add
        end
        i32.store offset=8 align=4 ;; Store pointer to array



        ;; Set type attribute
        get_local $header_pointer
        get_local $class
        get_local $elem_size
        get_local $simple_class
        call $set_type_attribute
        
        ;; call set size of array
        get_local $header_pointer
        get_local $n
        i32.store offset=4 align=4 ;; Store pointer to array
        ;; Set number of dimensions
        get_local $header_pointer
        i32.const 2
        i32.store offset=12 align=4 ;; Store 
        get_local $header_pointer
        i32.const  24;; ((8*2) bytes for each dimension +  8 capacity)
        call $malloc
        tee_local $dimension_ptr
        i32.const 8
        i32.add
        i32.store offset=16 align=4
        ;; Set capacity in dimensions array
        get_local $dimension_ptr
        i32.const 16
        i32.store offset=4 align=4
        ;; Set dimensions in dimension array
        get_local $column
        i32.const 1
        i32.eq
        if
            get_local $dimension_ptr
            get_local $n
            f64.convert_s/i32
            f64.store offset=8 align=8
            get_local $dimension_ptr
            f64.const 1
            f64.store offset=16 align=8
        else
            get_local $dimension_ptr
            f64.const 1
            f64.store offset=8 align=8
            get_local $dimension_ptr
            get_local $n
            f64.convert_s/i32
            f64.store offset=16 align=8
        end
        ;; Set other attributes
        get_local $header_pointer
        get_local $complex
        i32.store8 offset=21 align=1
        get_local $header_pointer
        get_local $n
        i32.const 1
        i32.eq
        i32.store8 offset=20 align=1  ;; Scalar
        get_local $header_pointer
    )






    (export "create_array_1d" (func $create_array_1d))
    (func $create_array_1d (param $n i32) (param  $type i32) (result i32)
        (local $sizepayload i32) (local $pointer i32) (local $meta_size i32)(local $total_length i32)(local $array_ptr i32)
        (local $type_size i32) (local $realsize i32)
        ;; @name create_array_1d#memory  
        ;; @param $n i32, length of one d array
        ;; @param $type i32,  Contains the type for the array, 
        ;;    i.e double | single | int8 | int16 | int32 | int64 | uint8 | uint16 | uint32 | uint64
        ;; @return i32, returns pointer to array
        ;; @description
        ;;      Creates a 1d array of $n size
        ;;      and type $type.
        ;; TODO: Change the type attribute, add support for different numbers and types
        get_local $n
        i32.const 0
        i32.le_s
        if
            i32.const 0
            set_local $n
        end
       
        ;; Get the size of bytes for type
        (set_local $type_size (call $size_s (get_local $type)))
  
        ;; Calculate size of payload and allocate memory
        (tee_local $total_length (i32.mul (get_local $type_size) (get_local $n) )) ;; Add number of array elements
        i32.const 24 ;; 4 for total size, 4 for num dimensions,
                     ;; 4 for type and 8(1xn) for dimensions, 4 for alignment
        tee_local $meta_size
        i32.add ;; sizes
        
        tee_local $sizepayload ;; set size of payload
        call $malloc ;; Allocate bytes
        ;; Allocate metadata
        tee_local $pointer ;; set pointer
        ;; Set length of first dimension (row)
        i32.const 1
        i32.store offset=4 align=2
        ;; Set length of second dimension (column)
        get_local $pointer
        get_local $n
        i32.store  offset=8 align=2
        ;; Store number of dimensions
        get_local $pointer
        i32.const 2
        i32.store offset=12 align=2
        ;; Store type
        get_local $pointer
        get_local $type
        i32.store offset=16 align=2
        ;; Store array length
        get_local $pointer
        get_local $n
        i32.store offset=20 align=2
        ;; return pointer to beginning of array
        i32.const 24
        get_local $pointer
        i32.add
        return
    )
    (export "get_array_type" (func $get_array_type))
    (func $get_array_type (param $arr i32) (result i32)
        (;Deprecated;)
        (i32.load (i32.sub (get_local $arr) (i32.const 8)))
    )
    (func $zeroes_nxn (param $n i32) (param  $type i32) (result i32)
        (local $sizepayload i32) (local $pointer i32) (local $meta_size i32)(local $total_length i32)(local $array_ptr i32)
        (local $type_size i32)
        ;; @name zeroes_nxn#memory  
        ;; @param $n Dimension of square matrix
        ;; @param $type Contains the type for the array, 
        ;;    i.e double | single | int8 | int16 | int32 | int64 | uint8 | uint16 | uint32 | uint64
        ;; @return i32, returns pointer to nxn matrix
        ;;
        ;; @description
        ;;      Create an array of zeroes with the given $dimensions array
        ;;      and type
        ;; TODO Unit Test

        ;; Get the size of bytes for type
        (set_local $type_size (call $size_s (get_local $type)))
        ;; Calculate size of payload and allocate memory
        (tee_local $total_length (i32.mul (get_local $type_size) (i32.shl (get_local $n) (i32.const 1)))) ;; Add number of array elements
        i32.const 20 ;; 4 for total size, 4 for num dimensions, 4 for type and 8 for nxn dimension
        tee_local $meta_size
        i32.add ;; sizes
        tee_local $sizepayload ;; set size of payload
        call $malloc ;; Allocate bytes

        tee_local $pointer ;; set pointer
        ;; Set dimensions
        get_local $n
        i32.store 
        get_local $pointer
        get_local $n
        i32.store offset=4 align=2
        ;; Store number of dimensions
        get_local $pointer
        i32.const 2
        i32.store offset=8 align=2
        ;; Store type
        get_local $pointer
        get_local $type
        i32.store offset=12 align=2
        ;; Store total length 
        get_local $pointer
        (i32.shl (get_local $n) (i32.const 1))
        i32.store offset=16 align=2
        ;; return pointer to beginning of array
        get_local $meta_size
        get_local $pointer
        i32.add
        return
    )
    (export "get_heap_top" (func $get_heap_top))
    (func $get_heap_top (result i32)
        ;; @name get_heap_top#memory  
        ;; @return i32, returns the value for the top of the heap
        ;; @description
        ;;      Used for debugging and testing, returns the size of the top of heap
        get_global $HEAP_TOP
        return
    )
    (export "array_dim_num" (func $array_dim_num))
    (func $array_dim_num (param $array i32) (result i32)
        ;; @name array_dim_num#memory 
        ;; @param $array i32, Pointer to array whose dimensions will be returned 
        ;; @return i32, Number of dimensions 
        ;; @description
        ;;      Used for debugging and testing, returns number of dimensions for the array
        (i32.load (i32.sub (get_local $array) (i32.const 12)))
        return
    )
    
    (export "array_length" (func $array_length))
    (func $array_length (param $array i32) (result i32)
        ;; @name array_length#memory 
        ;; @param $array i32, Pointer to array whose dimensions will be returned 
        ;; @return i32, Array length
        ;; @description
        ;;      Gets the array "total" number of items, or length
        (i32.load (i32.sub (get_local $array) (i32.const 4)))
        return
    )
    (func $get_array_index_offset (param $arr i32)(param $index i32) (result i32)
        get_local $arr
        call $get_array_type

        get_local $index
        i32.const 1
        i32.sub
        i32.const 4
        i32.mul
        i32.add
    )
    (export "create_array" (func $create_array))
    (func $create_array (param $dimensions_array i32) (param  $type i32) (result i32)
        (local $type_size i32)(local $meta_size i32)(local $size_payload i32) (local $total_length i32) (local $dim_temp i32)
        (local $array_dim i32)(local $array_length i32) (local $i i32) (local $pointer i32) (local $padding_flag i32)
        ;; @name create_array#memory  
        ;; @param $dimensions Array of Dimensions for array
        ;; @param $type Contains the type for the array, 
        ;;    i.e double | single | int8 | int16 | int32 | int64 | uint8 | uint16 | uint32 | uint64
        ;; @return returns pointer to start of payload
        ;; @description
        ;;      Create an array of zeroes with the given $dimensions array
        ;;      and type
        ;; TODO: Expand zeros to other types instead of just doubles
        ;; TODO: Check dimensions
        ;; TODO: Unit test
        ;; TODO: Throw errors if malloc fails
        ;; TODO: deal with pointer errors

        ;; Get the size of bytes for type
        (set_local $type_size (call $size_s (get_local $type)))
        (set_local $array_dim (i32.load (i32.sub (get_local $dimensions_array) (i32.const 4))))
        ;; Get total array size
        (set_local $array_length (i32.const 1))
        loop
            block ;; array iteration
            (i32.ge_s (get_local $i)(get_local $array_dim) )
            br_if 0
            ;; Get dimension size, if its empty or less than 0, return null
            (tee_local $dim_temp (i32.load (i32.add (get_local $dimensions_array) (i32.mul (i32.const 4)(get_local $i)))))
            i32.const 0
            i32.le_s
            if
              i32.const 0
              return  
            end
            (set_local $array_length 
                (i32.mul (get_local $array_length) (get_local $dim_temp)))
            (set_local $i (i32.add (get_local $i)(i32.const 1))) ;; Increase loop counter
            br 1
            end
        end
         

        ;; Calculate size of payload and allocate memory
        (tee_local $total_length (i32.mul (get_local $type_size) (get_local $array_length))) ;; Add number of bytes elements
        (i32.add (i32.const 12)(i32.mul (get_local $array_dim) (i32.const 4))) ;; get meta size
        (tee_local $meta_size)
        i32.add
        (set_local $size_payload)
        ;; ;; Add 4 bytes to make beginning of array aligned
        (i32.rem_s (i32.add (i32.const 12)(i32.mul (i32.const 4)(get_local $array_dim)))(i32.const 8))
        if 
            (set_local $padding_flag (i32.const 1))
            (i32.add (get_local $size_payload) ( i32.const 4))
            set_local $size_payload
        end
        get_local $size_payload
        call $malloc ;; Allocate bytes
        tee_local $pointer ;; set pointer
        i32.eqz
        if
            i32.const 0
            return  
        end
        ;; if padding increase pointer offset
        get_local $padding_flag
        if 
            i32.const 4
            get_local $pointer
            i32.add 
            set_local $pointer
        end

        ;;set dimensions
        (set_local $i (i32.sub (get_local $i) (i32.const 1)))
        ;;(set_local $i (i32.const 0))
        loop
            block
            (i32.le_s (get_local $i)(get_local $array_dim) )
            br_if 0
            get_local $pointer
            (i32.load (i32.add (get_local $dimensions_array) (i32.mul (i32.const 4)(get_local $i)))) ;; Load starting from last dimension
            i32.store
            (set_local $pointer (i32.add (get_local $pointer)(i32.const 4)))
            (set_local $i (i32.add (get_local $i)(i32.const 1)))
            br 1
            end
        end
        ;; Store number of dimensions
        get_local $pointer
        get_local $array_dim
        i32.store offset=0 align=2
        ;; Store type
        get_local $pointer
        get_local $type
        i32.store offset=4 align=2
        ;; Store total length 
        get_local $pointer
        get_local $array_length
        i32.store offset=8 align=2
        ;; return pointer
        get_local $pointer
        i32.const 12
        i32.add
        return
    )
    (export "malloc" (func $malloc))
    (func $malloc (param $size i32) (result i32) 
        (local $realsize i32) (local $end i32) (local $heap_offset i32)
        ;; @name malloc#memory  
        ;; @param $size Size of the allocated payload
        ;; @return returns pointer to start of payload
        ;; @description
        ;;      Allocate a given payload based on provided size plus, alignment bits
        ;;      Save size, flag at beginning and end occupying 16bytes
        ;; TODO: Flag import, and memory import
        ;; TODO: Check the alignment with the new footer/header
        ;; Check for a positive size
        (i32.le_s (get_local $size) (i32.const 0))
        if 
            i32.const  -1 ;; Error negative length
            return
        end

        ;; Add bytes to make allocation mod 64
        (tee_local $realsize (i32.rem_s (get_local $size) (i32.const 8)))
        if 
            (set_local $realsize (i32.add (get_local $size) (i32.sub (i32.const 8)(get_local $realsize))))
        else
            (set_local $realsize (get_local $size))
        end

        
        ;; Grow memory if necessary, if unable to grow, throw trap
        (i32.add (i32.add (get_global $HEAP_TOP)(get_local $realsize)) (i32.const 16))
        (i32.mul (current_memory) (get_global $PAGE_SIZE))
        i32.sub
        tee_local $heap_offset
        i32.const 0
        i32.gt_s 
        if 
            get_local $heap_offset
            get_global $PAGE_SIZE
            i32.rem_s
            if (result i32)
                get_local $heap_offset
                get_global $PAGE_SIZE
                i32.div_s
                i32.const 1
                i32.add
            else 
                get_local $heap_offset
                get_global $PAGE_SIZE
                i32.div_s
            end
            grow_memory 
            i32.const -1
            i32.eq
            if 
                i32.const 0
                call $throwError
            end
        end 
        ;; Set the size, add 16 because of malloc bits
        (get_global $HEAP_TOP)
        (get_local $realsize)
        i32.const 1 ;; Free-bit
        i32.add ;; Free-bit
        (i32.store offset=0 align=4)

        ;;Add to end of block as well
        (get_global $HEAP_TOP)
        i32.const 4
        i32.add ;; 4 for header
        (get_local $realsize) 
        i32.add ;; add size of payload  
        (tee_local $end) ;; Set end
        (get_local $realsize) ;;Add 8 to allocated size to account for header and footer
        i32.const 1 ;; Free-bit
        i32.add ;; Free-bit
        (i32.store offset=0 align=4)
        ;; prepare return pointer value
        (i32.add (get_global $HEAP_TOP) (i32.const 4)) 
        ;; Update pointer value
        (set_global $HEAP_TOP (i32.add (get_global $HEAP_TOP)(i32.add (get_local $realsize)(i32.const 8))))
        ;; return pointer to start of payload        
        return
    )
    
    ;;; HELPER FUNCTIONS

    (export "get_mem_free_bit" (func $get_free_bit_mem))
    (func $get_free_bit_mem (param $memory i32) (result i32)
        ;; @name get_mem_free_bit#memory 
        ;; @param $array i32, Pointer to array whose dimensions will be returned 
        ;; @return i32, Array length
        ;; @description
        ;;      Gets the array "total" number of items, or length
        get_local $memory
        i32.const 4
        i32.sub
        i32.load offset=0 align=4
        i32.const 1
        i32.and
    ) 


    (export "get_mem_payload_size" (func $get_mem_payload_size))
    (func $get_mem_payload_size (param $memory i32) (result i32)
        ;; @name get_mem_payload_size#memory 
        ;; @param $memory i32, pointer to allocated memory by malloc 
        ;; @return i32, Size of payload at header stored in size section by malloc
        ;; @description
        ;;      Gets the total size of the payload allocated by checking the header
        get_local $memory
        i32.const 4
        i32.sub
        i32.load offset=0 align=4
        i32.const 1
        i32.sub
    ) 


    (export "load_mem" (func $load_mem))
    (func $load_mem (param i32) (result i32)
        get_local 0
        i32.load 
        return
    )

    ;; Array Operations
    ;; TEMPLATES
    ;;Array get
    (export "get_array_index_f64" (func $get_array_index_f64))
    (func $get_array_index_f64 (param $array_ptr i32)(param $i i32)(result f64)
        
        get_local $array_ptr
        call $get_array_length
        get_local $i
        i32.lt_s
        if
            i32.const 3
            call $throwError
        end
        (set_local $i (i32.sub (get_local $i)(i32.const 1)))
        get_local $i
        i32.const 0
        i32.lt_s
        if
            i32.const 4
            call $throwError
        end
        get_local $array_ptr
        call $get_array_byte_size
        get_local $i
        i32.mul
        get_local $array_ptr
        call $get_array_start
        i32.add
        f64.load offset=0 align=4
        return
    )
 
   (export "set_array_index_f64" (func $set_array_index_f64))
    (func $set_array_index_f64 (param $array_ptr i32)(param $i i32)(param $value f64)
        
        get_local $array_ptr
        call $get_array_start
        i32.const 8
        i32.sub
        i32.load offset=0 align=4
        get_local $i
        i32.lt_s
        if
            ;; TODO(dherre3): Grow array to require size
        end
        (set_local $i (i32.sub (get_local $i)(i32.const 1)))
        get_local $i
        i32.const 0
        i32.lt_s
        if
            i32.const 4
            call $throwError
        end
        get_local $array_ptr
        call $get_array_byte_size
        get_local $i
        i32.mul
        get_local $array_ptr
        call $get_array_start
        i32.add
        get_local $value
        f64.store offset=0 align=4
    )



    ;; DEBUG & TESTING

    (export "get_free_bit_from_array" (func $get_mem_free_bit_footer))
    (func $get_free_bit_from_array (param $array i32) (result i32)
        ;; @name get_free_bit_from_array#memory 
        ;; @param $array i32, Get free bit from array
        ;; @return i32, Array length
        ;; @description
        ;;      Gets the array "total" number of items, or length
        ;; TODO Implement get_free_bit_from_array
        i32.const 0
    ) 

    (export "get_mem_free_bit_footer" (func $get_mem_free_bit_footer))
    (func $get_mem_free_bit_footer (param $memory i32) (result i32)
        ;; @name get_mem_free_bit#memory 
        ;; @param $array i32, Pointer to array whose dimensions will be returned 
        ;; @return i32, Array length
        ;; @description
        ;;      Gets the array "total" number of items, or length
        get_local $memory
        i32.const 4
        i32.sub
        i32.load offset=0 align=4
        i32.const 1
        i32.sub
        get_local $memory 
        i32.add
        i32.load offset=0 align=4
        i32.const 1
        i32.and
    ) 

    (; 
    
         Matrix Allocators  
    
    ;)
    

    (export "set_type_attribute" (func $set_type_attribute))
    (func $set_type_attribute
        (param $address i32)
        (param $class i32)
        (param $elem_size i32)
        (param $simple_class i32)
        (call $assert (;Condition;)(i32.and (i32.ge_s (get_local $class)(i32.const 0))(i32.le_s (get_local $class)(i32.const 4)))
                    (;Error;)(i32.const 0))
        (call $assert (;Condition;)(i32.and (i32.ge_s (get_local $elem_size)(i32.const 0)) (i32.or (i32.eqz (i32.and (get_local $elem_size)(i32.const 1)))(i32.eq (get_local $elem_size)(i32.const 1)))
                    (;Error;)(i32.const 1)))
        (call $assert (;Condition;)(i32.and (i32.ge_s (get_local $simple_class)(i32.const -1)) (i32.le_s (get_local $simple_class)(i32.const 15)))
                    (;Error;)(i32.const 2))
        get_local $address
        get_local $class
        i32.store offset=0 align=1
        get_local $address
        get_local $elem_size
        i32.store offset=1 align=1
        get_local $address
        get_local $simple_class
        i32.store offset=2 align=1
        get_local $address
        get_local $simple_class
        i32.const 6
        i32.lt_u
        get_local $simple_class
        i32.const 9
        i32.gt_u
        i32.or
        i32.store offset=3 align=1

    )
    ;; Helpers
    (export "get_simple_class_byte_size" (func $get_simple_class_byte_size))
    (func $get_simple_class_byte_size (param $simple_class i32) (result i32)
        block  block block block
            block
                get_local 0
                i32.const 4
                i32.rem_s
                br_table 0 1 2 3
            end
                i32.const 8
                return
            end
                i32.const 4
                return
            end
                i32.const 2
                return
            end
                i32.const 1
                return
        end        
        i32.const -1
        return
    )
    ;; Test & Debug
    (export "get_mclass" (func $get_mclass))
    (func $get_mclass (param $type_attr_address i32)(result i32)
        get_local $type_attr_address
        i32.load8_u offset=0 align=1
    )

    (export "get_simple_class" (func $get_simple_class))
    (func $get_simple_class (param $type_attr_address i32)(result i32)
        get_local $type_attr_address
        i32.load8_u offset=2 align=1
    )
    (export "get_array_byte_size" (func $get_array_byte_size))
    (func $get_array_byte_size (param $array_ptr i32)(result i32)
        get_local $array_ptr 
        call $get_elem_byte_size
    )
     (export "get_array_length" (func $get_array_length))
    (func $get_array_length (param $arr_ptr i32) (result i32)
        ;; @name array_length#memory 
        ;; @param $array i32, Pointer to array whose dimensions will be returned 
        ;; @return i32, Array length
        ;; @description
        ;;      Gets the array "total" number of items, or length
        (i32.load offset=4 align=4 (get_local $arr_ptr))
        return
    )
     (export "get_elem_byte_size" (func $get_elem_byte_size))
    (func $get_elem_byte_size (param $type_attr_address i32)(result i32)
        get_local $type_attr_address
        i32.load8_u offset=1 align=1
    )
        ;; Test & Debug
    (export "is_real" (func $is_real))
    (func $is_real (param $arr i32)(result i32)
        get_local $arr
        i32.load8_u offset=21 align=1
        i32.const 1
        i32.and
    )
    (;
        Array Properties: is_scalar, numel, size, stride, dims, get_colon
        get_index, set_colon, set_index, compute_indeces
    ;)
    (export "is_signed" (func $is_signed))
    (func $is_signed (param $arr_ptr i32) (result i32)
        (local $simple_class i32)
        get_local $arr_ptr
        i32.load8_u offset=3 align=1
        return
    )
    (export "numel" (func $numel))
    (func $numel (param $arr_ptr i32) (result i32)
        get_local $arr_ptr
        i32.const -1
        i32.eq
        if
            i32.const 6
            call $throwError 
        end
        get_local $arr_ptr
        i32.load offset=4 align=4
    )
    (export "size" (func $size))
    (func $size (param $arr_ptr i32)(param $dim i32)(result i32)
        (local $new_ptr i32)(local $i i32)(local $dim_number i32) (local $dim_ptr i32)
        get_local $arr_ptr
        i32.const -1
        i32.eq
        if
            i32.const 6
            call $throwError 
        end
        (set_local $dim_number (i32.load offset=12 align=4 (get_local $arr_ptr )))
        (set_local $dim_ptr (i32.load offset=16 align=4 (get_local $arr_ptr )))
         ;; Get Dimensions
        (call $create_mxvector (get_local $dim_number)(i32.const 0)(i32.const 0)(i32.const 0)(i32.const 0)(i32.const 0))
        set_local $new_ptr
        loop
            block
            (i32.ge_s (get_local $i)(get_local $dim_number))
            br_if 0
            (call $set_array_index_f64 (get_local $new_ptr)(i32.add (get_local $i)(i32.const 1))
                (f64.load offset=0 align=8 (i32.add (get_local $dim_ptr)(i32.mul (get_local $i)(i32.const 8)))))
            (set_local $i (i32.add (get_local $i)(i32.const 1))) ;; Increase loop counter
            br 1
            end
        end
        get_local $new_ptr
    )
    (export "ndims" (func $ndims))
    (func $ndims (param $arr_ptr i32) (result i32)
        (i32.load offset=12 align=4 (get_local $arr_ptr))
    )
   
    (export "isscalar" (func $isscalar))
    (func $isscalar (param $arr_ptr i32) (result i32)
    (;TODO(dherre3): Check for null;)
        get_local $arr_ptr
        i32.load offset=4 align=4
        i32.const 1
        i32.eq   
    )
    (export "length" (func $length))
    (func $length (param $arr_ptr i32) (result f64)
        (local $new_ptr i32)(local $i i32)(local $dim_number i32) (local $dim_ptr i32)
        (local $max f64)(local $temp f64)
        get_local $arr_ptr
        i32.const -1
        i32.eq
        if
            i32.const 6
            call $throwError 
        end
         (set_local $dim_number (i32.load offset=12 align=4 (get_local $arr_ptr )))
        (set_local $dim_ptr (i32.load offset=16 align=4 (get_local $arr_ptr )))
         ;; Get Dimensions
        (call $create_mxvector (get_local $dim_number)(i32.const 0)(i32.const 0)(i32.const 0)(i32.const 0)(i32.const 0))
        set_local $new_ptr
        loop
            block
            (i32.ge_s (get_local $i)(get_local $dim_number))
            br_if 0
                (tee_local $temp (f64.load offset=0 align=8 (i32.add (get_local $dim_ptr)(i32.mul (get_local $i)(i32.const 8)))))
                get_local $max
                f64.max
                set_local $max
                (set_local $i (i32.add (get_local $i)(i32.const 1))) ;; Increase loop counter
            br 1
            end
        end
        get_local $max
    )
   
    (func $is_null (param $arr_ptr i32) (result i32)
        get_local $arr_ptr
        i32.eqz
        if (result i32)
            i32.const 1
        else 
            get_local $arr_ptr
            i32.const -1
            i32.eq
            if (result i32)
                i32.const 1
            else
                i32.const 0
            end
        end
    )
    (export "ismatrix" (func $ismatrix))
    (func $ismatrix (param $arr_ptr i32)(result i32)
        get_local $arr_ptr
        call $is_null
        if
            i32.const 6
            call $throwError
        end
        get_local $arr_ptr
        i32.load offset=12 align=4
        i32.const 2
        i32.eq
        if (result i32)
            i32.const 1
        else
            i32.const 0
        end
    )
     (export "isempty" (func $isempty))
    (func $isempty (param $arr_ptr i32)(result i32)
        get_local $arr_ptr
        call $is_null
        if
            i32.const 6
            call $throwError
        end
        get_local $arr_ptr
        i32.load offset=4 align=4
        i32.eqz
    )
  
     (export "isrow" (func $isrow))
    (func $isrow (param $arr_ptr i32)(result i32)
        get_local $arr_ptr
        call $is_null
        if
            i32.const 6
            call $throwError
        end
        get_local $arr_ptr
        i32.load offset=12 align=4
        i32.const 2
        i32.eq
        if (result i32)
            get_local $arr_ptr
            i32.load offset=16 align=4
            f64.load offset=0 align=8
            f64.const 1
            f64.eq
        else
            i32.const 0
        end
    )
    (export "iscolumn" (func $iscolumn))
    (func $iscolumn (param $arr_ptr i32)(result i32)
        get_local $arr_ptr
        call $is_null
        if
            i32.const 6
            call $throwError
        end
        get_local $arr_ptr
        i32.load offset=12 align=4
        i32.const 2
        i32.eq
        if (result i32)
            get_local $arr_ptr
            i32.load offset=16 align=4
            f64.load offset=8 align=8
            f64.const 1
            f64.eq
        else
            i32.const 0
        end
    )
      (export "isvector" (func $isvector))
    (func $isvector (param $arr_ptr i32)(result i32)
        get_local $arr_ptr
        call $iscolumn
        get_local $arr_ptr
        call $isrow
        i32.or
    )
     (;
        Matrix constructors
    ;)
    (export "colon" (func $colon))
    (func $colon (param $parameters i32)(result i32)
        (local $length i32)(local $i f64)(local $j f64)(local $k f64)
        (local $i_ptr i32)(local $j_ptr i32)(local $k_ptr i32)(local $colon_ptr i32)
        (local $top f64)(local $i_loop f64)
        get_local $parameters
        call $is_null
        if
            i32.const 6
            call $throwError
        end
        get_local $parameters
        i32.load offset=4 align=4
        tee_local $length
        i32.const 2
        i32.lt_u
        if
            i32.const 6
            call $throwError
        end
        get_local $length
        i32.const 3
        i32.gt_s
        if
            i32.const 7
            call $throwError
        end

        get_local $parameters
        i32.const 1
        call $get_array_index_i32
        tee_local $i_ptr
        ;; Check if length is 0 for first parameter
        call $numel
        i32.eqz
        if
            i32.const 0
            i32.const 0
            i32.const 0
            i32.const 0
            i32.const 0
            i32.const 0
            call $create_mxvector
            return    
            ;; Return 0x1
        else
            ;; Check if length is 0 for second parameter
            get_local $parameters
            i32.const 2
            call $get_array_index_i32
            tee_local $j_ptr
            call $numel
            i32.eqz
            if
                i32.const 0
                i32.const 0
                i32.const 0
                i32.const 0
                i32.const 0
                i32.const 0
                call $create_mxvector
                return                ;; Return 0x1
            else
                ;; Set i and j
                get_local $i_ptr
                i32.const 1
                call $get_array_index_f64                    
                set_local $i
                get_local $j_ptr
                i32.const 1
                call $get_array_index_f64 
                set_local $j
            end
        end
        ;; Check if there are two parameters
        get_local $length
        i32.const 2
        i32.eq
        if
            get_local $i   
            get_local $j
            f64.le
            if
                get_local $i
                get_local $j
                f64.eq
                if
                    ;; Return  1x1
                    i32.const 1
                    i32.const 0
                    i32.const 0
                    i32.const 0
                    i32.const 0
                    i32.const 0
                    call $create_mxvector
                    tee_local $colon_ptr
                    i32.const 1
                    get_local $i
                    call $set_array_index_f64
                    get_local $colon_ptr
                    return
                else 
                    ;; set fix(j-i)
                    (f64.trunc (f64.sub (get_local $j)(get_local $i)))
                    tee_local $top
                    f64.const 1
                    f64.add
                    i32.trunc_u/f64                             
                    i32.const 0
                    i32.const 0
                    i32.const 0
                    i32.const 0
                    i32.const 0
                    call $create_mxvector
                    tee_local $colon_ptr
                    ;; Enter loop
                    (set_local $top (f64.add (get_local $top)(get_local $i)))
                    (set_local $i_loop (get_local $i))                            
                    (set_local $i (f64.sub (get_local $i)(f64.const 1)))
                    loop
                        block
                        (f64.gt (get_local $i_loop)(get_local $top))
                        br_if 0
                            (call $set_array_index_f64 
                                (get_local $colon_ptr)(i32.trunc_s/f64 (f64.sub (get_local $i_loop)(get_local $i)))(get_local $i_loop))
                            (set_local $i_loop (f64.add (get_local $i_loop)(f64.const 1)))
                        br 1
                        end
                    end
                    return
                end
            else ;;return 0x1
                i32.const 0
                i32.const 0
                i32.const 0
                i32.const 0
                i32.const 0
                i32.const 0
                call $create_mxvector
                return
            end
        else
            get_local $parameters
            i32.const 3                
            call $get_array_index_i32
            tee_local $k_ptr
            ;; Check if length is 0 for first parameter
            call $numel
            i32.eqz
            if
                i32.const 0
                i32.const 0
                i32.const 0
                i32.const 0
                i32.const 0
                i32.const 0
                call $create_mxvector
                return    
                ;; Return 0x1
            else
             
                get_local $k_ptr
                i32.const 1
                call $get_array_index_f64                    
                tee_local $k
                ;; If j = 0
                get_local $j
                f64.const 0
                f64.eq
                if
                    i32.const 0
                    i32.const 0
                    i32.const 0
                    i32.const 0
                    i32.const 0
                    i32.const 0
                    call $create_mxvector
                    return    
                end
                ;; if k > i
                get_local $i
                f64.gt
                if
                    get_local $j
                    f64.const 0
                    f64.lt
                    if
                        i32.const 0 
                        i32.const 0
                        i32.const 0
                        i32.const 0
                        i32.const 0
                        i32.const 0
                        call $create_mxvector
                        return
                    else
                        
                        ;;actual increasing order
                        ;; set fix((k-i)/j)
                        (f64.trunc (f64.div (f64.sub (get_local $k)(get_local $i))(get_local $j)))
                        tee_local $top
                        f64.const 1
                        f64.add
                        i32.trunc_u/f64                             
                        i32.const 0
                        i32.const 0
                        i32.const 0
                        i32.const 0
                        i32.const 0
                        call $create_mxvector
                        tee_local $colon_ptr
                        ;; Enter loop
                        (set_local $top (f64.add (get_local $i)(f64.mul (get_local $top)(get_local $j))))
                        (set_local $i_loop (get_local $i))                            
                        (set_local $i (f64.const 1))
                        loop
                            block
                            (f64.gt (get_local $i_loop)(get_local $top))
                            br_if 0
                                (call $set_array_index_f64 
                                    (get_local $colon_ptr)(i32.trunc_s/f64 (get_local $i))(get_local $i_loop))
                                (set_local $i_loop (f64.add (get_local $i_loop)(get_local $j)))
                                (set_local $i (f64.add (get_local $i)(f64.const 1)))
                            br 1
                            end
                        end
                        return    
                    end
                else
                    get_local $i
                    get_local $k
                    f64.eq
                    if
                        ;; Return 1x1 
                        i32.const 1
                        i32.const 0
                        i32.const 0
                        i32.const 0
                        i32.const 0
                        i32.const 0
                        call $create_mxvector
                        tee_local $colon_ptr
                        i32.const 1
                        get_local $i
                        call $set_array_index_f64
                        get_local $colon_ptr
                        return
                    else
                        ;; k < i
                        ;; decreasing order 
                        get_local $j
                        f64.const 0
                        f64.gt
                        if
                            i32.const 0 
                            i32.const 0
                            i32.const 0
                            i32.const 0
                            i32.const 0
                            i32.const 0
                            call $create_mxvector
                            return
                        else
                            ;; actual decreasing order
                            ;; set fix((k-i)/j)
                            (f64.trunc (f64.div (f64.sub (get_local $k)(get_local $i))(get_local $j)))
                            tee_local $top
                            f64.const 1
                            f64.add
                            i32.trunc_u/f64                             
                            i32.const 0
                            i32.const 0
                            i32.const 0
                            i32.const 0
                            i32.const 0
                            call $create_mxvector
                            tee_local $colon_ptr
                            ;; Enter loop
                            (set_local $top (f64.add (get_local $i)(f64.mul (get_local $top)(get_local $j))))
                            (set_local $i_loop (get_local $i))                            
                            (set_local $i (f64.const 1))
                            loop
                                block
                                (f64.gt (get_local $top)(get_local $i_loop))
                                br_if 0
                                    (call $set_array_index_f64 
                                        (get_local $colon_ptr)(i32.trunc_s/f64 (get_local $i))(get_local $i_loop))
                                    (set_local $i_loop (f64.add (get_local $i_loop)(get_local $j)))
                                    (set_local $i (f64.add (get_local $i)(f64.const 1)))
                                br 1
                                end
                            end
                            return     
                        end
                    end
                end
            end
        end
        i32.const 0
        return

    )

)

