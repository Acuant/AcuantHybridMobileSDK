"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = require("chalk");
const command_1 = require("@ionic/cli-utils/lib/command");
const errors_1 = require("@ionic/cli-utils/lib/errors");
let ShareCommand = class ShareCommand extends command_1.Command {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const dashUrl = yield this.env.config.getDashUrl();
            throw new errors_1.FatalException(`${chalk_1.default.green('ionic share')} has been removed as of CLI 3.0.\n` +
                `The functionality now exists in the Ionic Dashboard: ${chalk_1.default.bold(dashUrl)}`);
        });
    }
};
ShareCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'share',
        type: 'global',
        description: '',
        visible: false,
    })
], ShareCommand);
exports.ShareCommand = ShareCommand;
