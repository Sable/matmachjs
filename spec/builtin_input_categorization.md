# Input Categorization

Matlab builtins are separated into different types of inputs. 

## OneMatrixInput:

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
- [x] clone(x)
- [x] all
- [x] any



## ShapeInput
- [x] zeros
- [ ] ones
- [ ] eye
- [ ] rand
- [ ] randn
## OneMatrixAndShapeInput
- [ ] reshape
## ThreeRowVectorsInput
- [ ] colon
## NoInput
- [x] pi
- [ ] e
- [ ] tic
- [ ] toc

## OneMatrixAndDimension
- [ ] max
- [ ] min
- [ ] sum
- [ ] prod
- [ ] mean
- [ ] cumprod
- [ ] cumsum
- [ ] movsum
## VariableMatrixInput
- concat
- horzcat
- vertcat
## TwoMatrixInput
- [x] lt
- [x] le
- [x] gt
- [x] ge
- [x] eq
- [x] ne
- [x] eq
- [x] sub
- [x] ldivide
- [x] rdivide
- [x] times
- [x] rem
- [x] mod
- [x] ldivide
- [x] rdivide (right divide, elem-by-elem)
- [x] power (Base A is a square matrix and exponent B is a scalar)
## Exception
- max Actually takes three inputs
- min Actually takes three inputs
