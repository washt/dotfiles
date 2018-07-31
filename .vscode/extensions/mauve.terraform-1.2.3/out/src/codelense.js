"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const configuration_1 = require("./configuration");
const vscode_adapter_1 = require("./index/vscode-adapter");
class SectionReferenceCodeLens extends vscode.CodeLens {
    constructor(index, range, section, command) {
        super(range, command);
        this.index = index;
        this.section = section;
    }
    createCommand() {
        let references = this.index.queryReferences("ALL_FILES", { target: this.section });
        return {
            title: `${references.length} references`,
            command: 'terraform.showReferences',
            tooltip: `Show all references to ${this.section.id}`,
            arguments: [this.section]
        };
    }
}
exports.SectionReferenceCodeLens = SectionReferenceCodeLens;
class CodeLensProvider {
    constructor(indexLocator) {
        this.indexLocator = indexLocator;
        this.eventEmitter = new vscode.EventEmitter();
        this.onDidChangeCodeLenses = this.eventEmitter.event;
        this.indexLocator.onChanged(() => {
            this.eventEmitter.fire();
        });
    }
    provideCodeLenses(document, token) {
        let index = this.indexLocator.getIndexForDoc(document);
        let fileIndex = index.getOrIndexDocument(document, { exclude: configuration_1.getConfiguration().indexing.exclude });
        if (!fileIndex)
            return [];
        return fileIndex.sections.filter((s) => s.sectionType !== "provider").map((s) => {
            let firstLineOfSection = document.lineAt(s.location.range.start.line).range;
            return new SectionReferenceCodeLens(index, firstLineOfSection, s);
        });
    }
    resolveCodeLens(codeLens, token) {
        let sectionReferenceCodeLens = codeLens;
        sectionReferenceCodeLens.command = sectionReferenceCodeLens.createCommand();
        return sectionReferenceCodeLens;
    }
}
exports.CodeLensProvider = CodeLensProvider;
class ReferenceQuickPick {
    constructor(reference) {
        this.reference = reference;
        if (reference.section) {
            this.label = reference.section.id();
            this.description = reference.section.sectionType;
        }
        else {
            // tfvars
            this.label = "(assignment)";
            this.description = vscode.Uri.parse(reference.location.uri.toString()).path;
        }
    }
    goto() {
        vscode.window.showTextDocument(vscode.Uri.parse(this.reference.location.uri.toString()), {
            preserveFocus: true,
            preview: true,
            selection: vscode_adapter_1.to_vscode_Range(this.reference.location.range)
        });
    }
}
exports.ReferenceQuickPick = ReferenceQuickPick;
function showReferencesCommand(index, section) {
    let picks = index.queryReferences("ALL_FILES", { target: section }).map((r) => new ReferenceQuickPick(r));
    vscode.window.showQuickPick(picks, {
        onDidSelectItem: (r) => r.goto()
    });
}
exports.showReferencesCommand = showReferencesCommand;

//# sourceMappingURL=codelense.js.map
