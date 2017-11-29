"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const guards_1 = require("../guards");
const http_1 = require("./http");
const aws_1 = require("./utils/aws");
class DeployClient {
    constructor(appUserToken, client) {
        this.appUserToken = appUserToken;
        this.client = client;
    }
    getChannel(uuidOrTag) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { req } = yield this.client.make('GET', `/deploy/channels/${uuidOrTag}`);
            req.set('Authorization', `Bearer ${this.appUserToken}`).send();
            const res = yield this.client.do(req);
            if (!guards_1.isDeployChannelResponse(res)) {
                throw http_1.createFatalAPIFormat(req, res);
            }
            return res.data;
        });
    }
    deploy(snapshot, channel) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { req } = yield this.client.make('POST', '/deploy/deploys');
            req.set('Authorization', `Bearer ${this.appUserToken}`).send({ snapshot, channel });
            const res = yield this.client.do(req);
            if (!guards_1.isDeployResponse(res)) {
                throw http_1.createFatalAPIFormat(req, res);
            }
            return res.data;
        });
    }
    getSnapshot(uuid, { fields = [] }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (fields.indexOf('url') === -1) {
                fields.push('url');
            }
            const { req } = yield this.client.make('GET', `/deploy/snapshots/${uuid}`);
            req.set('Authorization', `Bearer ${this.appUserToken}`).query({ fields }).send();
            const res = yield this.client.do(req);
            if (!guards_1.isDeploySnapshotResponse(res)) {
                throw http_1.createFatalAPIFormat(req, res);
            }
            return res.data;
        });
    }
    requestSnapshotUpload(options = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            options.legacy_duplication = '1';
            const { req } = yield this.client.make('POST', '/deploy/snapshots');
            req.set('Authorization', `Bearer ${this.appUserToken}`).send(options);
            const res = yield this.client.do(req);
            if (!guards_1.isDeploySnapshotRequestResponse(res)) {
                throw http_1.createFatalAPIFormat(req, res);
            }
            // TODO: Remove updateMetaDataReq when POST -> deploy/snapshots accepts user_metadata
            if (options.user_metadata) {
                const { req } = yield this.client.make('PATCH', `/deploy/snapshots/${res.data.uuid}`);
                req.set('Authorization', `Bearer ${this.appUserToken}`).send({ 'user_metadata': options.user_metadata });
                yield this.client.do(req);
            }
            return res.data;
        });
    }
    uploadSnapshot(snapshot, zip, progress) {
        return aws_1.s3SignedUpload(this.client.config, snapshot.presigned_post, zip, { progress });
    }
}
exports.DeployClient = DeployClient;
