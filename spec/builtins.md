# API functions

# Allocation
- [x] Malloc
- [ ] Realloc
- [ ] Free

# Matrix Allocators
- [x] create_mxvector_1D
- [x] create_mxarray_ND
## Helpers
- [x] set_type_attribute
## Testing & Debugging functions
- [x] get_class
- [x] get_simple_class
- [x] get_elem_size
- [x] is_real
## Array get and set
- [x] array_get (get from indices)
- [x] array_set (get from indices)
- [x] array_get (columns)
    - Should throw error when two inputs are not row arra
- [x] array_set (columns)
# Array properties
**Description**
array_property(X), where X is a mxarray,
if X is null, error with size. Otherwise
return the specified logical
- [x] is_scalar
- [x] numel
- [x] size
- [x] ndims
- [x] length (lenght of largest dim)
- [x] isrow
- [x] iscolumn
- [x] ismatrix (returns [m n] where m,n > 0)
- [x] isvector
- [x] isempty
- [ ] ischar (later)
# Matrix Constructors
- [x] colon (`colon(i,j,k)`)
    - __Description__
    - Argument:
        - Should throw error if less than 2 inputs
        - Should throw error if an argument is null
    - Two arguments:
        - i > j => 0x1
        - if i or j are empty arrays => 0x1
        - if i==j => 1x1 with value of j
        - if i < j => As expected
    - Three arguments:
        - if j=0, => 0x1 regardless of i,k
        - if i < k & j < 0 => 0x1
        - if k > i & j > 0 => 0x1
        - if k=i for any j => 1x1 with k as value
        - if i < k & j > 0 => increasing order array from i to i+m*j where m=fix((k-j)/i)
        - if k < i & j < 0 => decreasing order array
          from i to i+m*j where m=fix((k-j)/i)
- [x] rand
    This supports the following functions:
      ```
        X = randi(imax)
        X = randi(imax,n)
        X = randi(imax,sz1,...,szN)
        X = randi(imax,sz)
        X = randi(imax,classname)
        X = randi(imax,n,classname)
        X = randi(imax,sz1,...,szN,classname)
        X = randi(imax,sz,classname)
    ```
- [x] randn
    - Similar to as above
- [x] randi
    - Similar to as above
- [x] zeroes
- [x] ones
- [x] clone (Also an allocator)
**NOTE:** For all constructors the supported and cannonical format will be:
```
sz=[1,2,4], classname

```
The sparcity feature will be ignored.
- [ ] eye
    - **requires:** compute_indeces
- [ ] set_index
- [ ] compute_indeces

# Matrix-vs-Matrix, Matrix-vs-Scalar
- [ ] add
- [ ] subs
- [ ] rem
- [ ] mod
- [ ] times (elem-by-elem mult)
- [ ] mtimes (matrix times)
- [ ] mrdivide (system of linear equations divide) x = B/A
- [ ] rdivide (right divide, elem-by-elem)
- [ ] lt
- [ ] le
- [ ] gt
- [ ] ge
- [ ] eq
- [ ] ne
- [ ] isequal
- [ ] mpower (Base A is a scalar and exponent B is a square matrix)
- [ ] power (Base A is a square matrix and exponent B is a scalar)
# Operations on a matrix
- [ ] floor
- [ ] ceil
- [ ] sin(x)
- [ ] cos(x)
- [ ] tan(x)
- [ ] sqrt(x)
- [ ] uminus(x)
- [ ] round(x)
- [ ] exp
- [ ] log
- [ ] abs
- [ ] transpose
- [ ] mean
- [ ] max
- [ ] min
- [ ] size
- [ ] any (determine if any elements are non-zero)
- [ ] fix
- [ ] sum
- [ ] not
# Matrix concatanate 
- [ ] horzcat (Concatenate matrices horizontally)
- [ ] vertcat
# Constants
- [ ] e
- [ ] PI
# Utility for matrix
- [ ] compute_shape_length (Computes length based on argument dimensions, e.g. for zeroes(n), length is n*n)
# Utility
- [ ] who
- [ ] disp
- [ ] tic
- [ ] toc
- [ ] assert

### To implement

A few macros:
    Element wise:
        -  Elementwise right
        -  Elementwise left
        -  Map
    Pairwise:
       - map
