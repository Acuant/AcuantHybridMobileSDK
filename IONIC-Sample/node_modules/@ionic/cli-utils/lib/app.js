"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_1 = require("./http");
const guards_1 = require("../guards");
class App {
    constructor(token, client) {
        this.token = token;
        this.client = client;
    }
    load(app_id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { req } = yield this.client.make('GET', `/apps/${app_id}`);
            req.set('Authorization', `Bearer ${this.token}`).send({});
            const res = yield this.client.do(req);
            if (!guards_1.isAppResponse(res)) {
                throw http_1.createFatalAPIFormat(req, res);
            }
            return res.data;
        });
    }
    paginate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.client.paginate(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const { req } = yield this.client.make('GET', '/apps');
                req.set('Authorization', `Bearer ${this.token}`);
                return { req };
            }), guards_1.isAppsResponse);
        });
    }
    create({ name }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { req } = yield this.client.make('POST', '/apps');
            req.set('Authorization', `Bearer ${this.token}`).send({ name });
            const res = yield this.client.do(req);
            if (!guards_1.isAppResponse(res)) {
                throw http_1.createFatalAPIFormat(req, res);
            }
            return res.data;
        });
    }
}
exports.App = App;
