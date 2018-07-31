"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_adapter_1 = require("./index/vscode-adapter");
class DefinitionProvider {
    constructor(indexLocator) {
        this.indexLocator = indexLocator;
    }
    provideDefinition(document, position) {
        let reference = this.indexLocator.getIndexForDoc(document).queryReferences(vscode_adapter_1.from_vscode_Uri(document.uri), { position: vscode_adapter_1.from_vscode_Position(position) })[0];
        if (!reference)
            return null;
        let section = this.indexLocator.getIndexForDoc(document).query("ALL_FILES", reference.getQuery())[0];
        if (!section)
            return null;
        return vscode_adapter_1.to_vscode_Location(section.location);
    }
}
exports.DefinitionProvider = DefinitionProvider;

//# sourceMappingURL=definition.js.map
