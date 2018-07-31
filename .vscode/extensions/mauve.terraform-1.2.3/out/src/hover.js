"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const ast_1 = require("./index/ast");
const vscode_adapter_1 = require("./index/vscode-adapter");
class HoverProvider {
    constructor(indexLocator) {
        this.indexLocator = indexLocator;
    }
    provideHover(document, position, token) {
        let index = this.indexLocator.getIndexForDoc(document);
        let reference = index.queryReferences(vscode_adapter_1.from_vscode_Uri(document.uri), { position: vscode_adapter_1.from_vscode_Position(position) })[0];
        if (!reference)
            return null;
        let section = index.query("ALL_FILES", reference.getQuery())[0];
        if (!section)
            return new vscode.Hover(new vscode.MarkdownString(`Unknown target \`${reference.targetId}\``), vscode_adapter_1.to_vscode_Range(reference.location.range));
        let valuePath = reference.valuePath();
        let label = valuePath[0];
        if (section.sectionType === "variable") {
            valuePath = ["default"];
            label = valuePath[0];
        }
        else if (section.sectionType === "local") {
            valuePath = [null];
            label = section.name;
        }
        else {
            // we need an attribute to read and it cannot be a splat
            if (valuePath.length === 0 || valuePath[0] === "*") {
                return null;
            }
        }
        // for now only support single level value extraction
        let valueNode = ast_1.findValue(section.node, valuePath[0]);
        if (!valueNode)
            return new vscode.Hover(`\`${label}\` not specified`, vscode_adapter_1.to_vscode_Range(reference.location.range));
        let formattedString = "";
        // guess type (ignore type= key because it might be missing anyway)
        if (valueNode.List && valueNode.List.Items) {
            // map
            let map = ast_1.getValue(valueNode, { stripQuotes: true });
            let pairs = [...map.entries()].map((v) => v.map((i) => `\`${i}\``).join(' = ')).map((i) => ` - ${i}`);
            if (pairs.length === 0)
                formattedString = `${label}: *empty map*`;
            else
                formattedString = `${label}:\n` + pairs.join("\n");
        }
        else if (valueNode.List) {
            // list
            let list = ast_1.getValue(valueNode, { stripQuotes: true });
            if (list.length === 0)
                formattedString = `${label}: *empty list*`;
            else
                formattedString = `${label}:\n` + list.map((i, idx) => `${idx}. \`${i}\``).join("\n");
        }
        else {
            // string
            formattedString = ast_1.getStringValue(valueNode, "<failed to extract value>", { stripQuotes: true });
            formattedString = `${label}: \`${formattedString}\``;
        }
        return new vscode.Hover(new vscode.MarkdownString(formattedString), vscode_adapter_1.to_vscode_Range(reference.location.range));
    }
}
exports.HoverProvider = HoverProvider;

//# sourceMappingURL=hover.js.map
