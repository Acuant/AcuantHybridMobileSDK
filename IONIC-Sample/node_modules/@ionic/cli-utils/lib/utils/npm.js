"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const chalk_1 = require("chalk");
const guards_1 = require("../../guards");
const shell_1 = require("../shell");
const fs_1 = require("@ionic/cli-framework/utils/fs");
const npm_1 = require("@ionic/cli-framework/utils/npm");
/**
 * To be used with a module path resolved from require.resolve().
 */
function readPackageJsonFileOfResolvedModule(resolvedModule) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const p = path.dirname(path.dirname(resolvedModule)); // "main": <folder>/index.js
        try {
            return yield npm_1.readPackageJsonFile(path.resolve(p, 'package.json'));
        }
        catch (e) {
            if (e !== fs_1.ERROR_FILE_NOT_FOUND) {
                throw e;
            }
            const p = path.dirname(resolvedModule); // "main": index.js
            return yield npm_1.readPackageJsonFile(path.resolve(p, 'package.json'));
        }
    });
}
exports.readPackageJsonFileOfResolvedModule = readPackageJsonFileOfResolvedModule;
let installer;
/**
 * Resolves pkg manager intent with command args.
 *
 * @return Promise<args> If the args is an empty array, it means the pkg manager doesn't have that command.
 */
function pkgManagerArgs(env, options = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let vocab;
        const config = yield env.config.load();
        if (!options.command) {
            options.command = 'install';
        }
        let command = options.command;
        if (command === 'dedupe') {
            delete options.pkg;
        }
        if (command === 'dedupe' || command === 'rebuild') {
            delete options.global;
            delete options.link;
            delete options.save;
            delete options.saveDev;
        }
        if (command === 'dedupe' || command === 'rebuild' || command === 'uninstall') {
            delete options.saveExact;
        }
        if (command === 'install' || command === 'uninstall') {
            if (options.link) {
                options.global = false;
                if (command === 'install') {
                    command = 'link';
                }
                else if (command === 'uninstall') {
                    command = 'unlink';
                }
            }
            if (options.global || options.link) {
                options.save = false;
                options.saveDev = false;
                options.saveExact = false;
            }
            else if (options.pkg && typeof options.save === 'undefined' && typeof options.saveDev === 'undefined') {
                options.save = true;
            }
            if (command === 'install' && options.pkg && typeof options.saveExact === 'undefined') {
                options.saveExact = true;
            }
        }
        if (config.yarn) {
            if (!installer) {
                try {
                    yield env.shell.run('yarn', ['--version'], { fatalOnNotFound: false, showCommand: false });
                    installer = 'yarn';
                }
                catch (e) {
                    if (e === shell_1.ERROR_SHELL_COMMAND_NOT_FOUND) {
                        env.log.warn(`You have opted into yarn, but ${chalk_1.default.green('yarn')} was not found in your PATH.`);
                    }
                    else {
                        env.log.debug(() => `Error running yarn: ${e}`);
                    }
                    installer = 'npm';
                }
            }
        }
        else {
            installer = 'npm';
        }
        const installerArgs = [];
        if (installer === 'npm') {
            vocab = { install: 'i', bareInstall: 'i', uninstall: 'uninstall', dedupe: 'dedupe', rebuild: 'rebuild', global: '-g', save: '--save', saveDev: '-D', saveExact: '-E', nonInteractive: '' };
        }
        else if (installer === 'yarn') {
            vocab = { install: 'add', bareInstall: 'install', uninstall: 'remove', dedupe: '', rebuild: 'install', global: '', save: '', saveDev: '--dev', saveExact: '--exact', nonInteractive: '--non-interactive' };
            if (options.global) {
                installerArgs.push('global');
            }
        }
        else {
            throw new Error(`unknown installer: ${installer}`);
        }
        if (command === 'install') {
            if (options.pkg) {
                installerArgs.push(vocab.install);
            }
            else {
                installerArgs.push(vocab.bareInstall);
            }
        }
        else if (command === 'uninstall') {
            installerArgs.push(vocab.uninstall);
        }
        else if (command === 'dedupe') {
            if (vocab.dedupe) {
                installerArgs.push(vocab.dedupe);
            }
            else {
                return [];
            }
        }
        else if (command === 'rebuild') {
            installerArgs.push(vocab.rebuild);
        }
        else {
            installerArgs.push(command);
        }
        if (options.global && vocab.global) {
            installerArgs.push(vocab.global);
        }
        if (options.save && vocab.save) {
            installerArgs.push(vocab.save);
        }
        if (options.saveDev && vocab.saveDev) {
            installerArgs.push(vocab.saveDev);
        }
        if (options.saveExact && vocab.saveExact) {
            installerArgs.push(vocab.saveExact);
        }
        if (vocab.nonInteractive) {
            installerArgs.push(vocab.nonInteractive);
        }
        if (options.pkg) {
            if (options.link) {
                options.pkg = options.pkg.replace(/(.+)@.+/, '$1'); // Removes any dist tags in the pkg name, which link/unlink hate
            }
            installerArgs.push(options.pkg);
        }
        if (installer === 'yarn') {
            if (options.command === 'rebuild') {
                installerArgs.push('--force');
            }
        }
        return [installer, ...installerArgs];
    });
}
exports.pkgManagerArgs = pkgManagerArgs;
function pkgLatestVersion(env, pkg, distTag = 'latest') {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = yield env.config.load();
        const shellOptions = { fatalOnError: false, showCommand: false };
        try {
            if (config.yarn) {
                const cmdResult = yield env.shell.run('yarn', ['info', pkg, `dist-tags.${distTag}`, '--json'], shellOptions);
                return JSON.parse(cmdResult).data;
            }
            else {
                const cmdResult = yield env.shell.run('npm', ['view', pkg, `dist-tags.${distTag}`, '--json'], shellOptions);
                if (cmdResult) {
                    return JSON.parse(cmdResult);
                }
            }
        }
        catch (e) {
            if (e.fatal || !guards_1.isExitCodeException(e)) {
                throw e;
            }
        }
    });
}
exports.pkgLatestVersion = pkgLatestVersion;
