# Memory Allocation
There are three functions for the malloc implementation, `malloc`, `free`, `realloc`. 
The following is the representation of free and allocated blocks.


### Free blocks:
![array memory][free] 
### Allocated:
![array memory][allocated]

### Details:
- __Free list__: The implementation will be a sorted linked list with a prev/next pointer for every free block.

- __malloc__: For this malloc will allocate a payload a given size and set the footer/header for the memory segment. For this it will look through the free-list for a memory segment. Initially the strategy will be first fit. If it finds it, it will return a memory segment of the right size, this means it will have to create a second block if the requested memory is smaller.
- __free__: Free will take a pointer to the start of the payload. With this pointer, it will check the size, it will check the previous and next blocks. At this point the next or prev blocks are either free or not.
    - If they both are free, it will merge the three free blocks together, connect the blocks that are prev/next to those three blocks and find the right position in the free list to insert the newly created block.
    - If one of them is free, either prev or next, it will merge, mark the new block as free, set the pointers right and then insert itself in the right position.
    - If none of them are free, it will simply mark itself as free and connect the next pointer of the prev block, and 
- __realloc__: It will take the pointer to the array and the size, from this it will reallocate the pointer block to a new block with the added bytes, and copy all the elements of the previous allocated memory onto the new one.

## API

## malloc
- `(func $malloc (param $size i32) (result i32))`
    
    ;; @name malloc#memory  
    ;; @param $size Size of the allocated payload
    ;; @return returns pointer to start of payload
    ;; @description
    ;;      Allocate a given payload based on provided size plus, alignment bits
    ;;      Save size, flag at beginning and end occupying 16bytes
### TODO: 
- Free operation and reallocation.

## free (TODO)
- `(func $free (param $pointer i32) (result i32)`
    
    ;; @name free#memory  
    ;; @param $pointer Memory segment to free
    ;; @return return 0 or 1
    ;; @description
    ;;      Allocate a given payload based on provided size plus, alignment bits
    ;;      Save size, flag at beginning and end occupying 16 bytes 
### TODO
- Implementation
## realloc (TODO)
- `(func $free (param $pointer i32) (result i32)`
 
    ;; @name free#memory  
    ;; @param $pointer Pointer to start of payload.
    ;; @return Pointer pointer to start of payload for the reallocated memory
    ;; @description
    ;;      Allocate a given payload based on provided size plus, alignment bits
    ;;      Save size, flag at beginning and end occupying 16 bytes 
### TODO
- Implementation



[free]: ./images/memory_block_free.png "free memory"
[allocated]: ./images/memory_block_allocated.png "allocated memory"


## TODO:
- Different Strategies for free-list allocation/deallocation
- Evaluation methodology
- Pattern difference for different memory allocation strategies.
- Implementation of actual different strategies.
