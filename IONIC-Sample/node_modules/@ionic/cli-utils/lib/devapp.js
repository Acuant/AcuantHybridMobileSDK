"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discover_1 = require("@ionic/discover");
var discover_2 = require("@ionic/discover");
exports.computeBroadcastAddress = discover_2.computeBroadcastAddress;
class Publisher extends discover_1.Publisher {
    getInterfaces() {
        return [];
    }
}
exports.Publisher = Publisher;
function createPublisher(env, port) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const project = yield env.project.load();
        const publisher = new Publisher('devapp', `${project.name}@${port}`, port);
        publisher.path = '/?devapp=true';
        return publisher;
    });
}
exports.createPublisher = createPublisher;
