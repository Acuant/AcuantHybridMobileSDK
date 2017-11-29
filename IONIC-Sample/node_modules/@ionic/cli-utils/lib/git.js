"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const fs_1 = require("@ionic/cli-framework/utils/fs");
function isRepoInitialized(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return yield fs_1.pathExists(path.join(env.project.directory, '.git'));
    });
}
exports.isRepoInitialized = isRepoInitialized;
function initializeRepo(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield env.shell.run('git', ['init'], { showSpinner: false, cwd: env.project.directory });
    });
}
exports.initializeRepo = initializeRepo;
function getIonicRemote(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const regex = /ionic\t(.+) \(\w+\)/;
        // would like to use get-url, but not available in git 2.0.0
        const remotes = yield env.shell.run('git', ['remote', '-v'], { showCommand: false, cwd: env.project.directory });
        for (let line of remotes.split('\n')) {
            const match = regex.exec(line.trim());
            if (match) {
                return match[1];
            }
        }
    });
}
exports.getIonicRemote = getIonicRemote;
function addIonicRemote(env, url) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield env.shell.run('git', ['remote', 'add', 'ionic', url], { showSpinner: false, cwd: env.project.directory });
    });
}
exports.addIonicRemote = addIonicRemote;
function setIonicRemote(env, url) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield env.shell.run('git', ['remote', 'set-url', 'ionic', url], { showSpinner: false, cwd: env.project.directory });
    });
}
exports.setIonicRemote = setIonicRemote;
