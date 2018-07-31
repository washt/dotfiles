'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const wasm_parser_1 = require("@webassemblyjs/wasm-parser");
const wast_printer_1 = require("@webassemblyjs/wast-printer");
const scheme = 'WebAssembly';
/**
 * This class helps to open WebAssembly binary files.
 */
class WebAssemblyContentProvider {
    provideTextDocumentContent(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield readFile(uri);
            if (!buffer) {
                return;
            }
            return wast_printer_1.print(wasm_parser_1.decode(buffer));
        });
    }
}
exports.default = WebAssemblyContentProvider;
/**
 * @param uri - path to the file.
 */
function getPhysicalPath(uri) {
    if (uri.scheme === scheme) {
        return uri.with({ scheme: 'file' }).fsPath;
    }
    return uri.fsPath;
}
function readFile(uri) {
    if (uri.scheme !== scheme) {
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
//# sourceMappingURL=contentProvider.js.map