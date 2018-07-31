"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimatch = require("minimatch");
const vscode = require("vscode");
const extension_1 = require("../extension");
const file_index_1 = require("./file-index");
const uri_1 = require("./uri");
;
;
class Index {
    constructor(folder, ...indices) {
        this.folder = folder;
        this.Files = new Map();
        this.Sections = new Map();
        this.eventEmitter = new vscode.EventEmitter();
        this.onDidChange = this.eventEmitter.event;
        indices.map((i) => this.add(i));
    }
    get name() {
        if (!this.folder)
            return "untitled";
        return this.folder.name;
    }
    add(index) {
        this.Files.set(index.uri.toString(), index);
        index.sections.forEach((section) => {
            this.Sections.set(section.id(), section);
        });
        this.eventEmitter.fire();
    }
    delete(uri) {
        let index = this.get(uri);
        if (index) {
            index.sections.forEach((section) => {
                this.Sections.delete(section.id());
            });
        }
        this.Files.delete(uri.toString());
        this.eventEmitter.fire();
    }
    clear(silent = true) {
        this.Files.clear();
        this.Sections.clear();
        if (!silent)
            this.eventEmitter.fire();
    }
    indices(uri) {
        if (uri === "ALL_FILES")
            return [...this.Files.values()];
        else {
            const index = this.get(uri);
            if (!index)
                return [];
            return [index];
        }
    }
    get(uri) {
        return this.Files.get(uri.toString());
    }
    section(id) {
        return this.Sections.get(id);
    }
    query(uri, options) {
        if (options && (options.name_position || options.position) && uri === "ALL_FILES") {
            throw "Cannot use ALL_FILES when querying for position or name_position";
        }
        let uris = uri === "ALL_FILES" ? [...this.Files.keys()] : [uri.toString()];
        let indices = uris.map((u) => this.Files.get(u)).filter((i) => i != null);
        let sections = indices.reduce((a, i) => a.concat(...i.query(options)), new Array());
        if (options && options.unique) {
            return sections.filter((section, index, self) => {
                return self.findIndex((other) => other.id() === section.id()) === index;
            });
        }
        return sections;
    }
    queryReferences(uri, options) {
        if (options.position && uri === "ALL_FILES") {
            throw "Cannot use ALL_FILES when querying for position";
        }
        return [].concat(...this.indices(uri).map((f) => [...f.queryReferences(options)]));
    }
    getOrIndexDocument(document, options = {}) {
        let index = this.Files.get(document.uri.toString());
        if (index) {
            return index;
        }
        return this.indexDocument(document, options);
    }
    indexDocument(document, options = {}) {
        if (options.exclude) {
            let path = vscode.workspace.asRelativePath(document.uri).replace('\\', '/');
            let matches = options.exclude.map((pattern) => {
                return minimatch(path, pattern);
            });
            if (matches.some((v) => v)) {
                // ignore
                return;
            }
        }
        let [index, diagnostic] = file_index_1.FileIndex.fromString(uri_1.Uri.parse(document.uri.toString()), document.getText());
        let diagnostics = [];
        if (diagnostic) {
            const range = new vscode.Range(diagnostic.range.start.line, diagnostic.range.start.character, diagnostic.range.end.line, diagnostic.range.end.character);
            diagnostics.push(new vscode.Diagnostic(range, diagnostic.message, vscode.DiagnosticSeverity.Error)); // TODO: actually map severity
        }
        if (index) {
            diagnostics.push(...index.diagnostics.map((d) => {
                const range = new vscode.Range(d.range.start.line, d.range.start.character, d.range.end.line, d.range.end.character);
                return new vscode.Diagnostic(range, d.message, vscode.DiagnosticSeverity.Error); // TODO: actually map severity
            }));
            this.add(index);
        }
        extension_1.ErrorDiagnosticCollection.set(document.uri, diagnostics);
        return index;
    }
    getProviderDeclarations() {
        return this.query("ALL_FILES", { section_type: "provider" }).map((s) => {
            return {
                name: s.name,
                alias: s.attributes.get('alias'),
                version: s.attributes.get('version')
            };
        });
    }
}
exports.Index = Index;

//# sourceMappingURL=index.js.map
