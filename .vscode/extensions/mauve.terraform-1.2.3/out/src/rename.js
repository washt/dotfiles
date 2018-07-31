"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_adapter_1 = require("./index/vscode-adapter");
const telemetry_1 = require("./telemetry");
class RenameProvider {
    constructor(indexLocator) {
        this.indexLocator = indexLocator;
    }
    provideRenameEdits(document, position, newName) {
        try {
            let index = this.indexLocator.getIndexForDoc(document);
            let section = index.query(vscode_adapter_1.from_vscode_Uri(document.uri), { name_position: vscode_adapter_1.from_vscode_Position(position) })[0];
            if (!section) {
                telemetry_1.Reporter.trackEvent("provideRenameEdits", { sectionType: "$null" });
                return null;
            }
            let references = index.queryReferences("ALL_FILES", { target: section });
            if (references.length === 0) {
                telemetry_1.Reporter.trackEvent("provideRenameEdits", { sectionType: section.sectionType }, { references: 0 });
                return null;
            }
            let edit = new vscode.WorkspaceEdit;
            edit.replace(document.uri, vscode_adapter_1.to_vscode_Range(section.nameLocation.range), newName);
            const oldId = section.id();
            const newId = section.id(newName);
            references.forEach((reference) => {
                if (!reference.nameRange) {
                    // references in .tf
                    const range = vscode_adapter_1.to_vscode_Range(reference.location.range);
                    const end = range.end.with({ character: range.start.character + oldId.length });
                    edit.replace(vscode_adapter_1.to_vscode_Uri(reference.location.uri), range.with({ end: end }), newId);
                }
                else {
                    // references in .tfvars
                    edit.replace(vscode_adapter_1.to_vscode_Uri(reference.location.uri), vscode_adapter_1.to_vscode_Range(reference.nameRange), newName);
                }
            });
            telemetry_1.Reporter.trackEvent("provideRenameEdits", { sectionType: section.sectionType }, { references: references.length });
            return edit;
        }
        catch (err) {
            telemetry_1.Reporter.trackException("provideRenameEdits", err);
            throw err;
        }
    }
}
exports.RenameProvider = RenameProvider;

//# sourceMappingURL=rename.js.map
