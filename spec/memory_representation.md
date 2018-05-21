# Memory representation

Matlab has the following "complex" types present:
- Array
- Cell 
- Struct
- Function handle

In terms of arrays, an array can be one of the following simple types:
- String (pointer of 4 bytes)
- Numeric (Size varies)
- Logical (1 byte)
- Char (2 byte)

Numeric types have 4 dimensions, i.e. 
complex/real, sign/unsigned, mclass, size.
- Complex/real
    - Whether the number is complex/real (Depending on this, our size is multiplied by 2)
- Signed/unsigned
    - Whether the number is signed or unsigned
- Mclass
    - Whether the number is an int or float
- Size
    - 1, 2, 4, 8 precision numbers.

In memory this type lattice is going to be represented by.

![alt text][logo]

The following is the homogeneous array in memory representation, each of the box represents a 32 bit number except for the Type Attribute which is 64bits. Although I will not support complex numbers, I will leave the space as is in case of future work done in this area.
The only point of discussion here was how to handle 
complex arrays, however with complex arrays both the
real and imaginary byte size is the same.

The metadata will also be allocated at a different place
in memory.
![array memory][array_memory]

[logo]: ./images/type_attri.png "Type Attribute"
[array_memory]: ./images/array_memory.png "Array Memory"

The padding (empty byte) is added depending on the number of dimensions.
When the array created has 0 length or negative length, the metadata header is still created, this serves to maintain the matlab semantics with empty arrays.
When it comes to strings, the elements are pointers to the respective string element for which the bytesize will be 4.
When it comes to complex numbers the combination of comple/real and element byte size will give the real size of the array.
Every high-level structure will have two memory segments. The headers, which will contain information about the variable, similar to the `whos` function in Matlab and the data segment, 
which will contain actual data.

```
simple_class= {
    0:'double',
    1:'single',
    2:'int16',
    3:'int8',
    4:'int64',
    5:'int32',
    6:'uint16',
    7:'uint8',
    8:'uint64',
    9:'uint32',
    11:'char',
    13:'string'
    15:'logical'
};
```
There are two reasons to separate the array header and data.
First because is because of dynamic array nature in Matlab, which means
when we try to set an element larger than the array itself, the array
size doubles, under this separate header scenario we would only need to
allocate for the new data as opposed to the header again.
# Handling Matlab literals

In Matlab we can have literals in this fashion:

``` 
a = [1,2,3;4,5,6] % (2,3) double array
b = 'dadsda' % (1,6) character array
```
This could be translated in two ways:
We could do them at compile time or at execution time with an init function. 
-   Compile time makes things a bit complicated because all of a sudden I need to be able to actually translate to bytes everything, so If I create a literal in matlab, which is normally a double array, I need to get the byte representation and initialize webassembly memory to it,  then I have to define the metadata of that array, so take a bunch of 32 bit integers which describe the array, and write all the metadata in terms of single bytes and handle the webassembly memory from it, incrementing the HEAP Pointer at compile time. 
- At run-time, you would simply generate the code to generate the array/string/struct/cel array etc, this would obviously have a cost in execution but it would be a little simpler.

It will likely be at compile time.
# API so far

## Printing
- printString
- printError
- printDouble

# Errors

    throwError: (param $error i32))-> Trap

Errors:
- 0: "Allocating larger memory than expected"
- 1: "Negative length is not allowed in this context"
- 2: "Index out-of-bounds"

