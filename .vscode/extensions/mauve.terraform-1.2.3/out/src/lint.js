"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const vscode = require("vscode");
const extension_1 = require("./extension");
function typeToSeverity(type) {
    switch (type) {
        case "ERROR":
            return vscode.DiagnosticSeverity.Error;
        case "WARNING":
            return vscode.DiagnosticSeverity.Warning;
        case "NOTICE":
            return vscode.DiagnosticSeverity.Information;
    }
    return vscode.DiagnosticSeverity.Error;
}
function toDiagnostic(issue) {
    return new vscode.Diagnostic(new vscode.Range(issue.line - 1, 0, issue.line - 1, 100), issue.message, typeToSeverity(issue.type));
}
exports.LintDiagnosticsCollection = vscode.languages.createDiagnosticCollection("terraform-lint");
function lintCommand() {
    const configuration = vscode.workspace.getConfiguration("terraform");
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders === undefined) {
        vscode.window.showWarningMessage("terraform.lint can only be used when opening a folder");
        return;
    }
    workspaceFolders.forEach((workspaceFolder) => {
        if (workspaceFolder.uri.scheme !== "file") {
            // TODO: show warning?
            extension_1.outputChannel.appendLine(`terraform.lint: Ignoring workspace folder ${workspaceFolder.name} with uri ${workspaceFolder.uri.toString()}, unsupported scheme.`);
            return;
        }
        const workspaceDir = workspaceFolder.uri.fsPath;
        lint(configuration["lintPath"], configuration["lintConfig"], workspaceDir)
            .then((issues) => {
            extension_1.outputChannel.appendLine(`terraform.lint: ${issues.length} issues`);
            exports.LintDiagnosticsCollection.clear();
            // group by filename first
            let issuesByFile = new Map();
            issues
                .forEach((issue) => {
                let diagnostic = toDiagnostic(issue);
                if (issuesByFile.has(issue.file))
                    issuesByFile.get(issue.file).push(diagnostic);
                else
                    issuesByFile.set(issue.file, [diagnostic]);
            });
            // report diagnostics
            issuesByFile.forEach((diagnostics, file) => {
                extension_1.outputChannel.appendLine(`terraform.lint: ${file}: ${diagnostics.length} issues`);
                exports.LintDiagnosticsCollection.set(vscode.Uri.file(`${workspaceDir}/${file}`), diagnostics);
            });
            extension_1.outputChannel.appendLine("terraform.lint: Done");
        }).catch((error) => {
            extension_1.outputChannel.appendLine(`terraform.lint: Failed: ${error}`);
            vscode.window.showErrorMessage("Linting failed, more information in the output tab.");
        });
    });
}
exports.lintCommand = lintCommand;
function lint(execPath, lintConfig, workspaceDir) {
    return new Promise((resolve, reject) => {
        let commandLineArgs = ["--format", "json"];
        if (lintConfig !== null) {
            commandLineArgs.push("--config", lintConfig);
        }
        const child = child_process_1.execFile(execPath, commandLineArgs, {
            cwd: workspaceDir,
            encoding: 'utf8',
            maxBuffer: 1024 * 1024
        }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            else {
                try {
                    let result = JSON.parse(stdout);
                    resolve(result);
                }
                catch (parseError) {
                    reject(parseError);
                }
            }
        });
    });
}

//# sourceMappingURL=lint.js.map
