"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const vscode = require("vscode");
function isTerraformDocument(document) {
    return document.languageId === "terraform";
}
exports.isTerraformDocument = isTerraformDocument;
function read(path) {
    return new Promise((resolve, reject) => {
        fs_1.readFile(path, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data.toString('utf8'));
            }
        });
    });
}
exports.read = read;
function readBuffer(path) {
    return new Promise((resolve, reject) => {
        fs_1.readFile(path, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}
exports.readBuffer = readBuffer;
function uriFromRelativePath(path, folder) {
    if (!folder) {
        folder = vscode.workspace.workspaceFolders[0];
    }
    return folder.uri.with({
        path: [folder.uri.path, path].join('/')
    });
}
exports.uriFromRelativePath = uriFromRelativePath;
function backwardsSearch(haystack, matcher) {
    if (haystack.length === 0)
        return -1;
    for (let i = haystack.length - 1; i >= 0; i--) {
        if (matcher(haystack[i])) {
            return i;
        }
    }
    return -1;
}
exports.backwardsSearch = backwardsSearch;

//# sourceMappingURL=helpers.js.map
