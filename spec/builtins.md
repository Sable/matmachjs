# API functions

# Allocation
- [x] Malloc
    - [x] Implementation
    - [x] Unit tests
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
- [ ] array_get (columns)
    - Colon by itself transforms array into column direction
    - A(:) reshapes the array into a column vector
    - x = j:i:k creates a regularly-spaced vector x using i as the increment between elements. The vector elements are roughly equal to [j,j       +i,j+2*i,...,j+m*i] where m = fix((k-j)/i)
    - x = j:k creates a unit-spaced vector x with elements [j,j+1,j+2,...,j+m] where m = fix(k-j)
- [ ] array_set (columns)
# Array properties
- [x] is_scalar
- [x] numel
- [x] size
- [x] ndims
- [x] length (lenght of largest dim)
- [x] isrow
- [ ] iscolumn
- [ ] ismatrix
# Matrix Constructors
- [ ] colon (`colon(i,j,k)`)
    - __Description__
        - At least 2 parameters must be passed otherwise error
        - If j > i, then return a 1x0 array column vector
        - If k = 0, then return a 1x0 array column vector 
        - If j > k return i
        - if k is not defined
            - Increments of 1 integer from i to m inclusive, where m = fix(j-i). 
        - If k is defined then it does starting from i to m using k increments where m = fix((k-j)/i).
- [ ] rand
- [ ] randn
- [ ] randi
- [ ] zeroes
- [ ] ones
- [ ] eye
- [ ] colon(start,stop,step) 
- [ ] clone (Also an allocator)

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
