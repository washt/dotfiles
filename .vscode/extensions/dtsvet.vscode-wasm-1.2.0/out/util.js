"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
/**
 * @param uri - path to the file.
 */
function getPhysicalPath(uri) {
    if (uri.scheme === 'wasm-preview') {
        return uri.with({ scheme: 'file' }).fsPath;
    }
    return uri.fsPath;
}
exports.getPhysicalPath = getPhysicalPath;
function readFile(uri) {
    if (uri.scheme !== 'wasm-preview') {
        return;
    }
    const filepath = getPhysicalPath(uri);
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}
exports.readFile = readFile;
//# sourceMappingURL=util.js.map