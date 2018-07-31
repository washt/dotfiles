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
const vscode = require("vscode");
const completion_provider_1 = require("./autocompletion/completion-provider");
const codelense_1 = require("./codelense");
const configuration_1 = require("./configuration");
const definition_1 = require("./definition");
const documentlink_1 = require("./documentlink");
const format_1 = require("./format");
const graph_1 = require("./graph");
const hover_1 = require("./hover");
const index_locator_1 = require("./index/index-locator");
const providers_1 = require("./index/providers");
const vscode_adapter_1 = require("./index/vscode-adapter");
const watcher_1 = require("./index/watcher");
const lint_1 = require("./lint");
const live_1 = require("./live");
const rename_1 = require("./rename");
const telemetry = require("./telemetry");
const validate_1 = require("./validate");
exports.ErrorDiagnosticCollection = vscode.languages.createDiagnosticCollection("terraform-error");
exports.outputChannel = vscode.window.createOutputChannel("Terraform");
const documentSelector = [
    { language: "terraform", scheme: "file" },
    { language: "terraform", scheme: "untitled" }
];
function activate(ctx) {
    exports.indexLocator = new index_locator_1.IndexLocator(ctx);
    telemetry.activate(ctx);
    ctx.subscriptions.push(exports.ErrorDiagnosticCollection);
    let formattingProvider = new format_1.FormattingEditProvider;
    ctx.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(documentSelector, formattingProvider));
    let graphProvider = new graph_1.GraphContentProvider(ctx);
    ctx.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('terraform-graph', graphProvider));
    ctx.subscriptions.push(
    // push
    vscode.commands.registerCommand('terraform.validate', () => { validate_1.validateCommand(); }), vscode.commands.registerCommand('terraform.lint', () => { lint_1.lintCommand(); }), vscode.commands.registerCommand('terraform.showReferences', (section) => {
        codelense_1.showReferencesCommand(exports.indexLocator.getIndexForSection(section), section);
    }), vscode.commands.registerCommand('terraform.reindex', () => {
        for (let index of exports.indexLocator.allIndices(false)) {
            index.clear();
        }
        if (configuration_1.getConfiguration().indexing.enabled) {
            watcher_1.initialCrawl(exports.indexLocator);
        }
    }), vscode.commands.registerCommand('terraform.index-document', (uri) => {
        let doc = vscode.workspace.textDocuments.find((d) => d.uri.toString() === uri.toString());
        if (!doc) {
            vscode.window.showErrorMessage(`No open document with uri ${uri.toString()} found`);
            return false;
        }
        let index = exports.indexLocator.getIndexForUri(uri);
        return !!index.indexDocument(doc);
    }), vscode.commands.registerCommand('terraform.preview-graph', () => {
        graph_1.graphCommand(exports.indexLocator, graphProvider);
    }), vscode.commands.registerCommand('terraform.navigate-to-section', (args) => __awaiter(this, void 0, void 0, function* () {
        let folder = vscode.workspace.workspaceFolders.find((f) => f.name === args.workspaceFolderName);
        if (!folder) {
            yield vscode.window.showErrorMessage(`Cannot find workspace folder with name ${args.workspaceFolderName}`);
            return;
        }
        let index = exports.indexLocator.getIndexForWorkspaceFolder(folder);
        let section = index.section(args.targetId);
        if (!section) {
            yield vscode.window.showErrorMessage(`No section with id ${args.targetId}`);
            return;
        }
        yield vscode.window.showTextDocument(vscode_adapter_1.to_vscode_Uri(section.location.uri), { selection: vscode_adapter_1.to_vscode_Range(section.location.range) });
    })), 
    // providers
    vscode.languages.registerCompletionItemProvider(documentSelector, new completion_provider_1.CompletionProvider(exports.indexLocator), '.', '"', '{', '(', '['), vscode.languages.registerDefinitionProvider(documentSelector, new definition_1.DefinitionProvider(exports.indexLocator)), vscode.languages.registerDocumentSymbolProvider(documentSelector, new providers_1.DocumentSymbolProvider(exports.indexLocator)), vscode.languages.registerWorkspaceSymbolProvider(new providers_1.WorkspaceSymbolProvider(exports.indexLocator)), vscode.languages.registerReferenceProvider(documentSelector, new providers_1.ReferenceProvider(exports.indexLocator)), vscode.languages.registerRenameProvider(documentSelector, new rename_1.RenameProvider(exports.indexLocator)), vscode.languages.registerHoverProvider(documentSelector, new hover_1.HoverProvider(exports.indexLocator)), vscode.languages.registerDocumentLinkProvider(documentSelector, new documentlink_1.DocumentLinkProvider(exports.indexLocator)));
    if (configuration_1.getConfiguration().codelens.enabled) {
        ctx.subscriptions.push(vscode.languages.registerCodeLensProvider(documentSelector, new codelense_1.CodeLensProvider(exports.indexLocator)));
    }
    // operations which should only work in a local context (as opposed to live-share)
    if (vscode.workspace.rootPath) {
        // we need to manually handle save events otherwise format on autosave does not work
        ctx.subscriptions.push(vscode.workspace.onDidSaveTextDocument((doc) => formattingProvider.onSave(doc)));
        ctx.subscriptions.push(vscode.workspace.onDidChangeTextDocument((e) => live_1.liveIndex(exports.indexLocator, e)));
        // start to build the index
        if (configuration_1.getConfiguration().indexing.enabled) {
            ctx.subscriptions.push(watcher_1.createWorkspaceWatcher(exports.indexLocator));
            watcher_1.initialCrawl(exports.indexLocator);
        }
    }
    telemetry.Reporter.trackEvent('activated');
}
exports.activate = activate;
function deactivate() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield telemetry.deactivate();
    });
}
exports.deactivate = deactivate;

//# sourceMappingURL=extension.js.map
