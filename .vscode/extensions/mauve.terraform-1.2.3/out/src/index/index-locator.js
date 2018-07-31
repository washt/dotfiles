"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const _1 = require(".");
const vscode_adapter_1 = require("./vscode-adapter");
class IndexLocator {
    constructor(ctx) {
        this.noFolderIndex = new _1.Index(null);
        this.indices = new Map();
        this.changeEvent = new vscode.EventEmitter();
        ctx.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders((e) => this.onChangeWorkspaceFolders(e)));
        if (vscode.workspace.workspaceFolders) {
            vscode.workspace.workspaceFolders.forEach((folder) => {
                let index = new _1.Index(folder);
                index.onDidChange(() => this.changeEvent.fire());
                this.indices.set(folder, index);
            });
        }
    }
    get onChanged() {
        return this.changeEvent.event;
    }
    getIndexForUri(uri) {
        const folder = vscode.workspace.getWorkspaceFolder(uri);
        if (!folder) {
            return this.noFolderIndex;
        }
        return this.getIndexForWorkspaceFolder(folder);
    }
    getIndexForSection(section) {
        return this.getIndexForUri(vscode_adapter_1.to_vscode_Uri(section.location.uri));
    }
    getIndexForReference(reference) {
        return this.getIndexForUri(vscode_adapter_1.to_vscode_Uri(reference.location.uri));
    }
    getIndexForWorkspaceFolder(folder) {
        if (!folder) {
            return this.noFolderIndex;
        }
        if (!this.indices.has(folder)) {
            this.indices.set(folder, new _1.Index(folder));
        }
        return this.indices.get(folder);
    }
    getIndexForDoc(doc) {
        return this.getIndexForUri(doc.uri);
    }
    *allIndices(includeNoFolderIndex) {
        if (includeNoFolderIndex)
            yield this.noFolderIndex;
        for (let index of this.indices.values())
            yield index;
    }
    onChangeWorkspaceFolders(event) {
        event.added.filter((folder) => this.indices.has(folder)).forEach((folder) => this.indices.set(folder, new _1.Index(folder)));
        event.removed.forEach((folder) => this.indices.delete(folder));
    }
}
exports.IndexLocator = IndexLocator;

//# sourceMappingURL=index-locator.js.map
