# The Layout will be the following:

TypeAttribute: 

    - Describes data structure present, i.e. array of doubles, cell-array(array of pointers), function_handle pointer to a table defined constant.

Length:
    - Length of the array

Array Pointer:
    - Pointer to data
Array Shape:
    - Shape of array.
Array strides:
    - Based on the type of values in data, i.e. int8, int16, uint8, create the strides for each dimension.

Example:
    