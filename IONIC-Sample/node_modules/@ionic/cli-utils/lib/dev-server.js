"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const serve_1 = require("./serve");
exports.DEV_SERVER_PREFIX = '__ionic';
function injectDevServerScript(content) {
    let contentStr = content.toString();
    const devServerScript = getDevServerScript();
    if (contentStr.indexOf(`/${exports.DEV_SERVER_PREFIX}/dev-server.js`) > -1) {
        // already added script
        return content;
    }
    let match = contentStr.match(/<\/body>(?![\s\S]*<\/body>)/i);
    if (!match) {
        match = contentStr.match(/<\/html>(?![\s\S]*<\/html>)/i);
    }
    if (match) {
        contentStr = contentStr.replace(match[0], `${devServerScript}\n${match[0]}`);
    }
    else {
        contentStr += devServerScript;
    }
    return contentStr;
}
exports.injectDevServerScript = injectDevServerScript;
function getDevServerScript() {
    return `  <!-- Ionic Dev Server: Injected Dev Server Script -->\n` +
        `  <script src="${exports.DEV_SERVER_PREFIX}/dev-server.js" async="" defer=""></script>`;
}
function createLiveReloadServer(env, { port, wwwDir }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tinylr = yield Promise.resolve().then(function () { return require('tiny-lr'); });
        const lrserver = tinylr();
        lrserver.listen(port);
        return (changedFiles) => {
            lrserver.changed({
                body: {
                    files: changedFiles.map(changedFile => ('/' + path.relative(wwwDir, changedFile)))
                }
            });
        };
    });
}
exports.createLiveReloadServer = createLiveReloadServer;
function injectLiveReloadScript(content, host, port) {
    let contentStr = content.toString();
    const liveReloadScript = getLiveReloadScript(host, port);
    if (contentStr.indexOf('/livereload.js') > -1) {
        // already added script
        return content;
    }
    let match = contentStr.match(/<\/body>(?![\s\S]*<\/body>)/i);
    if (!match) {
        match = contentStr.match(/<\/html>(?![\s\S]*<\/html>)/i);
    }
    if (match) {
        contentStr = contentStr.replace(match[0], `${liveReloadScript}\n${match[0]}`);
    }
    else {
        contentStr += liveReloadScript;
    }
    return contentStr;
}
exports.injectLiveReloadScript = injectLiveReloadScript;
function getLiveReloadScript(host, port) {
    if (host === serve_1.BIND_ALL_ADDRESS) {
        host = 'localhost';
    }
    const src = `//${host}:${port}/livereload.js?snipver=1`;
    return `  <!-- Ionic Dev Server: Injected LiveReload Script -->\n` +
        `  <script src="${src}" async="" defer=""></script>`;
}
