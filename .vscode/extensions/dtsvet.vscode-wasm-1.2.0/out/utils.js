"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const fs = require("fs");
const wabt = require("wabt");
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
    const filepath = getPhysicalPath(uri);
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, { encoding: null }, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}
exports.readFile = readFile;
function readWasm(uri) {
    if (uri.scheme !== 'wasm-preview') {
        return;
    }
    return readFile(uri);
}
exports.readWasm = readWasm;
function writeFile(uri, content) {
    const filepath = getPhysicalPath(uri);
    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, content, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
exports.writeFile = writeFile;
function wasm2wat(content) {
    let wasmModule;
    try {
        wasmModule = wabt.readWasm(content, { readDebugNames: true });
        wasmModule.generateNames();
        wasmModule.resolveNames();
        wasmModule.applyNames();
        return wasmModule.toText({ foldExprs: false, inlineExport: false });
    }
    catch (err) {
        vscode_1.window.showErrorMessage(err.message);
    }
    finally {
        if (wasmModule === undefined) {
            return;
        }
        wasmModule.destroy();
    }
}
exports.wasm2wat = wasm2wat;
function wat2wasm(content) {
    let wasmModule;
    try {
        wasmModule = wabt.parseWat('temp.wat', content);
        const binaryResult = wasmModule.toBinary({ log: false, write_debug_names: true });
        return Buffer.from(binaryResult.buffer.buffer);
    }
    catch (err) {
        vscode_1.window.showErrorMessage(err.message);
    }
    finally {
        if (wasmModule === undefined) {
            return;
        }
        wasmModule.destroy();
    }
}
exports.wat2wasm = wat2wasm;
//# sourceMappingURL=utils.js.map