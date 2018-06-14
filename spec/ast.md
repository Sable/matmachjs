# AST Specification
We will have to see if we can use JastAdd or Scala ;). JastAdd may be
powerful enough, it depends on whether I can access the list of each
nidyke type
## Module
```
Module = {
    Functions:List<Function>
    Tables:List<Table>
    Memories:List<Memory>
    Globals:List<Globals>
    ElementSegments:List<Element>
    DataSegments: List<Data>
    Start?: Int // Function index, function must not return anything,
                // and must receive no arguments.
    Exports:List<Export>
    Imports:List<Import>
}
```
## Expression
Have an interface expression,
```
Expression =
{
    List<Instructions>,
    ReturnType:List<ValueTypes>
}
```
```
ConstantExpression: Expression = {
}
All instructions must be constants of the type: get_global of type const, and Const.
```
## Types

```
ValueType: enum = {i32,i64,f32,f64}
```
```

GlobalType = {
    mut: Mut,
    type: ValueType
}
Mut: enum = {"mut","const"}
```
```

MemoryType = {
    limits: Limits
}
```
```

TableType = {
    tabletype:TableType,
    limits: Limits
}
TableType:Enum = { "anyfunc" }
```

## Functions
```
Function = {
    Name?:String,
    Type:Type,
    Locals:List<Local>
    Body: Body

}

```
```
Body = {
    expression:Expression,
    getResultType() // Will result the type and throw an error
}

```
```
Local = {
    type: ValueType,
    name?: String
}
```
## Memories
```
Memory = {
    name?: String,
    memtype: MemoryType
}
```
## Data Segments
```
DataSegment = {
    index: Int,
    offset: ConstantExpression,
    init: String
}
```
## Tables
```
Table = {
    name?: String,
    tabletype: TableType
}
```
```
Limits = {
    min: Int,
    max?: Int
}
Where min > max.
```
## Element Segments
```
ElementSegment = {
    index: Int,
    offset: ConstantExpression,
    init: List<Integer>
}
```
## Globals
```
Global = {
    name?:string,
    type: GlobalType
}

```
## Start
```
Start = {
    funcidx: Int // This must point to function index
}
```
## Exports
```
Export = {
    name: String, // Must be utf8, we will assume this, Java strings UTF16
                // This will not be a problem. Notice there is a difference
                // between internal byte representation and string. i.e. The
                // same string can be represented in both utf8 and utf16,
                // the only difference is that it will take more bytes in utf8
    desc: ExportDesc
}
```
```
ExportDesc = {
    Type: enum {Func, Table, Mem, Global},
    Index: Int
}
```
## Imports
```
Import = {
    moduleName: String,
    name: String,
    desc: ImportDesc

}
```
```
ImportDesc = {
Type: enum {Func,Table, Mem, Global},
}
ImportFuncDesc: ImportDesc = {
    Index: Int
}
ImportTableDesc: ImportDesc = {
    tabletype: TableType
}

ImportGlobalDesc: ImportDesc = {
    globaltype: GlobalType
}
ImportTableDesc: ImportDesc = {
    tabletype: TableType
}
```
In any module, the import index goes before any defition of the index itself

# Validation
Each module instance creates a context. This context will be the
module instance.
Modules are valid when all its components are valid.

## Functions
