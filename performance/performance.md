# Benchmark Generator


# Case Study: MatMachJS Library
In this section, we give examples of 
## Performance

To measure the performance of the library, there are a few
factors to be taken into account.
- Size of the inputs. For the experiments each benchmark will have:
    - small
    - medium
    - large
- The nature of start-up versus warm-up time.
- The JavaScript engine under consideration.
    In this case, we will use Node.js, we hope to cover two 
    environments, i.e. V8 Node.js and Chromium.
- The operations.
- The libraries to test against.
- Whether we are testing the interface or WebAssembly directly.
Procedure:
    - Divide by builtin-in template
    - Test one built-in template at a time for each size &
      start-up vs. steady state. 

#### Constructors test:[x]
    - colon()
    - eye()
    - randn()
    - ones()
    - rand()
    - zeros()
    - randi()
#### Binary Ops:
There will be two types:
   - Elementary Op Implemented in JavaScript
    - Elementary Op Implemented in WebAssembly
Functions to examine:
    - plus
    - mul


#### Unary Ops:
    - abs
    - sqrt
    - sin

#### Colon 
    - colon
#### Matrix-based cumulative
    - Sum
    - Prod
    - Mean
    - Std
#### Matrix transformation
    - Matrix Multiplication
    - Matrix Transpose

#### Concatanation
- concat

#### Array Access
- Index
- Multiple indices
- Colon


