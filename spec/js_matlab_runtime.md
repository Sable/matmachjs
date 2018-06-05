# MATLAB JS Runtime using WebAssembly

The idea here is to have a running version of Matlab inside the web using JavaScript. This will take my 
WebAssembly backend and put on top of it a nice JavaScript API in order to get those functions available. Similarly to Matlab, we should be able to call functions such as `whos`, `tic`, and `toc`.
Here is what I envisioned as a sample program.
```
((mr)=>{
    mr.tic();
    let a = mr.ones(1,2,3,'int8');
    let b = mr.size(a);
    let c = mr.rand(3,7,2);
    c.set([[1],colon(1,5),[1]],[2,1,2,3,4]);
    mr.whos(c);
    mr.disp(c);
    mr.toc();
})

```
