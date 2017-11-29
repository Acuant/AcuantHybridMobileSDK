"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isPackageJson(o) {
    const obj = o;
    return obj && typeof obj.name === 'string';
}
exports.isPackageJson = isPackageJson;
function isBowerJson(o) {
    const obj = o;
    return obj && typeof obj.name === 'string';
}
exports.isBowerJson = isBowerJson;
function isValidationErrorArray(e) {
    const err = e;
    return err && err[0]
        && typeof err[0].message === 'string'
        && typeof err[0].inputName === 'string';
}
exports.isValidationErrorArray = isValidationErrorArray;
