"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const validators_1 = require("./validators");
class Command {
    validate(inputs) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            validateInputs(inputs, this.metadata);
        });
    }
}
exports.Command = Command;
function validateInputs(argv, metadata) {
    if (!metadata.inputs) {
        return;
    }
    const errors = [];
    for (let i in metadata.inputs) {
        const input = metadata.inputs[i];
        if (input.validators && input.validators.length > 0) {
            const vnames = input.validators.map(v => v.name);
            if (vnames.includes('required')) {
                validators_1.validate(argv[i], input.name, [validators_1.validators.required], errors);
            }
            else {
                if (argv[i]) {
                    validators_1.validate(argv[i], input.name, input.validators, errors);
                }
            }
        }
    }
    if (errors.length > 0) {
        throw errors;
    }
}
exports.validateInputs = validateInputs;
