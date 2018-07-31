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
const vscode = require("vscode");
const webassembly_content_provider_1 = require("./webassembly-content-provider");
const utils_1 = require("./utils");
const wasmScheme = 'wasm';
function activate(context) {
    const provider = new webassembly_content_provider_1.default();
    const registration = vscode.workspace.registerTextDocumentContentProvider('wasm-preview', provider);
    const openEvent = vscode.workspace.onDidOpenTextDocument((document) => {
        showDocument(document);
    });
    const previewCommand = vscode.commands.registerCommand('wasm.wasm2wat', (uri) => {
        showPreview(uri);
    });
    const save2watCommand = vscode.commands.registerCommand('wasm.save2wat', (uri) => {
        const watPath = uri.path.replace(/\.wasm$/, '.wat');
        const saveDialogOptions = {
            filters: {
                'WebAssembly Text': ['wat', 'wast'],
                'WebAssembly Binary': ['wasm']
            },
            defaultUri: uri.with({ scheme: 'file', path: watPath })
        };
        const from = uri.with({ scheme: 'file' });
        vscode.window.showSaveDialog(saveDialogOptions)
            .then(maybeSaveWat(from), vscode.window.showErrorMessage);
    });
    const save2wasmCommand = vscode.commands.registerCommand('wasm.save2wasm', (uri) => {
        const wasmPath = uri.path.replace(/\.wat$/, '.wasm');
        const saveDialogOptions = {
            filters: {
                'WebAssembly Binary': ['wasm'],
                'WebAssembly Text': ['wat', 'wast']
            },
            defaultUri: uri.with({ scheme: 'file', path: wasmPath })
        };
        const from = uri.with({ scheme: 'file' });
        vscode.window.showSaveDialog(saveDialogOptions)
            .then(maybeSaveWasm(from), vscode.window.showErrorMessage);
    });
    if (vscode.window.activeTextEditor) {
        showDocument(vscode.window.activeTextEditor.document);
    }
    context.subscriptions.push(registration, openEvent, previewCommand, save2watCommand, save2wasmCommand);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
function showDocument(document) {
    if (document.languageId === "wasm" && document.uri.scheme !== "wasm-preview") {
        vscode.commands.executeCommand("workbench.action.closeActiveEditor").then(() => {
            showPreview(document.uri);
        }, vscode.window.showErrorMessage);
    }
}
function showPreview(uri) {
    if (uri.scheme === "wasm-preview") {
        return;
    }
    vscode.commands.executeCommand('vscode.open', uri.with({ scheme: 'wasm-preview' }))
        .then(null, vscode.window.showErrorMessage);
}
function maybeSaveWat(from) {
    return (to) => {
        if (!to) {
            return;
        }
        return saveWat(from, to);
    };
}
function saveWat(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        const wasmContent = yield utils_1.readFile(from);
        const watContent = utils_1.wasm2wat(wasmContent);
        yield utils_1.writeFile(to, watContent);
    });
}
function maybeSaveWasm(from) {
    return (to) => {
        if (!to) {
            return;
        }
        return saveWasm(from, to);
    };
}
function saveWasm(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        const watContent = yield utils_1.readFile(from);
        const wasmContent = utils_1.wat2wasm(watContent);
        yield utils_1.writeFile(to, wasmContent);
    });
}
//# sourceMappingURL=extension.js.map