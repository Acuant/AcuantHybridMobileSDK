"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisify = function (func) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            func(...args, (err, response) => {
                if (err) {
                    return reject(err);
                }
                resolve(response);
            });
        });
    };
};
