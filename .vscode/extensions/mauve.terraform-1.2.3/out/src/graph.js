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
const extension_1 = require("./extension");
const helpers_1 = require("./helpers");
const runner_1 = require("./runner");
const template_1 = require("./template");
const Viz = require('viz.js');
const Dot = require('graphlib-dot');
exports.graphPreviewUri = vscode.Uri.parse('terraform-graph://authority/terraform-graph');
class GraphContentProvider {
    constructor(ctx) {
        this.ctx = ctx;
        this._onDidChange = new vscode.EventEmitter();
        this.dot = "";
        this.type = "";
        this.workspaceFolderName = "";
        this.onDidChange = this._onDidChange.event;
    }
    provideTextDocumentContent(uri, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let template = yield helpers_1.read(this.ctx.asAbsolutePath('out/src/ui/graph.html'));
            let svgDoc = Viz(this.dot);
            let start = svgDoc.indexOf('<svg');
            let end = svgDoc.indexOf('</svg>', start);
            let element = svgDoc.substr(start, end - start + 6);
            return template_1.loadTemplate(this.ctx.asAbsolutePath('out/src/ui/graph.html'), {
                type: this.type,
                element: element,
                workspaceFolderName: this.workspaceFolderName
            });
        });
    }
    update(dot, type, workspaceFolderName) {
        this.dot = dot;
        this.type = type;
        this.workspaceFolderName = workspaceFolderName;
        this._onDidChange.fire();
    }
}
exports.GraphContentProvider = GraphContentProvider;
function replaceNodesWithLinks(index, dot) {
    const regex = /(\[[a-z0-9 ]+\] )?([^ ]+)/;
    let graph = Dot.read(dot);
    let changedNodes = new Map();
    for (let node of graph.nodes()) {
        let targetId = node.match(regex)[2];
        let section = index.section(targetId);
        if (section) {
            changedNodes.set(node, section);
        }
    }
    for (let [node, section] of changedNodes) {
        graph.setNode(node, { href: `terraform-section:${section.id()}` });
    }
    return Dot.write(graph);
}
function graphCommand(indexLocator, provider) {
    return __awaiter(this, void 0, void 0, function* () {
        const types = ['plan', 'plan-destroy', 'apply',
            'validate', 'input', 'refresh'];
        let type = yield vscode.window.showQuickPick(types, { placeHolder: "Choose graph type" });
        let workspaceFolder = yield vscode.window.showWorkspaceFolderPick({ placeHolder: "Choose workspace folder" });
        if (!workspaceFolder) {
            vscode.window.showErrorMessage("You need to select a workspace folder");
            return;
        }
        if (workspaceFolder.uri.scheme !== "file") {
            vscode.window.showErrorMessage("Workspace folder needs to use the file:/// uri scheme.");
            return;
        }
        let index = indexLocator.getIndexForWorkspaceFolder(workspaceFolder);
        try {
            let dot = yield runner_1.runTerraform(workspaceFolder, ["graph", "-draw-cycles", `-type=${type}`, "."], { reportMetric: true });
            let processedDot = replaceNodesWithLinks(index, dot);
            // make background transparent
            processedDot = processedDot.replace('digraph {\n', 'digraph {\n  bgcolor="transparent";\n');
            provider.update(processedDot, type, workspaceFolder.name);
            yield vscode.commands.executeCommand('vscode.previewHtml', exports.graphPreviewUri, vscode.ViewColumn.Active, 'Terraform Graph');
        }
        catch (e) {
            extension_1.outputChannel.appendLine('Generating graph preview failed:');
            let lines = e.split(/[\r?\n]+/);
            for (let line of lines)
                extension_1.outputChannel.appendLine('\t' + line);
            extension_1.outputChannel.show();
            yield vscode.window.showErrorMessage(`Error generating graph, see output view.`);
        }
    });
}
exports.graphCommand = graphCommand;

//# sourceMappingURL=graph.js.map
