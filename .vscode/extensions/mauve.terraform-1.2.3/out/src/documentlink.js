"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const model_1 = require("./autocompletion/model");
const configuration_1 = require("./configuration");
const vscode_adapter_1 = require("./index/vscode-adapter");
class DocumentLinkProvider {
    constructor(indexLocator) {
        this.indexLocator = indexLocator;
    }
    provideDocumentLinks(document, token) {
        let index = this.indexLocator.getIndexForDoc(document).getOrIndexDocument(document, { exclude: configuration_1.getConfiguration().indexing.exclude });
        if (!index)
            return [];
        return index.sections.map((s) => {
            if (!s.type)
                return null;
            let doc = model_1.findResourceFormat(s.sectionType, s.type);
            if (!doc)
                return null;
            return new vscode.DocumentLink(vscode_adapter_1.to_vscode_Range(s.typeLocation.range), vscode.Uri.parse(doc.url));
        }).filter((d) => d != null);
    }
}
exports.DocumentLinkProvider = DocumentLinkProvider;
;

//# sourceMappingURL=documentlink.js.map
