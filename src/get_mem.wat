(module $memory
    ;; (import "js" "mem" (memory $mem 1))
    ;; (import "js" "printError" (func $printError (param i32 i32)(result i32)))
    ;; (import "js" "printString" (func $printString (param i32 i32)(result i32)))
    ;; (import "js" "printDouble" (func $printDouble (param i32)(result i32)))
    ;; (import "test" "assert" (func $assert (param i32 i32)))
    ;; Dummy variables which will be commented out
    (func $printString (param i32 i32)(result i32) i32.const 1)
    (func $printError (param i32 i32)(result i32) i32.const 1)
    (func $printDouble (param i32)(result i32) i32.const 1)
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

    (data $mem (i32.const 0) "Error: Out-of-memory, trying to allocate a larger memory than available\n\00\00\00\00\00\00\00\00Error: Negative length is not allowed in this context\n")
    (data $mem (i32.const 136) "Error: Index out-of-bound\n\00\00\00\00\00\00")
    (data $mem (i32.const 160) "Error: Index exceeds matrix dimensions\00\00")
    (data $mem (i32.const 198) "Error: Subscript indices must either be real positive integers or logicals\00\00\00\00\00\00")

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
        block  block  block block block block
            get_local $error
            br_table 0 1 2 3 4
            end
               (set_local $offset (i32.const 0))
               (set_local $length (i32.const 72))
               br 4
            end
               (set_local $offset (i32.const 80))
               (set_local $length (i32.const 54))
               br 3
            end 
              (set_local $offset (i32.const 136))
              (set_local $length (i32.const 17)) 
               br 2
            end
                (set_local $offset (i32.const 160))
                (set_local $length (i32.const 38)) 
                br 1
            end
                (set_local $offset (i32.const 198))
                (set_local $length (i32.const 74)) 
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
        i32.load offset=0 align=4
        return
    )
    (export "create_array_ND" (func $create_array_ND))
    (func $create_array_ND (param $dim_array i32) (param $simple_class i32)(param $complex i32)(result i32)
        (local $type_size i32) (local $dim_number i32)(local $array_length i32)
        (local $i i32) (local $dim_array_ptr i32) (local $temp i32) (local $header_size i32) (local $array_size i32)
        (local $byte_elem_size i32) (local $array_data_ptr i32)(local $array_header_ptr i32)
     
        ;; Get the size of bytes for type
        (set_local $type_size (call $get_simple_class_byte_size (get_local $simple_class)))
        (set_local $dim_number (i32.load offset=8 align=4 (get_local $dim_array)))
        ;; Get total array size
        (set_local $dim_array_ptr (call $get_array_start (get_local $dim_array)))
        (set_local $dim_number (i32.load offset=0 align=4 (i32.add (get_local $dim_array) (i32.const 8))))
        (tee_local $byte_elem_size (call $get_simple_class_byte_size (get_local $simple_class)))
        (set_local $array_length (i32.const 1))
        loop
            block ;; array iteration
            (i32.eq (get_local $i)(get_local $dim_number))
            br_if 0
            (tee_local $temp (i32.load (i32.add (get_local $dim_array_ptr) (i32.mul (i32.const 4)(get_local $i)))))
            (set_local $array_length 
                (i32.mul (get_local $array_length) (get_local $temp)))
            ;; get_local $i
            ;; i32.const 2
            ;; i32.eq
            ;; if
            ;;     get_local $temp
            ;;     return
            ;; end            
            (set_local $i (i32.add (get_local $i)(i32.const 1))) ;; Increase loop counter
            br 1
            end
        end
        ;; Get total header size
        (tee_local $header_size (i32.add (i32.const 16 )(i32.mul (get_local $dim_number)(i32.const 4))));; 16 for ptr, type_attr, num_elem, dim_num + dim_arr
        call $malloc
        tee_local $array_header_ptr        
        (tee_local $array_size (i32.mul (get_local $array_length)(get_local $byte_elem_size)))
        call $malloc
        ;;Setting Array data ptr
        tee_local $array_data_ptr
        i32.store offset=0 align=4
        
        ;; Setting type attribute
        get_local $array_header_ptr
        i32.const 4
        i32.add
        i32.const 0
        get_local $byte_elem_size
        get_local $simple_class
        get_local $complex
        call $set_type_attribute

        ;; Setting array length
        get_local $array_header_ptr
        get_local $array_length
        i32.store offset=8 align=4

         ;; Setting array dim_number
        get_local $array_header_ptr
        get_local $dim_number
        i32.store offset=12 align=4

        ;; Setting array dimensions
        (set_local $i (i32.const 0))
        (set_local $temp (i32.add (get_local $array_header_ptr)(i32.const 16)))
        loop
            block
                (i32.eq (get_local $i)(get_local $dim_number))
                br_if 0
                (i32.add (get_local $temp)(i32.mul (i32.const 4)(get_local $i)))
                (i32.load (i32.add (get_local $dim_array_ptr) (i32.mul (i32.const 4)(get_local $i))))
                i32.store 
                (set_local $i (i32.add (get_local $i)(i32.const 1))) ;; Increase loop counter
                br 1
            end
        end
        get_local $array_header_ptr
        return
    )
    (export "get_elem_array_index_i32" (func $get_elem_array_index_i32))
    (func $get_elem_array_index_i32 (param $array_ptr i32)(param $i i32)(result i32)
        get_local $array_ptr
        call $get_array_byte_size
        get_local $array_ptr
        call $get_array_start
        i32.add
        i32.load offset=0 align=4
        return
    )
    (export "set_elem_array_index_i32" (func $set_elem_array_index_i32))
    (func $set_elem_array_index_i32 (param $array_ptr i32)(param $i i32)(param $value i32)
        
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
        get_local $value
        i32.store offset=0 align=4
    )
    (export "get_elem_array_index_double" (func $get_elem_array_index_double))
    (func $get_elem_array_index_double (param $array_ptr i32)(param $i i32)(result f64)
        get_local $array_ptr
        call $get_array_byte_size
        get_local $array_ptr
        call $get_array_start
        i32.add
        f64.load offset=0 align=8
        return
    )
    (export "set_elem_array_index_double" (func $set_elem_array_index_double))
    (func $set_elem_array_index_double (param $array_ptr i32)(param $i i32)(param $value f64)
        get_local $array_ptr
        call $get_array_byte_size
        get_local $array_ptr
        call $get_array_start
        i32.add
        get_local $value
        f64.store offset=0 align=8
    )
    (export "create_array_1D" (func $create_array_1D))
    (func $create_array_1D 
        (param $n i32)(param $simple_class i32)(param $complex i32) (result i32)
        (local $size_header i32)(local $size_array i32)(local $elem_size i32)
        (local $header_pointer i32)(local $array_pointer i32)
        (;
        
        
        ;)
        (set_local $elem_size (call $get_simple_class_byte_size (get_local $simple_class)))
        (set_local $size_array 
            (i32.mul 
                (get_local $elem_size)
                (get_local $n)))
        ;; 4 for type attribute, 4 for number of elements, 4 for number of dimensions, 8 for 2 dimensions, 4 for array pointer
        (set_local $size_header (i32.const 24)) 

        ;; Allocate header memory
        get_local $size_header
        call $malloc
        tee_local $header_pointer
        ;; Allocate array memory
        get_local $size_array
        call $malloc
        i32.store offset=0 align=4 ;; Store pointer to array

        ;; Set type attribute
        get_local $header_pointer
        i32.const 4
        i32.add
        ;; Set type attribute call
        i32.const 0
        get_local $elem_size
        get_local $simple_class
        get_local $complex
        call $set_type_attribute

        ;; call set size of array
        get_local $header_pointer
        get_local $n
        i32.store offset=8 align=4 ;; Store pointer to array
        ;; Set number of dimensions
        get_local $header_pointer
        i32.const 2
        i32.store offset=12 align=4 ;; Store 
        ;; Set first dimension
        get_local $header_pointer
        get_local $n
        i32.store offset=16 align=4
        ;; Set second dimension
        get_local $header_pointer
        i32.const 1
        i32.store offset=20 align=4
        get_local $header_pointer
        return
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
            i32.const  1 ;; Error negative length
            call $throwError
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
    (export "get_element_array_f64" (func $get_element_array_f64))
    (func $get_element_array_f64 (param $array i32) (param $index i32) (result f64)
        ;; @name memory#get_element_array_f64
        ;; @param $array i32, Pointer to array 
        ;; @param $index i32, Index to be accessed
        ;; @return f64, returns element in $index of array.
        ;; @description
        ;;      Gets the array "total" number of items, or length
        
     ;; Check that the access index is within bounds
        get_local $index
        get_local $array
        call $array_length
        i32.ge_s
        if 
           i32.const 2
           call $throwError
           unreachable 
        end
        ;; Check that the access $index is positive
        get_local $index
        i32.const 0
        i32.le_s
        if 
           i32.const 1
           call $throwError
           unreachable 
        end 
        i32.const 8
        get_local $index
        i32.const 1
        i32.sub
        i32.mul
        get_local $array
        i32.add
        f64.load offset=0 align=8
        return
    )
    (export "set_element_array_f64" (func $set_element_array_f64))
    (func $set_element_array_f64 (param $array i32) (param $index i32) (param $value f64) (result i32)
        ;; Check that the access $index is positive
        get_local $index
        i32.const 0
        i32.le_s
        if 
           i32.const 1
           call $throwError
           unreachable 
        end
        ;; Check that the access index is within bounds if not grow array
        get_local $index
        get_local $array
        call $array_length
        i32.ge_s
        if 
           ;; Grow array
        end
        

       ;; decrease matlab index by one 
        get_local $index
        i32.const 1
        i32.sub
        set_local $index
       
        ;; access array
        i32.const 8
        get_local $index
        i32.const 1
        i32.sub
        i32.mul
        get_local $array
        i32.add
        get_local $value
        f64.store offset=0 align=8 
        i32.const 1
        return
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
        (param $complex i32)
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
        get_local $complex
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
        ;; Assert class is between 0 and 4
        (call $assert (i32.or (i32.gt_s (i32.const 0)(get_local 0))(i32.lt_s (i32.const 4) (get_local 0)))(i32.const 0))
        get_local $type_attr_address
        i32.load8_u offset=0 align=1
    )

    (export "get_simple_class" (func $get_simple_class))
    (func $get_simple_class (param $type_attr_address i32)(result i32)
        ;; Assert class is between 0 and 6
        (call $assert (i32.or (i32.gt_s (i32.const 0)(get_local 0))(i32.lt_s (i32.const 6) (get_local 0)))(i32.const 1))
        get_local $type_attr_address
        i32.load8_u offset=2 align=1
    )
    (export "get_array_byte_size" (func $get_array_byte_size))
    (func $get_array_byte_size (param $array_ptr i32)(result i32)
        get_local $array_ptr
        i32.const 4
        i32.add 
        call $get_elem_byte_size
    )
    (export "get_array_length" (func $get_array_length))
    (func $get_array_length (param $array_ptr i32)(result i32)
        get_local $array_ptr
        i32.const 8
        i32.add
        i32.load 
    )
     (export "get_elem_byte_size" (func $get_elem_byte_size))
    (func $get_elem_byte_size (param $type_attr_address i32)(result i32)
        ;; Assert byte size divisible by 2 and less than 32
        (call $assert (i32.and (i32.eqz (i32.rem_s (get_local 0)(i32.const 2)))(i32.le_s  (get_local 0) (i32.const 32)))(i32.const 2))
        get_local $type_attr_address
        i32.load8_u offset=1 align=1
    )
        ;; Test & Debug
    (export "get_complex" (func $get_complex))
    (func $get_complex (param $type_attr_address i32)(result i32)
        ;; Assert class is between 0 and 2
        (call $assert (i32.or (i32.gt_s (i32.const 0)(get_local 0))(i32.lt_s (i32.const 2) (get_local 0)))(i32.const 0))
        get_local $type_attr_address
        i32.load8_u offset=3 align=1
    )
    

)

