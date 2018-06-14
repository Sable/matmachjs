# Templates and Macros

## Macros
### Matlab

Matlab has many element-wise operations as well as standard matrix operations between matrices, vectors and scalars, where dimension broadcasting is performed. 

The following are examples:
```
cumprod	Cumulative product
cumsum	Cumulative sum
prod	Product of array elements
sum	Sum of array elements
mean Mean of array elements
```
These ones are element-wise operators, where the last three take
a scalar.
```
ceil	Round toward positive infinity
fix	Round toward zero
floor	Round toward negative infinity
round
idivide	Integer division with rounding option
mod	Remainder after division (modulo operation)
rem	Remainder after division
```
The following are operators between matrices, vectors, and scalars:
```
plus	Addition
uplus	Unary plus
minus	Subtraction
uminus	Unary minus
times	Element-wise multiplication
rdivide	Right array division
ldivide	Left array division
power	Element-wise power
mtimes	Matrix Multiplication
mrdivide Solve systems of linear equations xA = B for x
mldivide Solve systems of linear equations Ax = B for x
mpower	Matrix power
```
One thing to notice here, is the fact that these operations involve very similar handling of matrices, albeit with a different main computation. (They iterate the inputs equivalently, but apply a different operation as they iterate.)

For instance, `prod`, `sum`, `mean` behave equally other than the actual
operation itself. It takes normally two inputs, the first is the matrix, vector, scalar that we use to apply the operation and the second is the dimension along which the operation will be applied. `sum` will add all elements along the first non-singleton dimension. Unless the second parameter is specified. For a vector, it will return a scalar. 
```
ones(3,3) -> [3,3,3]
```
Similarly `prod` will multiply  along the first non-singleton dimension. Unless second parameter with the dimension is specified
```
ones(3,3) -> [1,1,1]
```

 A second way to iterate an array is like the operators, `fix`, `floor`, `round`, `uminus`, `uplus`, `rdivide`, `ldivide`. Where we perform a mapping function iterating through each element in the same fashion and applying the function to each element.

 A third way to iterate includes operators `times`, `power`, `plus`, `minus`, for which we perform an element-wise operation between two inputs.  For these operations, we also have present broadcasting of matrix dimensions. Where if for instance we operate `plus(A,B)`, where A is [3,3], and B is [3,1], B gets broadcasted to [3,3], where we repeat the elements of the matrix along the missing dimensions.

A fourth way to operate includes using cumulative operations. These include `cumsum`, `cumprod`, `cummin`, `cummax`, these operations will apply a cumulative operation along a given dimension as a second parameter. If not specified, similarly as above, it will be the first non-singleton dimension, in this case, the output is the same size as the input.

A last way to operate, is to have actual matrix operations. These include but are not limited to, `mtimes`. `mrdivide`. `mldivide`, `mpower`. For these operations, we may need intelligent handling of them to get good performance out of them.
### WebAssembly
 In order to correctly handle this in WebAssembly, we need a way to have this operations without much code reproduction. Exploiting the fact that many of these operations have very similar in execution.
 
 This problem is easily solved by WebAssembly's
 `table` construct, the table is basically an array of functions. The type of these functions is `anyfunctype`, or a set containing all the possible function signatures. With these we can have an operator such as 
 `element_wise_two_inputs`, which applies an element-wise operation using the first input as the first operand and the second input as the second operand. Similarly, based on the above classes, we would have, `cumulative_operator_sameinput`, `cumulative_operator_values`, `element_wise_mapping`. One of the inputs to these functions will be an index to a function we will be applying.
These operations can be thought of as `MACROS`, for WebAssembly. They can also be thought about in a functional paradigm fashion, where we have functions as first class citizens.
Perhaps this would work well as a DSL that would **in short syntax** allow to generate the right functions and values.

In the ideal world, we would do so with a list.
i.e.
```
CREATE `cumulative_operator_values` USING
    [`add`,`prod`,`max`,'min']
```
This would generate four functions, 
Where here is assumed that `cumulative_operator_values` takes one parameter, and the each function takes two scalars and produces another scalar.