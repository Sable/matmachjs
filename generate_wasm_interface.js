#!/usr/bin/env node

const {signatures, traverse} = require("@webassemblyjs/ast");
const path = require("path");
const { decode } = require("@webassemblyjs/wasm-parser");
const argv = require('yargs')
    .usage('Usage: $0 -o [output file] -m [path to wasm file]')
    .alias("m","module")
    .alias("o","output_file")
    .alias("i","interface-name")
    .describe("i","Name for the generated TS interface")
    .string("i")
    .boolean(["r"])
    .default("r",false)
    .alias("r","rest-parameters")
    .describe("rest", "Boolean flag to replace all arguments to functions by the rest argument (...args)")
    .demandOption(['m','o'])
    .argv;
const fs = require("fs");
if(!argv.i) {
    argv.i = path.basename(argv.o);
    argv.i = argv.i.substring(0, argv.i.lastIndexOf("."));
}
const decodedWasm = decode(fs.readFileSync(argv.m), {});
traverse(decodedWasm, {
    Module(ast) {

        // Functions
      let exported_functions = getFunctions(ast.node).reduce((acc, func)=>{
        let paramIndex = 0;
        const parameters =
            (argv.r)? (func.signature!=null && func.signature.params.length> 0)?"...args":"":
                func.signature.params
                    .map((param)=>{
                        const tsParam = `${param.valtype}_${paramIndex}:number`;
                        paramIndex++;return tsParam;}
                        ).join(", ");
        acc += `\t${func.name}(${parameters}):number;\n\n`;
        return acc;
      }, "");
        // Memories
        let exported_memories = getMemory(ast.node).reduce((acc, memDef)=>{
            return acc+`\t${memDef.name}:WebAssembly.Memory;\n`;
        },"");
        // Globals
        // Tables

        // Generated Module
        let generated_module =
            `export interface ${argv.i} {\n\n${exported_memories}${exported_functions}\n}`;
      fs.writeFileSync(argv.o,generated_module);
    }
  });
/**
 * Filters and traverses the Node to obtain function definitions and exports
 * @param node AST Node
 * @returns {T[]}
 */
function getFunctions(node){
     return node.fields.filter(field => field.type === 'ModuleExport'&& field.descr.exportType === 'Func')
        .reduce((acc, type)=>{
            acc.push(node.fields.filter(field => field.type === 'Func')
            .map((func)=>{
                if( Number(func.name.value.substring(5)) === type.descr.id.value){
                    acc.push({signature: func.signature, name: type.name});
                    return acc;
                }
            })[0]);
            return acc;
    },[]).filter(val=> typeof val !== "undefined");
}

/**
 * Filters and traverses the Node to obtain memory definitions and exports
 * @param node AST Node
 * @returns {T[]}
 */
function getMemory(node){
     return node.fields.filter(
            field => field.type === 'ModuleExport'
            && field.descr.exportType === 'Mem')
            .reduce((acc, type)=>{
                acc.push(
                    ...node.fields
                .filter(field => field.type === 'Memory'
                        || ( field.type === 'ModuleImport'&& field.descr.type === 'Memory' ))
                .map((mem)=>{
                    if(mem.type === 'ModuleImport'){// Must be an import
                        return {...mem.descr, name:type.name};
                    }else{ // Must be memory
                        return {...mem,name:type.name};
                    }
                }));
            return acc;
        },[]).filter(val=> typeof val !== "undefined");
}
function getGlobals(node){
    return node.fields.filter(
        field => field.type === 'ModuleExport'
            && field.descr.exportType === 'GlobalType')
        .reduce((acc, type)=>{
            acc.push(
                ...node.fields
                    .filter(field => field.type === 'GlobalType'
                        || ( field.type === 'ModuleImport'&& field.descr.type === 'GlobalType' ))
                    .map((mem)=>{
                        if(mem.type === 'ModuleImport'){// Must be an import
                            return {...mem.descr, name:type.name};
                        }else{ // Must be memory
                            return {...mem,name:type.name};
                        }
                    }));
            return acc;
        },[]).filter(val=> typeof val !== "undefined");
}
