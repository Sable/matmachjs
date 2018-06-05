# Number types in Matlab vs. WebAssembly
```
float32 (single)
float64 (double)
int8
uint8
int16
uint16
int32
uint32
int64
uint64
```
Given a variable array of certain type, when trying to set a value, if that value exceeds the capacity for the given type, the numbers do not overflow, instead, when passed a larger than the maximum capacity for a given type, Matlab will set it to the maximum value for that particular type. A few examples involve:
```
int8(128) == 127 % of int8 type
int16(256) == 255 % of int16 type
int8(-129) == -128 % of int8 type
uint8(256) == 255 % of type uint8
```
Notice that for positive numbers 0 is actually +0, and instead -0 is counted the next larger number. i.e. 
int8(-129) = -128 (10000000), instead of 127.
In WebAssembly on the other hand, when trying to store a number that is larger than the given value, WebAssembly will overrun that value so that it will start again from zero. If its an i32 number:
```
i32.const 4294967295 // 2^32 -1
i32.const 4294967295 // 2^32 -1
i32.mul
```
These result in Matlab will be: 4294967295. In Wasm it will be 0. To perform them nicely, we can either create a library to handle the usual operations on these types instead of using the built-in operations, which will result in a BIG overhead, assume the numbers will play nice, or always work with doubles and cast as necessary.