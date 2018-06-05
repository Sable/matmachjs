
# Assertion Library

One point of discussion when coding this back-end is how many checks for input values should be performed on the code.
Let's go through an example, the function `colon(i,j,k)` always returns an array of doubles, except for two circumstances, i.e.
```
Arguments
    ✓ should throw error if less than two inputs
    ✓ should throw error if an argument is null
```
This trends generalize to every Matlab function. Another trend that similarly portrays this behaviour is the set function. An example is the following:
```
b = rand(3,7,2)
b([2],1:7,[1]) = [1,2,3,4,5,6,7]
b([1,4,5,7,12,3,42]) = [1,2,3,4,5,6,7]
```
While performing this function we have to do a number of checks on the input arguments. Here is a list of them:
- Check for null arguments
- Check whether all the indeces passed to access are positive and real
- If more than one argument is passed to access the mxarray, check that it doesn't have exceed the individual dimension length, which corresponds to the ndim.
- If only one argument is passed, check that it doesn't exceed the number of elements in the matrix.
- Lastly, check that the values on the right hand side, match the number of values indexed on the left hand side.

This will incurred a cost at different levels, null pointer checking, and simply going through all the input arguments verifying certain criteria. Most Matlab functions due to their high-level of polymorphism contain a lot of checks for different things.
To get over this performance overhead, we can provide a version of code that gets rid of these assertions by the use of a compilation flag. We can do this via an assertion library, where in the compilation step, we can either remove or keep these run-time assertions.