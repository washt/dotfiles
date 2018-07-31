"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const telemetry_1 = require("../telemetry");
const uri_1 = require("./uri");
const vscode_adapter_1 = require("./vscode-adapter");
class ReferenceProvider {
    constructor(indexLocator) {
        this.indexLocator = indexLocator;
    }
    provideReferences(document, position, context) {
        let section = this.indexLocator.getIndexForDoc(document).query(uri_1.Uri.parse(document.uri.toString()), { position: vscode_adapter_1.from_vscode_Position(position) })[0];
        if (!section)
            return [];
        let references = this.indexLocator.getIndexForDoc(document).queryReferences("ALL_FILES", { target: section });
        return references.map((r) => {
            const range = new vscode.Range(r.location.range.start.line, r.location.range.start.character, r.location.range.end.line, r.location.range.end.character);
            return new vscode.Location(vscode.Uri.parse(r.location.uri.toString()), range);
        });
    }
}
exports.ReferenceProvider = ReferenceProvider;
function getSymbolInfo(s) {
    const location = new vscode.Location(vscode.Uri.parse(s.location.uri.toString()), new vscode.Range(s.location.range.start.line, s.location.range.start.character, s.location.range.end.line, s.location.range.end.character));
    const containerName = [s.sectionType, s.type].filter((f) => !!f).join(".");
    return new vscode.SymbolInformation(s.name, getKind(s.sectionType), containerName, location);
}
function getKind(sectionType) {
    switch (sectionType) {
        case "resource": return vscode.SymbolKind.Interface;
        case "output": return vscode.SymbolKind.Property;
        case "variable": return vscode.SymbolKind.Variable;
        case "local": return vscode.SymbolKind.Variable;
    }
    return null;
}
class DocumentSymbolProvider {
    constructor(indexLocator) {
        this.indexLocator = indexLocator;
    }
    provideDocumentSymbols(document) {
        try {
            const sections = this.indexLocator.getIndexForDoc(document).query(uri_1.Uri.parse(document.uri.toString()));
            const symbols = sections.map((s) => getSymbolInfo(s));
            telemetry_1.Reporter.trackEvent("provideDocumentSymbols", {}, { symbolCount: symbols.length });
            return symbols;
        }
        catch (err) {
            telemetry_1.Reporter.trackException("provideDocumentSymbols", err);
            throw err;
        }
    }
}
exports.DocumentSymbolProvider = DocumentSymbolProvider;
class WorkspaceSymbolProvider {
    constructor(indexLocator) {
        this.indexLocator = indexLocator;
    }
    provideWorkspaceSymbols(query) {
        try {
            let indices = [...this.indexLocator.allIndices(true)];
            const sections = Array().concat(...indices.map((i) => i.query("ALL_FILES", { id: query })));
            const symbols = sections.map((s) => getSymbolInfo(s));
            telemetry_1.Reporter.trackEvent("provideWorkspaceSymbols", {}, { symbolCount: symbols.length });
            return symbols;
        }
        catch (err) {
            telemetry_1.Reporter.trackException("provideWorkspaceSymbols", err);
            throw err;
        }
    }
}
exports.WorkspaceSymbolProvider = WorkspaceSymbolProvider;

//# sourceMappingURL=providers.js.map
