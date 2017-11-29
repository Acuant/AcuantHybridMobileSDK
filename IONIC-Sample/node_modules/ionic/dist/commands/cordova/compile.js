"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = require("chalk");
const command_1 = require("@ionic/cli-utils/lib/command");
const utils_1 = require("@ionic/cli-utils/lib/cordova/utils");
const base_1 = require("./base");
let CompileCommand = class CompileCommand extends base_1.CordovaCommand {
    preRun(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.preRunChecks();
            if (!inputs[0]) {
                const platform = yield this.env.prompt({
                    type: 'input',
                    name: 'platform',
                    message: `What platform would you like to compile (${['android', 'ios'].map(v => chalk_1.default.green(v)).join(', ')}):`
                });
                inputs[0] = platform.trim();
            }
            yield this.checkForPlatformInstallation(inputs[0]);
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.runCordova(utils_1.filterArgumentsForCordova(this.metadata, inputs, options), { showExecution: true });
        });
    }
};
CompileCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'compile',
        type: 'project',
        description: 'Compile native platform code',
        longDescription: `
Like running ${chalk_1.default.green('cordova compile')} directly, but provides friendly checks.
  `,
        exampleCommands: [
            'ios',
            'ios --device',
            'android',
        ],
        inputs: [
            {
                name: 'platform',
                description: `The platform to compile (${['android', 'ios'].map(v => chalk_1.default.green(v)).join(', ')})`,
            },
        ],
        options: [
            {
                name: 'debug',
                description: 'Create a Cordova debug build',
                type: Boolean,
                intents: [utils_1.CORDOVA_INTENT],
            },
            {
                name: 'release',
                description: 'Create a Cordova release build',
                type: Boolean,
                intents: [utils_1.CORDOVA_INTENT],
            },
            {
                name: 'device',
                description: 'Compile Cordova build to a device',
                type: Boolean,
                intents: [utils_1.CORDOVA_INTENT],
            },
            {
                name: 'emulator',
                description: 'Compile Cordova build to an emulator',
                type: Boolean,
                intents: [utils_1.CORDOVA_INTENT],
            },
        ],
    })
], CompileCommand);
exports.CompileCommand = CompileCommand;
