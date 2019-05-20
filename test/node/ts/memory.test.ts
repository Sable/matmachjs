

// import {MachRuntime} from "../../../src/ts/classes/macharray/MachRuntime";
import { MachRuntime } from "../../../src/ts/classes/macharray/MachRuntime";
import {MachArray} from "../../../src/ts/classes/macharray/MachArray";
import {expect} from "chai";
let wi: WebAssembly.ResultObject;
let mr: MachRuntime;
describe('Memory', () => {
    beforeEach(async () => {
        // wi = await WebAssembly.instantiate(
        //     await import(ENV_VARIABLES.WASM_WASM_JS),
        //     await import(ENV_VARIABLES.WASM_LIB_JS));
        mr = await MachRuntime.initializeRuntime();
    });



});