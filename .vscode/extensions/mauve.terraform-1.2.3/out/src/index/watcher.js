"use strict";
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
const configuration_1 = require("../configuration");
const extension_1 = require("../extension");
const vscode_adapter_1 = require("./vscode-adapter");
function updateDocument(index, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield vscode.workspace.openTextDocument(uri).then((doc) => {
            if (doc.isDirty || doc.languageId !== "terraform") {
                // ignore
                return;
            }
            try {
                if (!index.indexDocument(doc, { exclude: configuration_1.getConfiguration().indexing.exclude })) {
                    extension_1.outputChannel.appendLine(`terraform.crawler: Index not generated for: ${uri.toString()}`);
                }
                else {
                    extension_1.outputChannel.appendLine(`terraform.crawler: Indexed ${uri.toString()}`);
                }
            }
            catch (e) {
                extension_1.outputChannel.appendLine(`terraform.crawler: Could not index template file: ${e}`);
                let range = new vscode.Range(0, 0, 0, 300);
                let diagnostics = new vscode.Diagnostic(range, `Unhandled error parsing document: ${e}`, vscode.DiagnosticSeverity.Error);
                extension_1.ErrorDiagnosticCollection.set(uri, [diagnostics]);
            }
        });
    });
}
function update(indexLocator, uri) {
    let index = indexLocator.getIndexForUri(uri);
    if (!index) {
        extension_1.outputChannel.appendLine(`terraform.crawler: Cannot locate index for ${uri.toString()}`);
        return;
    }
    return updateDocument(index, uri);
}
function createWorkspaceWatcher(indexLocator) {
    let watcher = vscode.workspace.createFileSystemWatcher("**/*.{tf,tfvars}");
    watcher.onDidChange((uri) => { update(indexLocator, uri); });
    watcher.onDidCreate((uri) => { update(indexLocator, uri); });
    watcher.onDidDelete((uri) => {
        indexLocator.getIndexForUri(uri).delete(vscode_adapter_1.from_vscode_Uri(uri));
    });
    return watcher;
}
exports.createWorkspaceWatcher = createWorkspaceWatcher;
function initialCrawl(indexLocator) {
    extension_1.outputChannel.appendLine("terraform.crawler: Crawling workspace for terraform files...");
    return vscode.workspace.findFiles("**/*.{tf,tfvars}")
        .then((uris) => {
        return vscode.window.withProgress({
            location: vscode.ProgressLocation.Window,
            title: "Indexing terraform templates"
        }, (progress) => __awaiter(this, void 0, void 0, function* () {
            for (let uri of uris) {
                progress.report({ message: `Indexing ${uri.toString()}` });
                yield update(indexLocator, uri);
            }
            return uris;
        }));
    });
}
exports.initialCrawl = initialCrawl;

//# sourceMappingURL=watcher.js.map
