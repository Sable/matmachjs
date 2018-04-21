(module $memory
    
    (memory $mem 10)
    (start $init)
    (func $init 
        ;; call $main
        ;; drop
    )
    (export "mem" (memory $mem))
    (export "malloc" (func $malloc))
    (global $HEAP_TOP (mut i32) (i32.const 64))
    (global $HEAP_START (mut i32) (i32.const 64))
    (func $main (result i32)
        ;; For testing purposes
    )
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
        ;; TODO: Unit test

        ;; Get the size of bytes for type
        (set_local $type_size (call $size_s (get_local $type)))
        ;; Calculate size of payload and allocate memory
        (tee_local $total_length (i32.mul (get_local $type_size) (get_local $n) )) ;; Add number of array elements

        i32.const 16 ;; 4 for total size, 4 for num dimensions, 4 for type and 4 for dimension
        tee_local $meta_size
        i32.add ;; sizes
        tee_local $sizepayload ;; set size of payload
        call $malloc ;; Allocate bytes
        tee_local $pointer ;; set pointer
        ;; Set dimensions
        get_local $n
        i32.store 
        ;; Store number of dimensions
        get_local $pointer
        i32.const 2
        i32.store offset=4 align=2
        ;; Store type
        get_local $pointer
        get_local $type
        i32.store offset=8 align=2
        ;; Store array length
        get_local $pointer
        get_local $n
        i32.store offset=12 align=2
        ;; return pointer to beginning of array
        get_local $meta_size
        get_local $pointer
        i32.add
        return
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
    (func $array_dim_num (param $array i32)
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
    (func $create_array (param $dimensions_array i32) (param  $type i32) (result i32)
        (local $type_size i32)(local $meta_size i32)(local $size_payload i32) (local $total_length i32)
        (local $array_dim i32)(local $array_length i32) (local $i i32) (local $pointer i32) (local $padding_flag i32)
        ;; @name create_array#memory  
        ;; @param $dimensions Array of Dimensions for array
        ;; @param $type Contains the type for the array, 
        ;;    i.e double | single | int8 | int16 | int32 | int64 | uint8 | uint16 | uint32 | uint64
        ;; @return returns pointer to start of payload
        ;; @requires  all dimensions to be larger than 0, 
        ;; @description
        ;;      Create an array of zeroes with the given $dimensions array
        ;;      and type
        ;; TODO: Expand zeros to other types instead of just doubles
        ;; TODO: Check dimensions
        ;; TODO: Unit test

        ;; Get the size of bytes for type
        (set_local $type_size (call $size_s (get_local $type)))
        (set_local $array_dim (i32.load (i32.sub (get_local $dimensions_array) (i32.const 4))))
        ;; Get total array size
        (set_local $array_length (i32.const 1))
        loop
            block
            (i32.ge_s (get_local $i)(get_local $array_dim) )
            br_if 0
            (set_local $array_length 
                (i32.mul (get_local $array_length)
                        (i32.load (i32.add (get_local $dimensions_array) (i32.mul (i32.const 4)(get_local $i))))))
                (set_local $i (i32.add (get_local $i)(i32.const 1)))
            br 1
            end
        end

        ;; Calculate size of payload and allocate memory
        (tee_local $total_length (i32.mul (get_local $type_size) (get_local $array_length))) ;; Add number of array elements
        (i32.add (i32.const 12)(i32.mul (get_local $array_dim) (i32.const 4))) ;; get meta size
        (tee_local $meta_size)
        i32.add
        (set_local $size_payload)
        ;; ;; Add 4 bytes to make beginning of array aligned
        (i32.rem_s  (i32.add (i32.const 12)(i32.mul (i32.const 4)(get_local $array_dim)))(i32.const 8))
        if 
            (set_local $padding_flag (i32.const 1))
            (i32.add (get_local $size_payload) ( i32.const 4))
            set_local $size_payload
        end
        get_local $size_payload
        call $malloc ;; Allocate bytes
        set_local $pointer ;; set pointer
        
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
    (func $malloc (param $size i32) (result i32) 
        (local $realsize i32) (local $end i32)
        ;; @name malloc#memory  
        ;; @param $size Size of the allocated payload
        ;; @return returns pointer to start of payload
        ;; @description
        ;;      Allocate a given payload based on provided size plus, alignment bits
        ;;      Save size, flag at beginning and end occupying 16bytes
        ;; TODO: Case where the memory is not large enough to allocate, grow memory

        ;; Check size is positive.
        (i32.le_s (get_local $size) (i32.const 0))
        if unreachable end
           
        

        ;; Add bytes to make allocation mod 64
        (tee_local $realsize (i32.rem_s (get_local $size) (i32.const 8)))
        if 
            (set_local $realsize (i32.add (get_local $size) (i32.sub (i32.const 8)(get_local $realsize))))
        else
            (set_local $realsize (get_local $size))
        end
        ;; Set the free bit
        (i32.store (get_global $HEAP_TOP)(i32.const 1))
        ;; Set the size, add 16 because of malloc bits
        (get_global $HEAP_TOP)
        (get_local $realsize)
        (i32.store offset=4 align=2)

        ;;Add to end of block as well
        (get_global $HEAP_TOP)
        i32.const 8
        i32.add ;; 8 for first header
        (get_local $realsize) 
        i32.add ;; add size of payload  
        (tee_local $end) ;; Set end
        (get_local $realsize) ;;Add 16 to allocated size to account for header and footer
        i32.store
        (get_local $end)
        i32.const 1
        i32.store offset=4 align=2 ;; save free bit
        ;; prepare return pointer value
        (i32.add (get_global $HEAP_TOP) (i32.const 8)) 
        ;; Update pointer value
        (set_global $HEAP_TOP (i32.add (get_global $HEAP_TOP)(i32.add (get_local $realsize)(i32.const 16))))
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
        i32.const 8
        i32.sub
        i32.load offset=0 align=2
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
        i32.load offset=0 align=2
    ) 
)