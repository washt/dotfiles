"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function createTerminal(name) {
    let terminalOptions = {};
    terminalOptions.name = name;
    const value = vscode.workspace.getConfiguration("docker").get("host", "");
    if (value) {
        terminalOptions.env = {
            DOCKER_HOST: value
        };
    }
    return vscode.window.createTerminal(terminalOptions);
}
exports.createTerminal = createTerminal;
//# sourceMappingURL=create-terminal.js.map