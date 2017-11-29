"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const backends_1 = require("./backends");
const uuid_1 = require("./utils/uuid");
const GA_CODE = 'UA-44023830-30';
let _gaTracker;
class Telemetry {
    resetToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield this.env.config.load();
            config.tokens.telemetry = uuid_1.generateUUID();
        });
    }
    sendCommand(command, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { CONTENT_TYPE_JSON, createRawRequest } = yield Promise.resolve().then(function () { return require('./http'); });
            const port = yield this.env.daemon.getPort();
            if (port) {
                const { req } = yield createRawRequest('POST', `http://localhost:${port}/events/command`);
                req
                    .set('Content-Type', CONTENT_TYPE_JSON)
                    .set('Accept', CONTENT_TYPE_JSON)
                    .send({ command, args, projectDir: this.env.project.directory });
                try {
                    yield req;
                }
                catch (e) {
                    // TODO
                }
            }
            else {
                yield sendCommand(this.env, this.env.project, command, args);
            }
        });
    }
}
exports.Telemetry = Telemetry;
function getLeek(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!_gaTracker) {
            const Leek = yield Promise.resolve().then(function () { return require('leek'); });
            const config = yield env.config.load();
            if (!config.tokens.telemetry) {
                config.tokens.telemetry = uuid_1.generateUUID();
            }
            _gaTracker = new Leek({
                name: config.tokens.telemetry,
                trackingCode: GA_CODE,
                globalName: 'ionic',
                version: env.plugins.ionic.meta.version,
                silent: config.telemetry !== true,
            });
        }
        return _gaTracker;
    });
}
function sendCommand(env, project, command, args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const messageList = [];
        const name = 'command execution';
        const prettyArgs = args.map(a => a.includes(' ') ? `"${a}"` : a);
        const message = messageList.concat([command], prettyArgs).join(' ');
        yield Promise.all([
            (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const leek = yield getLeek(env);
                try {
                    yield leek.track({ name, message });
                }
                catch (e) {
                    // TODO
                }
            }))(),
            (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const { Client } = yield Promise.resolve().then(function () { return require('./http'); });
                const config = yield env.config.load();
                const client = new Client(env.config);
                if (config.backend === backends_1.BACKEND_LEGACY) {
                    return;
                }
                let appId;
                const projectFile = project.directory ? yield project.load() : undefined;
                if (projectFile) {
                    appId = projectFile.app_id;
                }
                const now = new Date().toISOString();
                const isLoggedIn = yield env.session.isLoggedIn();
                const { req } = yield client.make('POST', 'https://api.ionicjs.com/events/metrics'); // TODO: full URL is temporary
                const metric = {
                    'name': 'cli_command_metrics',
                    'timestamp': now,
                    'session_id': config.tokens.telemetry,
                    'source': 'cli',
                    'value': {
                        'command': command,
                        'arguments': prettyArgs.join(' '),
                        'version': env.plugins.ionic.meta.version,
                        'node_version': process.version,
                        'app_id': appId,
                        'user_id': config.backend === backends_1.BACKEND_LEGACY ? config.user.id : undefined,
                        'backend': config.backend,
                    },
                };
                // We don't want to slow commands down terribly for people who opt-out of the daemon.
                if (config.daemon.updates) {
                    const v = [];
                    const info = yield env.hooks.fire('info', { env, project });
                    const flattenedInfo = info.reduce((acc, currentValue) => acc.concat(currentValue), v);
                    if (isLoggedIn && config.backend === backends_1.BACKEND_PRO) {
                        const token = yield env.session.getUserToken();
                        req.set('Authorization', `Bearer ${token}`);
                    }
                    const frameworkInfo = flattenedInfo.find(item => item.key === 'Ionic Framework');
                    const npmInfo = flattenedInfo.find(item => item.key === 'npm');
                    const osInfo = flattenedInfo.find(item => item.key === 'OS');
                    const xcodeInfo = flattenedInfo.find(item => item.key === 'Xcode');
                    const androidSdkInfo = flattenedInfo.find(item => item.key === 'Android SDK Tools');
                    const cordovaInfo = flattenedInfo.find(item => item.key === 'Cordova CLI');
                    const cordovaPlatformsInfo = flattenedInfo.find(item => item.key === 'Cordova Platforms');
                    const appScriptsInfo = flattenedInfo.find(item => item.key === '@ionic/app-scripts');
                    if (frameworkInfo) {
                        metric['value']['framework'] = frameworkInfo.value;
                    }
                    if (npmInfo) {
                        metric['value']['npm_version'] = npmInfo.value;
                    }
                    if (osInfo) {
                        metric['value']['os'] = osInfo.value;
                    }
                    if (xcodeInfo) {
                        metric['value']['xcode_version'] = xcodeInfo.value;
                    }
                    if (androidSdkInfo) {
                        metric['value']['android_sdk_version'] = androidSdkInfo.value;
                    }
                    if (cordovaInfo) {
                        metric['value']['cordova_version'] = cordovaInfo.value;
                    }
                    if (cordovaPlatformsInfo) {
                        metric['value']['cordova_platforms'] = cordovaPlatformsInfo.value;
                    }
                    if (appScriptsInfo) {
                        metric['value']['app_scripts_version'] = appScriptsInfo.value;
                    }
                }
                req.send({
                    'metrics': [metric],
                    'sent_at': now,
                });
                try {
                    yield client.do(req);
                }
                catch (e) {
                    // TODO
                }
            }))(),
        ]);
    });
}
exports.sendCommand = sendCommand;
