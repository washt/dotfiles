"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const extension_1 = require("./extension");
const helpers_1 = require("./helpers");
const runner_1 = require("./runner");
class FormattingEditProvider {
    constructor() {
        this._ignoreNextSave = new WeakSet();
    }
    onSave(document) {
        if (!helpers_1.isTerraformDocument(document) || this._ignoreNextSave.has(document)) {
            return;
        }
        let textEditor = vscode.window.activeTextEditor;
        if (this.isFormatEnabled(document, true) && textEditor.document === document) {
            const fullRange = doc => doc.validateRange(new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE));
            const range = fullRange(document);
            extension_1.outputChannel.appendLine(`terraform.format [on-save]: running 'terraform fmt' on '${document.fileName}'`);
            return runner_1.runTerraform(process.cwd(), ["fmt", "-"], {
                input: document.getText(),
            }).then((formattedText) => {
                textEditor.edit((editor) => {
                    editor.replace(range, formattedText);
                });
            }).then((applied) => {
                this._ignoreNextSave.add(document);
                return document.save();
            }).then(() => {
                extension_1.outputChannel.appendLine("terraform.format [on-save]: Successful.");
                this._ignoreNextSave.delete(document);
            }).catch((e) => {
                extension_1.outputChannel.appendLine(`terraform.format [on-save]: Failed: '${e}'`);
                vscode.window.showWarningMessage(e);
            });
        }
    }
    isFormatEnabled(document, onSave) {
        let config = vscode.workspace.getConfiguration('terraform.format');
        if (config.get('enable') !== true) {
            return false;
        }
        if (!onSave) {
            return true;
        }
        if (config.get('formatOnSave') !== true) {
            return false;
        }
        return config.get('ignoreExtensionsOnSave').map((ext) => {
            return document.fileName.endsWith(ext);
        }).indexOf(true) === -1;
    }
    provideDocumentFormattingEdits(document, options, token) {
        if (!this.isFormatEnabled(document, false)) {
            return [];
        }
        const fullRange = doc => doc.validateRange(new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE));
        const range = fullRange(document);
        extension_1.outputChannel.appendLine(`terraform.format [provider]: running 'terraform fmt' on '${document.fileName}'`);
        return runner_1.runTerraform(process.cwd(), ["fmt", "-"], {
            input: document.getText(),
        }).then((formattedText) => {
            extension_1.outputChannel.appendLine("terraform.format [provider]: Successful.");
            return [new vscode.TextEdit(range, formattedText)];
        }).catch((e) => {
            extension_1.outputChannel.appendLine(`terraform.format [provider]: Failed: '${e}'`);
            vscode.window.showWarningMessage(e);
            return [];
        });
    }
}
exports.FormattingEditProvider = FormattingEditProvider;

//# sourceMappingURL=format.js.map
