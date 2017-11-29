"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = require("chalk");
const lib_1 = require("@ionic/cli-framework/lib");
const command_1 = require("@ionic/cli-utils/lib/command");
const utils_1 = require("@ionic/cli-utils/lib/cordova/utils");
const errors_1 = require("@ionic/cli-utils/lib/errors");
const base_1 = require("./base");
let PluginCommand = class PluginCommand extends base_1.CordovaCommand {
    preRun(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.preRunChecks();
            inputs[0] = (typeof inputs[0] === 'undefined') ? 'ls' : inputs[0];
            inputs[0] = (inputs[0] === 'rm') ? 'remove' : inputs[0];
            inputs[0] = (inputs[0] === 'list') ? 'ls' : inputs[0];
            lib_1.validate(inputs[0], 'action', [lib_1.contains(['add', 'remove', 'ls', 'save'], {})]);
            // If the action is list then lets just end here.
            if (['ls', 'save'].includes(inputs[0])) {
                yield this.runCordova(['plugin', inputs[0]], { showExecution: true });
                throw new errors_1.FatalException('', 0);
            }
            if (!inputs[1]) {
                const plugin = yield this.env.prompt({
                    message: `What plugin would you like to ${inputs[0]}:`,
                    type: 'input',
                    name: 'plugin',
                });
                inputs[1] = plugin;
            }
            lib_1.validate(inputs[1], 'plugin', [lib_1.validators.required]);
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const optionList = utils_1.filterArgumentsForCordova(this.metadata, inputs.splice(0, 2), options);
            if (!optionList.includes('--save')) {
                optionList.push('--save');
            }
            yield this.runCordova(optionList, { showExecution: true });
        });
    }
};
PluginCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'plugin',
        type: 'project',
        description: 'Manage Cordova plugins',
        longDescription: `
Like running ${chalk_1.default.green('cordova plugin')} directly, but provides friendly checks.
  `,
        exampleCommands: ['', 'add cordova-plugin-inappbrowser@latest', 'add phonegap-plugin-push --variable SENDER_ID=XXXXX', 'rm cordova-plugin-camera'],
        inputs: [
            {
                name: 'action',
                description: `${chalk_1.default.green('add')} or ${chalk_1.default.green('remove')} a plugin; ${chalk_1.default.green('ls')} or ${chalk_1.default.green('save')} all project plugins`,
            },
            {
                name: 'plugin',
                description: `The name of the plugin (corresponds to ${chalk_1.default.green('add')} and ${chalk_1.default.green('remove')})`,
            },
        ],
        options: [
            {
                name: 'force',
                description: `Force overwrite the plugin if it exists (corresponds to ${chalk_1.default.green('add')})`,
                type: Boolean,
                intents: [utils_1.CORDOVA_INTENT],
                advanced: true,
            },
            {
                name: 'variable',
                description: 'Specify plugin variables',
                intents: [utils_1.CORDOVA_INTENT],
            }
        ]
    })
], PluginCommand);
exports.PluginCommand = PluginCommand;
