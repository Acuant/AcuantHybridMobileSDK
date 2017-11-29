"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = require("chalk");
const lib_1 = require("@ionic/cli-framework/lib");
const command_1 = require("@ionic/cli-utils/lib/command");
let TelemetryCommand = class TelemetryCommand extends command_1.Command {
    preRun(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.env.log.warn(`${chalk_1.default.green('ionic telemetry')} is deprecated. Please use ${chalk_1.default.green('ionic config')} directly. Examples:\n` +
                `    ${chalk_1.default.green('ionic config get -g telemetry')}\n` +
                `    ${chalk_1.default.green('ionic config set -g telemetry true')}\n` +
                `    ${chalk_1.default.green('ionic config set -g telemetry false')}`);
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield this.env.config.load();
            const [status] = inputs;
            const enableTelemetry = config.telemetry;
            if (typeof status === 'string') {
                config.telemetry = status.toLowerCase() === 'on';
            }
            if (typeof status === 'string' || enableTelemetry !== config.telemetry) {
                this.env.log.ok(`Telemetry: ${chalk_1.default.bold(config.telemetry ? 'ON' : 'OFF')}`);
            }
            else {
                this.env.log.msg(`Telemetry: ${chalk_1.default.bold(config.telemetry ? 'ON' : 'OFF')}`);
            }
            if (config.telemetry) {
                this.env.log.msg('Thank you for making the CLI better! ❤️');
            }
        });
    }
};
TelemetryCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'telemetry',
        type: 'global',
        description: 'Opt in and out of telemetry',
        deprecated: true,
        inputs: [
            {
                name: 'status',
                description: `${chalk_1.default.green('on')} or ${chalk_1.default.green('off')}`,
                validators: [lib_1.contains(['on', 'off'], { caseSensitive: false })],
                required: false,
            }
        ],
    })
], TelemetryCommand);
exports.TelemetryCommand = TelemetryCommand;
