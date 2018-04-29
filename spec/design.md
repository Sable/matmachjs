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


![array memory][array_memory]

[logo]: ./images/type_attribute.png "Type Attribute"
[array_memory]: ./images/array_memory.png "Array Memory"

The padding (empty byte) is added depending on the number of dimensions.
When the array created has 0 length or negative length, the metadata header is still created, this serves to maintain the matlab semantics with empty arrays.
When it comes to strings, the elements are pointers to the respective string element for which the bytesize will be 4.
When it comes to complex numbers the combination of comple/real and element byte size will give the real size of the array.


