"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = require("chalk");
const guards_1 = require("../guards");
const lib_1 = require("@ionic/cli-framework/lib");
const command_1 = require("./utils/command");
const lib_2 = require("@ionic/cli-framework/lib");
function CommandMetadata(metadata) {
    return function (target) {
        target.prototype.metadata = metadata;
    };
}
exports.CommandMetadata = CommandMetadata;
class Command extends lib_2.Command {
    execute(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield this.env.config.load();
            if (guards_1.isCommandPreRun(this)) {
                yield this.preRun(inputs, options);
            }
            if (this.metadata.inputs) {
                for (let input of this.metadata.inputs) {
                    if (!input.validators) {
                        input.validators = [];
                    }
                    if (input.required !== false) {
                        input.validators.unshift(lib_1.validators.required);
                    }
                }
                try {
                    // Validate inputs again, this time with required validator (prompt input
                    // should've happened in preRun)
                    lib_2.validateInputs(inputs, this.metadata);
                }
                catch (e) {
                    if (!this.env.flags.interactive) {
                        this.env.log.warn(`Command ran non-interactively due to ${chalk_1.default.green('--no-interactive')} flag, CI being detected, or a config setting.`);
                    }
                    throw e;
                }
            }
            const runPromise = this.run(inputs, options);
            const telemetryPromise = (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (config.telemetry !== false) {
                    let cmdInputs = [];
                    if (this.metadata.name === 'login' || this.metadata.name === 'logout') {
                        yield runPromise;
                    }
                    else if (this.metadata.name === 'help') {
                        cmdInputs = inputs;
                    }
                    else {
                        cmdInputs = yield this.getCleanInputsForTelemetry(inputs, options);
                    }
                    yield this.env.telemetry.sendCommand(`ionic ${this.metadata.fullName}`, cmdInputs);
                }
            }))();
            yield Promise.all([runPromise, telemetryPromise]);
        });
    }
    getCleanInputsForTelemetry(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const initialOptions = { _: [] };
            const filteredInputs = inputs.filter((input, i) => !this.metadata.inputs || (this.metadata.inputs[i] && !this.metadata.inputs[i].private));
            const filteredOptions = Object.keys(options)
                .filter(optionName => {
                const metadataOption = this.metadata.options && this.metadata.options.find((o) => {
                    return o.name === optionName || (typeof o.aliases !== 'undefined' && o.aliases.includes(optionName));
                });
                if (metadataOption && metadataOption.aliases && metadataOption.aliases.includes(optionName)) {
                    return false; // exclude aliases
                }
                if (!metadataOption) {
                    return true; // include unknown options
                }
                if (metadataOption.private) {
                    return false; // exclude private options
                }
                if (typeof metadataOption.default !== 'undefined' && metadataOption.default === options[optionName]) {
                    return false; // exclude options that match their default value (means it wasn't supplied by user)
                }
                return true;
            })
                .reduce((allOptions, optionName) => {
                allOptions[optionName] = options[optionName];
                return allOptions;
            }, initialOptions);
            const optionInputs = command_1.minimistOptionsToArray(filteredOptions, { useDoubleQuotes: true });
            return filteredInputs.concat(optionInputs);
        });
    }
}
exports.Command = Command;
