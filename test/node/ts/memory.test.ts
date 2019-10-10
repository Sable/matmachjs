

import { MachRuntime } from "../../../src/ts/classes/macharray/MachRuntime";
import { expect } from "chai";

let mr: MachRuntime;
describe('Memory', () => {
    beforeEach(async () => {
        mr = await MachRuntime.initializeRuntime();
    });

    it('should test memory limits', () => {
        expect( mr.ones.bind(mr,[100000,1000]))
        .to.not.throw();
    });
});