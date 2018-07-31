"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const vscode = require("vscode");
const extension_1 = require("./extension");
function validateCommand() {
    const configuration = vscode.workspace.getConfiguration("terraform");
    const workspaceDir = vscode.workspace.rootPath;
    if (workspaceDir === undefined) {
        vscode.window.showWarningMessage("terraform.Validate can only be used when opening a folder");
        return;
    }
    validate(configuration["path"], configuration["templateDirectory"], workspaceDir)
        .then(() => {
        vscode.window.showInformationMessage("Validation succeeded.");
    }).catch((error) => {
        extension_1.outputChannel.appendLine("terraform.validate: Failed:");
        extension_1.outputChannel.append(error);
        extension_1.outputChannel.show(true);
        vscode.window.showErrorMessage("Validation failed, more information in the output tab.");
    });
}
exports.validateCommand = validateCommand;
function validate(execPath, directory, workspaceDir) {
    return new Promise((resolve, reject) => {
        let commandLineArgs = ["validate", "-no-color"];
        if (directory !== undefined) {
            commandLineArgs.push(directory);
        }
        const child = child_process_1.execFile(execPath, commandLineArgs, {
            cwd: workspaceDir,
            encoding: 'utf8',
            maxBuffer: 1024 * 1024
        }, (error, stdout, stderr) => {
            if (error) {
                reject(stderr);
            }
            else {
                resolve(stdout);
            }
        });
    });
}

//# sourceMappingURL=validate.js.map
