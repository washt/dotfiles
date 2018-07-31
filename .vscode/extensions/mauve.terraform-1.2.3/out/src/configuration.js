"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function getConfiguration() {
    let raw = vscode.workspace.getConfiguration("terraform");
    // needed for conversion
    let convertible = {
        formatOnSave: raw.formatOnSave,
        formatVarsOnSave: raw.formatVarsOnSave,
        path: raw.path,
        templateDirectory: raw.templateDirectory,
        lintPath: raw.lintPath,
        lintConfig: raw.lintConfig,
        indexing: raw.indexing,
        codelens: raw.codelens,
        telemetry: raw.telemetry
    };
    return convertible;
}
exports.getConfiguration = getConfiguration;

//# sourceMappingURL=configuration.js.map
