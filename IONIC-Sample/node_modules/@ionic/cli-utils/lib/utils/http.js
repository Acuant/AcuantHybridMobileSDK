"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getGlobalProxy() {
    const envvars = ['IONIC_HTTP_PROXY', 'HTTPS_PROXY', 'HTTP_PROXY', 'PROXY', 'https_proxy', 'http_proxy', 'proxy'];
    for (let envvar of envvars) {
        if (process.env[envvar]) {
            return [process.env[envvar], envvar];
        }
    }
    return [undefined, undefined];
}
exports.getGlobalProxy = getGlobalProxy;
