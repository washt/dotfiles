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
const path = require("path");
const utils_1 = require("./utils");
const railsDeclaration_1 = require("./railsDeclaration");
const minimatch = require("minimatch");
const constants_1 = require("./constants");
const lineByLine = require("n-readlines");
const rails_helper_1 = require("../src/rails_helper");
var TriggerCharacter;
(function (TriggerCharacter) {
    TriggerCharacter[TriggerCharacter["dot"] = 0] = "dot";
    TriggerCharacter[TriggerCharacter["quote"] = 1] = "quote";
    TriggerCharacter[TriggerCharacter["colon"] = 2] = "colon";
})(TriggerCharacter = exports.TriggerCharacter || (exports.TriggerCharacter = {}));
function modelQueryInterface() {
    var suggestions = [];
    let query_methods = [
        "find_by",
        "first",
        "last",
        "take",
        "find",
        "find_each",
        "find_in_batches",
        "create_with",
        "distinct",
        "eager_load",
        "extending",
        "from",
        "group",
        "having",
        "includes",
        "joins",
        "left_outer_joins",
        "limit",
        "lock",
        "none",
        "offset",
        "order",
        "preload",
        "readonly",
        "references",
        "reorder",
        "reverse_order",
        "select",
        "where",
        "all"
    ];
    query_methods.forEach(value => {
        let item = new vscode.CompletionItem(value);
        item.insertText = value;
        item.kind = vscode.CompletionItemKind.Method;
        suggestions.push(item);
    });
    return suggestions;
}
exports.modelQueryInterface = modelQueryInterface;
function getCols(fileAbsPath, position, triggerCharacter, prefix) {
    var liner = new lineByLine(fileAbsPath), cols = [], line, lineNumber = 0, lineIndex = -1;
    while ((line = liner.next())) {
        let lineText = line.toString("utf8").trim();
        if (/^#\s+([a-z0-9_]+)/.test(lineText)) {
            let col = /^#\s+([a-z0-9_]+)/.exec(lineText)[1];
            let name = prefix ? prefix + col : col;
            let item = new vscode.CompletionItem(name);
            item.insertText = name;
            item.kind = vscode.CompletionItemKind.Field;
            // @todo? move cusor next to quote eg. Client.where('locked' => true) :id=>
            cols.push(item);
        }
        lineNumber++;
    }
    return cols;
}
function getMethods(fileAbsPath) {
    var liner = new lineByLine(fileAbsPath), methods = [], line, lineNumber = 0, markAsStart = false, markAsEnd = false, lineIndex = -1;
    while ((line = liner.next())) {
        let lineText = line.toString("utf8").trim();
        if (/^class\s+<<\s+self/.test(lineText)) {
            markAsStart = true;
            markAsEnd = false;
        }
        if (/^private$/.test(lineText)) {
            markAsEnd = true;
        }
        if (markAsEnd)
            continue;
        if (markAsStart && constants_1.PATTERNS.FUNCTION_DECLARATON.test(lineText)) {
            let func = lineText.replace(constants_1.PATTERNS.FUNCTION_DECLARATON, "");
            let item = new vscode.CompletionItem(func);
            item.insertText = func;
            item.kind = vscode.CompletionItemKind.Method;
            methods.push(item);
        }
        lineNumber++;
    }
    return methods;
}
class RailsCompletionItemProvider {
    constructor() {
        this.pkgsList = new Map();
    }
    provideCompletionItems(document, position, token) {
        return this.provideCompletionItemsInternal(document, position, token, vscode.workspace.getConfiguration("rails", document.uri));
    }
    provideCompletionItemsInternal(document, position, token, config) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var suggestions = [];
            let filename = document.fileName;
            let lineText = document.lineAt(position.line).text;
            let lineTillCurrentPosition = lineText.substr(0, position.character);
            console.log(`lineTillCurrentPosition:${lineTillCurrentPosition}`);
            let character = lineTillCurrentPosition[lineTillCurrentPosition.length - 1];
            // let autocompleteUnimportedPackages = config['autocompleteUnimportedPackages'] === true && !lineText.match(/^(\s)*(import|package)(\s)+/);
            if (lineText.match(/^\s*\/\//)) {
                return resolve([]);
            }
            var triggerCharacter;
            switch (character) {
                case ".":
                    triggerCharacter = TriggerCharacter.dot;
                    break;
                case '"':
                case "'":
                    triggerCharacter = TriggerCharacter.quote;
                    break;
                case ":":
                    triggerCharacter = TriggerCharacter.colon;
            }
            console.log(`triggerCharacter:${triggerCharacter}`);
            // let inString = isPositionInString(document, position);
            // if (!inString && lineTillCurrentPosition.endsWith('\"')) {
            //     return resolve([]);
            // }
            // get current word
            let position2 = new vscode.Position(position.line, position.character - 1);
            if (constants_1.PATTERNS.CLASS_STATIC_METHOD_CALL.test(lineTillCurrentPosition)) {
                let [, id, model] = constants_1.PATTERNS.CLASS_STATIC_METHOD_CALL.exec(lineTillCurrentPosition);
                position2 = new vscode.Position(position.line, lineText.indexOf(id));
            }
            let wordAtPosition = document.getWordRangeAtPosition(position2);
            let word = document.getText(wordAtPosition);
            let currentWord = "";
            if (wordAtPosition &&
                wordAtPosition.start.character < position.character) {
                currentWord = word.substr(0, position.character - wordAtPosition.start.character);
            }
            if (currentWord.match(/^\d+$/)) {
                return resolve([]);
            }
            console.log(character);
            if (triggerCharacter == TriggerCharacter.dot) {
                let info, fileType;
                try {
                    info = yield railsDeclaration_1.definitionLocation(document, position2);
                    fileType = utils_1.dectFileType(info.file);
                }
                catch (e) {
                    console.error(e);
                    reject(e);
                }
                switch (fileType) {
                    case constants_1.FileType.Model: // model static methods
                        suggestions.push(...modelQueryInterface());
                        let methods = getMethods(info.file);
                        suggestions.push(...methods);
                        let cols = getCols(info.file, position, triggerCharacter, "find_by_");
                        suggestions.push(...cols);
                        break;
                }
            }
            else if (triggerCharacter == TriggerCharacter.colon ||
                triggerCharacter == TriggerCharacter.quote) {
                if (constants_1.PATTERNS.CLASS_STATIC_METHOD_CALL.test(lineTillCurrentPosition)) {
                    let [, id, model] = constants_1.PATTERNS.CLASS_STATIC_METHOD_CALL.exec(lineTillCurrentPosition);
                    let position2 = new vscode.Position(position.line, lineText.indexOf(id));
                    let info, fileType;
                    try {
                        info = yield railsDeclaration_1.definitionLocation(document, position2);
                        fileType = utils_1.dectFileType(info.file);
                    }
                    catch (e) {
                        console.error(e);
                        reject(e);
                    }
                    switch (fileType) {
                        case constants_1.FileType.Model: // model field suggestion
                            let cols = getCols(info.file, position, triggerCharacter);
                            suggestions.push(...cols);
                            break;
                    }
                }
                else if (constants_1.PATTERNS.RENDER_DECLARATION.test(lineTillCurrentPosition.trim()) ||
                    constants_1.PATTERNS.RENDER_TO_STRING_DECLARATION.test(lineTillCurrentPosition.trim()) ||
                    constants_1.PATTERNS.LAYOUT_DECLARATION.test(lineTillCurrentPosition.trim())) {
                    let matches = lineTillCurrentPosition.match(/([a-z]+)/g), id = matches.pop();
                    console.log("render type:" + id);
                    switch (id) {
                        case "partial": // @todo if it is not controller related partial
                            var relativeFileName = vscode.workspace.asRelativePath(document.fileName), rh = new rails_helper_1.RailsHelper(relativeFileName, null);
                            var paths = rh.searchPaths().filter((v) => {
                                return (v.startsWith(constants_1.REL_LAYOUTS) === false &&
                                    v.startsWith(constants_1.REL_VIEWS) === true);
                            });
                            console.log(`paths:${paths}`);
                            var items = yield rh.generateList(paths).then(list => {
                                let partials = list
                                    .map(v => path.parse(v).name.split(".")[0])
                                    .filter(v => {
                                    return v.startsWith("_");
                                });
                                console.log(`partials:${partials}`);
                                let items = partials.map((v) => {
                                    let name = v.substring(1);
                                    let item = new vscode.CompletionItem(name);
                                    item.insertText =
                                        triggerCharacter == TriggerCharacter.colon
                                            ? " '" + name + "'"
                                            : name;
                                    item.kind = vscode.CompletionItemKind.File;
                                    return item;
                                });
                                return items;
                            });
                            suggestions.push(...items);
                            break;
                        case "template": // @todo if it is base application controller or helper suggest all views
                            var relativeFileName = vscode.workspace.asRelativePath(document.fileName), rh = new rails_helper_1.RailsHelper(relativeFileName, null);
                            var paths = rh.searchPaths().filter((v) => {
                                return (v.startsWith(constants_1.REL_LAYOUTS) === false &&
                                    v.startsWith(constants_1.REL_VIEWS) === true);
                            });
                            var items = yield rh.generateList(paths).then(list => {
                                let templates = list
                                    .map(v => path.basename(v.substring(constants_1.REL_VIEWS.length + 1).split(".")[0]))
                                    .filter(v => {
                                    return path.basename(v).startsWith("_") === false;
                                });
                                let items = templates.map((v) => {
                                    let name = v;
                                    let item = new vscode.CompletionItem(name);
                                    item.insertText =
                                        triggerCharacter == TriggerCharacter.colon
                                            ? " '" + name + "'"
                                            : name;
                                    item.kind = vscode.CompletionItemKind.File;
                                    return item;
                                });
                                return items;
                            });
                            suggestions.push(...items);
                            if (TriggerCharacter.quote == triggerCharacter) {
                                var views = yield vscode.workspace
                                    .findFiles(path.join(constants_1.REL_VIEWS, "**"), constants_1.REL_LAYOUTS)
                                    .then(res => {
                                    return res
                                        .filter(v => {
                                        let p = vscode.workspace.asRelativePath(v);
                                        return (paths.some(v2 => {
                                            return !minimatch(p, v2);
                                        }) || path.basename(p).startsWith("_"));
                                    })
                                        .map(i => {
                                        let name = vscode.workspace
                                            .asRelativePath(i)
                                            .substring(constants_1.REL_VIEWS.length + 1)
                                            .split(".")[0], item = new vscode.CompletionItem(name);
                                        item.insertText =
                                            triggerCharacter == TriggerCharacter.colon
                                                ? " '" + name + "'"
                                                : name;
                                        item.kind = vscode.CompletionItemKind.File;
                                        return item;
                                    });
                                });
                                suggestions.push(...views);
                            }
                            break;
                        case "layout":
                            var views = yield vscode.workspace
                                .findFiles(path.join(constants_1.REL_LAYOUTS, "**"), null)
                                .then(res => {
                                return res.map(i => {
                                    let name = vscode.workspace
                                        .asRelativePath(i)
                                        .substring(constants_1.REL_LAYOUTS.length + 1)
                                        .split(".")[0], item = new vscode.CompletionItem(name);
                                    item.insertText =
                                        triggerCharacter == TriggerCharacter.colon
                                            ? " '" + name + "'"
                                            : name;
                                    item.kind = vscode.CompletionItemKind.File;
                                    return item;
                                });
                            });
                            suggestions.push(...views);
                            break;
                    }
                }
            }
            resolve(suggestions);
        }));
    }
}
exports.RailsCompletionItemProvider = RailsCompletionItemProvider;
//# sourceMappingURL=rails_completion.js.map