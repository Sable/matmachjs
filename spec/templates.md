# Templates

A simple example of a template is a get from array function. This function simple returns an element from an array given an index. For simplicity let's assume that the input index does not exceed dimensions, and that the arr_ptr is not null.

An example of this function in WebAssembly is:
```
(func $get_index_array_i32 (param $arr_ptr i32)(param $i i32)(result i32)
    i32.const 4
    get_local $i
    i32.mul
    get_local $arr_ptr
    i32.add
    i32.load
    return
)
```
Now this basic function makes the following assumptions, first, that `$i` is an `i32` number, secondly, that the result array is `i32`.
Let's see how it would work for `$i:f64`, and the underlying array elements as `i16`:
```
(func $get_index_array_i32 (param $arr_ptr i32)(param $i f64)(result i32)
    i32.const 2 ;; Size in bytes
    get_local $i
    i32.trunc_u/f64
    i32.mul
    get_local $arr_ptr
    i32.add
    i32.load16_s
    return
)
```

 For a more general function we would have:

```
(func $get_array_in (param $arr_ptr i32)(param $i [T1])(result [T2])
    get_local $arr_ptr
    call $get_array_elem_size (type T3)
    get_local $i
    [i32.convert/T1?]
    i32.mul
    get_local $arr_ptr
    i32.add
    [[T2].load[T3]_[s/u]?|[T2].load (T2==T3)]
)
```
Where `call $get_array_elem_size` Returns size of element in bytes 1 for i8,2 for i16,4 for i32,f32, 8 for i64,f64.
For this function, it will be useful to create a template like language, this will follow the following pattern:
```
template "get_array" (%T1,%T2,%T3,%SU) => {
    (func $get_array_%T3 (param $arr_ptr i32)(param $i %T1)(result %T2)
        get_local $arr_ptr
        call $get_array_elem_size
        get_local $i
        if %T1 == 'f64'
            i32.trunc_s/f64
        else if %T1 == 'f64'
            i32.trunc_s/f32
        else if %T1 == 'i64'
            i32.wrap/i32
        i32.mul
        get_local $arr_ptr
        i32.add
        if %T3 === 'int8'|| %T3 === 'int16'
        ||%T3 === 'uint8'|| %T3 === 'uint16'
            if %SU == 1
                %T2.load%T3_s?
            else
                %T2.load%T3_u?
        else 
            %T2.load
    )
}
```
Where `%T1` must be [f64,f32,i64,i32], `$T2` must be [f64,f32,i64,i32], 
`%T3` must be ['8', '16', '32', '64']
and `%SU` must be [0,1].

This template like language will have three requirements:
- A function will only be included if a call to the template language has been made. This way the backend supporting the compiler will only have what it needs.
- It will all be check at compile time. The idea would be to insert a step in between JAVA and Wasm text. Where we would take our text file pass it through our template system and finish the functions by verifying the wasm code.
- Validate the values of the parameters passed in a template.

Sources:
- Charles Console