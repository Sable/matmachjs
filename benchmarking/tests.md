# Some benchmarks that need to be ran

1. Creating functions for every operand vs. inlining these in the actual functions compiled.

<table>
    <th>
      Creating Functions For Operators</th>
  <tr>
    <td>Pros</td>
    <td>Cons</td>
  </tr>
  <tr>
    <td> Modular</td>
    <td>Less Efficient since now we will do a function call</td>
  </tr>
  <tr>
    <td>May be optmized by the JIT as a function</td>
    <td>Far more work...</td>
  </tr>
  <tr>
    <td>More readable</td>
    <td></td>
  </tr>
</table>
Example:

```
get_array_index_s32(array i32, index i32) (return i32)
{
    get_local array
    call $get_type
    call $get_type_size
    get_local index
    i32.add -1
    i32.mul
    get_local array
    i32.add
    i32.load //--> This changes depending on the type of the array so must create array               //for each type, same goes for every operation
    return
}
```