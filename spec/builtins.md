# API functions

# Allocation
- [x] Malloc
- [ ] Realloc
- [ ] Free

# Matrix Allocators
- [x] create_mxvector_1D
- [x] create_mxarray_ND
## Helpers
- [x] mxarray_core_set_type_attribute
## Testing & Debugging functions
- [x] get_class
- [x] mxarray_core_get_simple_class
- [x] get_elem_size
- [x] is_real
## Array get and set
- [x] array_get (get from indices)
- [x] array_set (get from indices)
- [x] array_get (columns)
    - Inputs can actually be any shape in some circumstances
- [x] array_set (columns)
    - Inputs can actually be any shape in some circumstances
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
- [x] colon (`colon(i,j,k)`) -> Input to this is weird. it would take ([2,2],2,2) this is not an error, even though it should be
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
    ```
        X = rand()
        X = rand(n)
        X = rand(sz1,...,szN)
        X = rand([sz1,...,szN])
        X = rand(classname)
        X = rand(n,classname)
        X = rand(sz1,...,szN,classname)
        X = rand([sz1,...,szN],classname)
        X = rand(sz,classname)
    ```
- [x] randn (similar to rand)
- [x] randi
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
- [x] zeroes
- [x] ones
- [x] clone (Also an allocator)
- [x] eye
**NOTE:** For all constructors the supported and cannonical format will be:
```
sz=[1,2,4], classname

```

# Numerica Binary operations (Matrix-vs-Matrix, Matrix-vs-Scalar)
- [x] add
- [x] sub
- [x] ldivide
- [x] rdivide
- [x] times
- [x] rem
- [x] mod
- [x] ldivide
- [x] rdivide (right divide, elem-by-elem)
- [x] power (Base A is a square matrix and exponent B is a scalar)
# Logical Binary Operations
- [x] lt
- [x] le
- [x] gt
- [x] ge
- [x] eq
- [x] ne
- [x] eq
# Unary operations (M)->(M)
- [x] floor(x)
- [x] ceil(x)
- [x] sin(x)
- [x] cos(x)
- [x] tan(x)
- [x] sqrt(x)
- [x] uminus(x)
- [x] uplus(x)
- [x] round(x)
- [x] exp(x)
- [x] log(x)
- [x] abs(X)
- [x] not(x)
- [x] fix(x)

# Cum operations and reductions (M)->(M|S) reduce by one dimension to numeric
- [x] sum
- [x] prod
# Cum operations and reductions with either two or one matrix as input
- [ ] max
- [ ] min
## Combination of operations
- [ ] std (built using sum, and divide)
- [ ] mean

# Cum operations and reductions (M)->(M|S) reduce by one dimension to logical
- [x] any (determine if any elements are non-zero)
- [x] all
# Cumulative operations (M)->(M)
- [ ] cummin
- [ ] cummax
- [ ] movsum 
- [ ] cumsum (movsum, and cumsum the same with but cumsum(X) = movsum(X,0))
- [ ] cumprod
# Matrix comparison to logical (M,M)=> {1,0}
- [ ] isequal
# Other matrix operations  (Matrix-vs-Matrix, Matrix-vs-Scalar)
- [x] mtimes
- [ ] mrdivide (system of linear equations divide) x = B/A
- [ ] mldivide
- [ ] mpower
- [x] transpose
## Matrix concatanate 
- [x] horzcat (Concatenate matrices horizontally)
- [x] vertcat
- [x] concat about any other dimension
# Constants
- [x] e
- [x] PI
# Utility
- [ ] who
- [ ] disp
- [ ] tic
- [ ] toc
- [ ] assert
# Implementation

A few templates:

    Element wise:
        - Element-by-element constructor (ones, zeroes), no matrix values as inputs
            - Takes one scalar input
            - Takes no inputs
        -  Elementwise right scalar vs. matrix ( binary operations )
        -  Elementwise left matrix vs. scalar
    Pairwise:
       -  Numeric
       -  Logical
    Cumreduce: (M, func_ptr, init_val)
        - Reducing a matrix by certain dimension using a cumulative result
        e.g. sum, prod, mean, std
        - Reducing to logical
            - any, all
    Cumulative: 
        - Cumulative product of matrices, returns same sized matrix
        e.g. cumsum, cumprod
    
    