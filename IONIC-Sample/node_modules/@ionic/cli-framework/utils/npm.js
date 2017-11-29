"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const guards_1 = require("../guards");
const fs_1 = require("./fs");
exports.ERROR_INVALID_PACKAGE_JSON = 'INVALID_PACKAGE_JSON';
exports.ERROR_INVALID_BOWER_JSON = 'INVALID_BOWER_JSON';
/**
 * Lightweight version of https://github.com/npm/validate-npm-package-name
 */
function isValidPackageName(name) {
    return encodeURIComponent(name) === name;
}
exports.isValidPackageName = isValidPackageName;
function readPackageJsonFile(path) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const packageJson = yield fs_1.fsReadJsonFile(path);
        if (!guards_1.isPackageJson(packageJson)) {
            throw exports.ERROR_INVALID_PACKAGE_JSON;
        }
        return packageJson;
    });
}
exports.readPackageJsonFile = readPackageJsonFile;
function readBowerJsonFile(path) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const bowerJson = yield fs_1.fsReadJsonFile(path);
        if (!guards_1.isBowerJson(bowerJson)) {
            throw exports.ERROR_INVALID_BOWER_JSON;
        }
        return bowerJson;
    });
}
exports.readBowerJsonFile = readBowerJsonFile;
