"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuidv4 = require("uuid/v4");
function generateUUID() {
    return uuidv4().toString();
}
exports.generateUUID = generateUUID;
