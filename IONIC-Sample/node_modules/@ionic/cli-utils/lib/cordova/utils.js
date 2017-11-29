"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("../utils/command");
const app_scripts_1 = require("../ionic-angular/app-scripts");
exports.CORDOVA_INTENT = 'cordova';
/**
 * Filter and gather arguments from command line to be passed to Cordova
 */
function filterArgumentsForCordova(metadata, inputs, options) {
    const results = command_1.filterOptionsByIntent(metadata, options, exports.CORDOVA_INTENT);
    const args = command_1.minimistOptionsToArray(results, { useEquals: false, allowCamelCase: true });
    let unparsedCdvArgs = [];
    const indexOfSep = inputs.indexOf('--');
    if (indexOfSep >= 0) {
        unparsedCdvArgs = inputs.splice(indexOfSep);
    }
    return [metadata.name].concat(inputs, args, unparsedCdvArgs);
}
exports.filterArgumentsForCordova = filterArgumentsForCordova;
/**
 * Start the app scripts server for emulator or device
 */
function generateBuildOptions(metadata, options) {
    const results = Object.assign({}, command_1.filterOptionsByIntent(metadata, options), command_1.filterOptionsByIntent(metadata, options, app_scripts_1.APP_SCRIPTS_INTENT));
    // Serve specific options not related to the actual run or emulate code
    return Object.assign({}, results, { externalAddressRequired: true, iscordovaserve: true, nobrowser: true, target: 'cordova' });
}
exports.generateBuildOptions = generateBuildOptions;
function getCordovaCLIVersion(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return env.shell.cmdinfo('cordova', ['-v', '--no-telemetry']);
    });
}
exports.getCordovaCLIVersion = getCordovaCLIVersion;
function getCordovaPlatformVersions(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let cordovaPlatforms = yield env.shell.cmdinfo('cordova', ['platform', 'ls', '--no-telemetry']);
        if (cordovaPlatforms) {
            cordovaPlatforms = cordovaPlatforms.replace(/\s+/g, ' ');
            cordovaPlatforms = cordovaPlatforms.replace('Installed platforms:', '');
            cordovaPlatforms = cordovaPlatforms.replace(/Available platforms.+/, '');
            cordovaPlatforms = cordovaPlatforms.trim();
        }
        return cordovaPlatforms;
    });
}
exports.getCordovaPlatformVersions = getCordovaPlatformVersions;
function checkCordova(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const project = yield env.project.load();
        if (!project.integrations.cordova) {
            yield env.runCommand(['integrations', 'enable', 'cordova']);
        }
    });
}
exports.checkCordova = checkCordova;
