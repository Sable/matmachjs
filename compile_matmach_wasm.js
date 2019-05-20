const argv = require("yargs")
    .alias("-o","--out")
    .boolean("b")
    .alias("-b","--out-buffer")
    .argv;
const fs = require("fs");
const path = require("path");
const shelljs = require('shelljs');
async function compileFiles(files=argv._, out_buffer=argv.b, out=argv.o){
    if(files){
        await files.forEach(async (file) => {
            let baseName = path.basename(file);
            let name = baseName.substring(0, baseName.lastIndexOf("."));
            let outFileWasm = (out)?out:`./bin/${name}.wasm`;
            console.log(outFileWasm);
            let nameOut = outFileWasm.substring(0, outFileWasm.lastIndexOf("."));
            shelljs.cp(file,"./bin")
            let status = await shelljs.exec(`wat2wasm ${file} -o ${outFileWasm}`);
            if(status.code === 0){
	            // Generate TS interface
	            let outFileWasmTS = `./src/ts/classes/native/MatMachWasm.ts`;
                let status_ts_interface = await shelljs.exec(`./generate_wasm_interface.js -o ${outFileWasmTS} -m ${outFileWasm} -r`);
	            if(status_ts_interface.code === 1) throw new Error("Problem generating TS interface"+status_ts_interface.stdout);
                if(out_buffer){
		            let outFileWasmJS = `${nameOut}-wasm.js`;
		            let outFileWasmTS = `./src/ts/classes/native/${name}-wasm.ts`;
		            let buffer = fs.readFileSync(outFileWasm).toString('hex');
		            fs.writeFileSync(outFileWasmJS,`module.exports = {module:"${buffer}"}`);
		            console.log(outFileWasmTS);
		            fs.writeFileSync(outFileWasmTS,`export var MatMachNativeModule = "${buffer}";`);
	            }


            }

        });
    }else{
        throw new Error("Files to compile must be present");
    }
}
if(argv._ && argv._.length > 0) compileFiles();
module.exports = { compileFiles };

