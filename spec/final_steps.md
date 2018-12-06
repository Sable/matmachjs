# TODO
- Create MachArray TS class
- Create MachRuntime class with all the interface functions
- Add strides to all constructors.
- Fix Constructors, in-line functions, create
- [ ] Fix wasm get/set to use strides instead of shape.
- [x] Come up with a strategy to handle slices using strides like numpy
- [x] Find out all the functions that need copying
- [ ] Go through all the wasm functions and in-line where possible. Get
rid of innefficiencies
- [ ] Create website to display library.
- [ ] Change default shape,strides to be Int32  as opposed to F64, in order
    to save space, this also means the `size()` Matlab function must go through
     extend this arrays, and produce a new F64 array.

## Strategy for Copying semantics.

By design, all functions that take an input and produce and output
of the same shape must be given the option to either copy, or do it in
place. The copying semantics reassemble Matlab semantics by default, i.e.
they copy, the library itself will provide a flag which will tell a given
function to either copy or performed function in place.

Functions that have COPYING capabilities:

#### Binary `func(arr1, arr2)`
If copying flag enabled, the resulting array after broadcasting must have the same size as arr1.
- add
- sub
- ldivide
- rdivide
- times
- rem
- mod
- ldivide
- rdivide (right divide, elem-by-elem)
- power (Base A is a square matrix and exponent B is a scalar)

#### Unary `func(arr1)`
- floor(x)
- ceil(x)
- sin(x)
- cos(x)
- tan(x)
- sqrt(x)
- uminus(x)
- uplus(x)
- round(x)
- exp(x)
- log(x)
- abs(X)
- not(x)
- fix(x)


#### Slicing
By using strides, we can create views over the data arrays with a different
header for each array for when we access arrays via colon operators.
The colon operator will be as powerful as the python operator, it will
have two constructors, a string constructor and a simple
```javascript
let as = mr.cl(1,3,2);// Creates a COLON class which allows to pass

```
In wasm, we will create a new object and a new get function that particularly
works in creating views of arrays as opposed to copies of arrays upon
slicing. Slicing with no input ends up in a copy, similar to the
JavaScript API, slicing with inputs end up in views over the array data.
The wasm `COLON` object will look as follows:
```
|<type-attribute>|<number-of-items>|low|high|step?|
```
The type attribute is the same as the MachArrays type attribute. The
class will be defined as uint8 6 to be recognized by our new colon functions.


