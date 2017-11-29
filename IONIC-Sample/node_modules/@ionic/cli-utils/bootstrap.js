"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = require("fs");
const path = require("path");
const semver = require("semver");
const fs_1 = require("@ionic/cli-framework/utils/fs");
const npm_1 = require("@ionic/cli-framework/utils/npm");
exports.ERROR_BASE_DIRECTORY_NOT_FOUND = 'BASE_DIRECTORY_NOT_FOUND';
exports.ERROR_LOCAL_CLI_NOT_FOUND = 'LOCAL_CLI_NOT_FOUND';
exports.ERROR_VERSION_TOO_OLD = 'VERSION_TOO_OLD';
function detectLocalCLI() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const dir = yield fs_1.findBaseDirectory(process.cwd(), 'package.json');
        if (!dir) {
            throw exports.ERROR_BASE_DIRECTORY_NOT_FOUND;
        }
        const local = path.join(dir, 'node_modules', 'ionic');
        const ok = yield fs_1.pathAccessible(local, fs.constants.R_OK);
        if (!ok) {
            throw exports.ERROR_LOCAL_CLI_NOT_FOUND;
        }
        const pkg = yield npm_1.readPackageJsonFile(path.join(local, 'package.json'));
        if (semver.lt(pkg.version || '', '3.10.0')) {
            throw exports.ERROR_VERSION_TOO_OLD;
        }
        return local;
    });
}
exports.detectLocalCLI = detectLocalCLI;
