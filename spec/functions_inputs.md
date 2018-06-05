## Matlab functions 
Another problem when generating WebAssembly is the fact that Matlab supports natively many number types.
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
 Due to the dynamically typed nature of Matlab and operation overloading. A lot of operations can take a parameter that specifies the type of the output, and can take different types of inputs, where the output of the operation could change depending on the input types, and the number of inputs. 
### WebAssembly
When transforming to WebAssembly we need to take care of a few things such as, `variable number of inputs` of different types or different outputs. 
#### Different number and types of inputs
An example is the function constructor `ones()`.
Here are a few ways to use `ones()`
```
a = ones(1,2,34) % creates a 1x2x34 array of doubles
a = ones([1,2,34]) % creates a 1x2x34 array of doubles
a = ones([1,2,34], 'int8') % creates a number of array of int8
a = ones([1],[2],[34], 'int8') % creates a number of array of int8

```
Handling variable number of inputs with one WebAssembly function can be done in different ways. We can either canonized  the inputs, by making placing the three inputs into an array and making ones function only two inputs. i.e.
```
func $ones (param $dimensions i32) (param $type i32)
```
Where dimensions will be an array of arrays. We can also place everything into an array of arguments which will be a mxvector and start from there. i.e.
```
func $ones (param $arguments i32)
```
The latter will generalize better to all other functions, but unfortunately will be harder to handle single we will have to differentiate between a string and a number.
