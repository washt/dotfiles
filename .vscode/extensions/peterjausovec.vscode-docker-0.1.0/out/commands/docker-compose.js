"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const dockerExtension_1 = require("../dockerExtension");
const extensionVariables_1 = require("../extensionVariables");
const telemetry_1 = require("../telemetry/telemetry");
const create_terminal_1 = require("./utils/create-terminal");
const teleCmdId = 'vscode-docker.compose.'; // we append up or down when reporting telemetry
function getDockerComposeFileUris(folder) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield vscode.workspace.findFiles(new vscode.RelativePattern(folder, dockerExtension_1.COMPOSE_FILE_GLOB_PATTERN), null, 9999, null);
    });
}
function createItem(folder, uri) {
    const filePath = folder ? path.join('.', uri.fsPath.substr(folder.uri.fsPath.length)) : uri.fsPath;
    return {
        description: null,
        file: filePath,
        label: filePath,
        path: path.dirname(filePath)
    };
}
function computeItems(folder, uris) {
    const items = [];
    // tslint:disable-next-line:prefer-for-of // Grandfathered in
    for (let i = 0; i < uris.length; i++) {
        items.push(createItem(folder, uris[i]));
    }
    return items;
}
function compose(commands, message, dockerComposeFileUri, selectedComposeFileUris) {
    return __awaiter(this, void 0, void 0, function* () {
        let folder;
        if (!vscode.workspace.workspaceFolders) {
            vscode.window.showErrorMessage('Docker compose can only run if VS Code is opened on a folder.');
            return;
        }
        if (vscode.workspace.workspaceFolders.length === 1) {
            folder = vscode.workspace.workspaceFolders[0];
        }
        else {
            folder = yield vscode.window.showWorkspaceFolderPick();
        }
        if (!folder) {
            return;
        }
        let commandParameterFileUris;
        if (selectedComposeFileUris && selectedComposeFileUris.length) {
            commandParameterFileUris = selectedComposeFileUris;
        }
        else if (dockerComposeFileUri) {
            commandParameterFileUris = [dockerComposeFileUri];
        }
        else {
            commandParameterFileUris = [];
        }
        let selectedItems = commandParameterFileUris.map(uri => createItem(folder, uri));
        if (!selectedItems.length) {
            // prompt for compose file
            const uris = yield getDockerComposeFileUris(folder);
            if (!uris || uris.length === 0) {
                vscode.window.showInformationMessage('Couldn\'t find any docker-compose files in your workspace.');
                return;
            }
            const items = computeItems(folder, uris);
            selectedItems = [yield extensionVariables_1.ext.ui.showQuickPick(items, { placeHolder: `Choose Docker Compose file ${message}` })];
        }
        const terminal = create_terminal_1.createTerminal('Docker Compose');
        const configOptions = vscode.workspace.getConfiguration('docker');
        const build = configOptions.get('dockerComposeBuild', true) ? '--build' : '';
        const detached = configOptions.get('dockerComposeDetached', true) ? '-d' : '';
        terminal.sendText(`cd "${folder.uri.fsPath}"`);
        for (let command of commands) {
            selectedItems.forEach((item) => {
                terminal.sendText(command.toLowerCase() === 'up' ? `docker-compose -f ${item.file} ${command} ${detached} ${build}` : `docker-compose -f ${item.file} ${command}`);
            });
            terminal.show();
            if (telemetry_1.reporter) {
                /* __GDPR__
                   "command" : {
                      "command" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                   }
                 */
                telemetry_1.reporter.sendTelemetryEvent('command', {
                    command: teleCmdId + command
                });
            }
        }
    });
}
function composeUp(dockerComposeFileUri, selectedComposeFileUris) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield compose(['up'], 'to bring up', dockerComposeFileUri, selectedComposeFileUris);
    });
}
exports.composeUp = composeUp;
function composeDown(dockerComposeFileUri, selectedComposeFileUris) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield compose(['down'], 'to take down', dockerComposeFileUri, selectedComposeFileUris);
    });
}
exports.composeDown = composeDown;
function composeRestart(dockerComposeFileUri, selectedComposeFileUris) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield compose(['down', 'up'], 'to restart', dockerComposeFileUri, selectedComposeFileUris);
    });
}
exports.composeRestart = composeRestart;
//# sourceMappingURL=docker-compose.js.map