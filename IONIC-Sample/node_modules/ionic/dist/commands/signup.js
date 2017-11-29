"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@ionic/cli-utils/lib/command");
let SignupCommand = class SignupCommand extends command_1.Command {
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const opn = yield Promise.resolve().then(function () { return require('opn'); });
            const dashUrl = yield this.env.config.getDashUrl();
            opn(`${dashUrl}/signup?source=cli`, { wait: false });
            this.env.log.ok('Launched signup form in your browser!');
        });
    }
};
SignupCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'signup',
        type: 'global',
        description: 'Create an Ionic account',
    })
], SignupCommand);
exports.SignupCommand = SignupCommand;
