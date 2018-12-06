# MatWably TypeScript Interface

The idea of this interface is to offer an expressive interface to the WebAssembly kernels.
The API will initially ressemble what Matlab offers, that is, the memory model will be like Matlab's
and the interface will have Matlab-like behaviour. Eventually more granularity will be given to ressemble more Python like structures.

Array semantics should be copy by value
## Constructors

- **Functions:** `ones()`, `zeros()`, `randn()`, `eye()`, `rand()`, `randi()`, `colon()`, `clone()`
  
Categories will be give in terms of inputs.
- Shape-based (shape): `ones()`, `zeros()`, `randn()`, `eye()`, `rand()` 
    - **Description**: They take a shape and return an array of that size
- Value & Shape: `randi()`
    - **Description**: Take a value and a shape and return an array of that size
- Others: `colon()`, `linespace()`
    - **Description**: Either take two or three values and produce a row-vector.
