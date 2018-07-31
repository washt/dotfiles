"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./vs/vscode.proposed.d.ts" />
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const rails_helper_1 = require("./rails_helper");
const railsDeclaration_1 = require("./railsDeclaration");
const rails_completion_1 = require("./rails_completion");
const viewRef_1 = require("./viewRef");
const lineByLine = require("n-readlines");
const view_doc_1 = require("./view_doc");
const RAILS_MODE = { language: "ruby", scheme: "file" };
const VIEW_MODE = {
    pattern: "**/views/**",
    scheme: "file"
};
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function railsNavigation() {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    //vscode.window.showInformationMessage('Hello World!');
    if (!vscode.window.activeTextEditor) {
        return;
    }
    var relativeFileName = vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.fileName);
    var line = vscode.window.activeTextEditor.document
        .lineAt(vscode.window.activeTextEditor.selection.active.line)
        .text.trim();
    var rh = new rails_helper_1.RailsHelper(relativeFileName, line);
    rh.showFileList();
}
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand("Rails:Navigation", railsNavigation));
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(RAILS_MODE, new railsDeclaration_1.RailsDefinitionProvider()));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ scheme: "file" }, new rails_completion_1.RailsCompletionItemProvider(), ".", '"', ":", "'"));
    // since VIEW_MODE use glob pattern ,must make sure work on a rails project
    function registerViewDefinitionProvider() {
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(VIEW_MODE, new viewRef_1.ViewDefinitionProvider()));
    }
    function registerViewDocCommand() {
        context.subscriptions.push(vscode.commands.registerCommand("Rails:Document", view_doc_1.viewDoc, context));
    }
    vscode.workspace.findFiles("Gemfile").then((uris) => {
        if (uris.length == 1) {
            let fileAbsPath = uris[0].fsPath;
            var liner = new lineByLine(fileAbsPath), line;
            while ((line = liner.next())) {
                let lineText = line.toString("utf8").trim();
                if (/gem\s+['"]rails['"]/.test(lineText)) {
                    registerViewDefinitionProvider();
                    registerViewDocCommand();
                    // context.logger.debug("Project Gemfile contains rails"); //cause Proposed API is only available when running out of dev or
                    console.debug("Project Gemfile contains rails");
                    break;
                }
            }
        }
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map