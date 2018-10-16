(module $malloc
   ;; (import "js" "mem" (memory $mem 1))
    (global $HEAP_TOP (mut i32) (i32.const 32764)) ;; For off from alignment due to the footer/header size of four
    (global $HEAP_START (mut i32) (i32.const 32764))
    (global $PAGE_SIZE i32 (i32.const 65536))
    (global $FREE_LIST_PTR (mut i32) (i32.const 0))
    (;dummy;)(memory $mem  5 256)
     (export "mem" (memory $mem))
    (func $throwError (param i32))
    (export "malloc_expand_memory" (func $malloc_expand_memory))
    (func $malloc (param $size i32)(result i32)
        ;; Search free list

        i32.const 0
    )
    (start $start)
    (func $start 
        (call $mod (f64.const 75.1000)(f64.const 1))
        drop
        
    )
    (func $mod (param f64 f64)(result f64)
        ;; mod(a,m)
        ;;  b = a - m.*floor(a./m)
        get_local 0
        get_local 1
        get_local 0
        get_local 1
        f64.div
        f64.floor
        f64.mul
        f64.sub
    )
    
    (func $free (param $alloc_mem i32)
        (local $free_list_ptr i32)(local $prev_ptr i32)(local $next_ptr i32)
        get_global $FREE_LIST_PTR
        tee_local $free_list_ptr
        i32.eqz
        ;; if equal 0
        if
            get_local $alloc_mem
            set_global $FREE_LIST_PTR
            return
        end
        get_local $free_list_ptr
        get_local $alloc_mem
        i32.le_s
        drop


        



    
    )
    (func $malloc_expand_memory (param $size i32) (result i32) 
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



)