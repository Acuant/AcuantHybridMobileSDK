"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = require("chalk");
const lib_1 = require("@ionic/cli-framework/lib");
const command_1 = require("@ionic/cli-utils/lib/command");
const integrations_1 = require("@ionic/cli-utils/lib/integrations");
let IntegrationsDisableCommand = class IntegrationsDisableCommand extends command_1.Command {
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const [id] = inputs;
            yield integrations_1.disableIntegration(this.env, id);
        });
    }
};
IntegrationsDisableCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'disable',
        type: 'project',
        description: 'Disable an integration',
        inputs: [
            {
                name: 'id',
                description: `The integration to disable (${integrations_1.INTEGRATIONS.map(i => chalk_1.default.green(i.name)).join(', ')})`,
                validators: [lib_1.contains(integrations_1.INTEGRATIONS.map(i => i.name), {})],
            }
        ],
    })
], IntegrationsDisableCommand);
exports.IntegrationsDisableCommand = IntegrationsDisableCommand;
