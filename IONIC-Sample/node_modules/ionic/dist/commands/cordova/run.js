"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = require("chalk");
const command_1 = require("@ionic/cli-utils/lib/command");
const base_1 = require("./base");
let RunCommand = class RunCommand extends base_1.CordovaRunCommand {
};
RunCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'run',
        type: 'project',
        description: 'Run an Ionic project on a connected device',
        longDescription: `
Like running ${chalk_1.default.green('cordova run')} directly, but also watches for changes in web assets and provides live-reload functionality with the ${chalk_1.default.green('--livereload')} option.

For Android and iOS, you can setup Remote Debugging on your device with browser development tools: ${chalk_1.default.bold('https://docs.ionic.io/tools/developer/#remote-debugging')}

Just like with ${chalk_1.default.green('ionic cordova build')}, you can pass additional options to the Cordova CLI using the ${chalk_1.default.green('--')} separator.
  `,
        exampleCommands: ['', 'ios', 'ios -lc', 'android -lc --address=localhost', 'android -lc -- -d'],
        inputs: [
            {
                name: 'platform',
                description: `The platform to run (${['android', 'ios'].map(v => chalk_1.default.green(v)).join(', ')})`,
            }
        ],
        options: base_1.CORDOVA_RUN_COMMAND_OPTIONS,
    })
], RunCommand);
exports.RunCommand = RunCommand;
