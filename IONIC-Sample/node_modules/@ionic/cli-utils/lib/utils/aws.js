"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_1 = require("../http");
function s3SignedUpload(config, presignedPostParams, zip, { progress }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { req } = yield http_1.createRequest(config, 'post', presignedPostParams.url);
        return new Promise((resolve, reject) => {
            zip.on('error', (err) => {
                reject(err);
            });
            let bufs = [];
            zip.on('data', (buf) => {
                bufs.push(buf);
            });
            zip.on('end', () => {
                req
                    .buffer()
                    .field(presignedPostParams.fields)
                    .field('file', Buffer.concat(bufs))
                    .on('progress', (event) => {
                    if (progress) {
                        progress(event.loaded, event.total);
                    }
                })
                    .end((err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    if (res.status !== 204) {
                        // TODO: log body for debug purposes?
                        return reject(new Error(`Unexpected status code from AWS: ${res.status}`));
                    }
                    resolve();
                });
            });
        });
    });
}
exports.s3SignedUpload = s3SignedUpload;
