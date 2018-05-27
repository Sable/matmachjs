# Implementing setters and getters


Matlab allows for many different ways to get/set in an array, depending on
the parameters passed to the array. Most of them work in the same way
for instance
 `R = randn(N)` returns an N-by-N matrix containing pseudorandom values drawn
from the standard normal distribution.  `randn(M,N)` or `randn([M,N])` returns
an M-by-N matrix. `randn(M,N,P,...)` or `randn([M,N,P,...])` returns an
M-by-N-by-P-by-... array. randn returns a scalar.  `randn(SIZE(A))` returns
an array the same size as A.
