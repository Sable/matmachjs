# API functions

# Allocation
- [x] Malloc
    - [x] Implementation
    - [x] Unit tests
- [ ] Realloc
- [ ] Free

# Matrix Allocators

- [x] create_array_1D
- [x] create_array_ND
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
- [ ] array_set (columns)
# Array properties
- [x] is_scalar
- [x] numel
- [x] size
- [ ] stride
- [ ] dims
- [ ] get_colon
- [ ] get_index
- [ ] set_colon
# Matrix Constructors
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
- [ ] length (lenght of largest dim)
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
