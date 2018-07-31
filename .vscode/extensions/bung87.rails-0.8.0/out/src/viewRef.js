"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const constants_1 = require("../src/constants");
const rails_1 = require("./symbols/rails");
const missingFilelMsg = "Missing file: ";
const couldNotOpenMsg = "Could Not Open file: ";
const SYMBOL_END = "[^\\w]";
function findViews(document, position, _path, fileType = "", viewType = "partial" // partial or template
) {
    let filePath, isSameDirPartial = /^[a-zA-Z0-9_-]+$/.test(_path), isViewsRelativePath = _path.indexOf("/") !== -1, ext = path.parse(_path).ext, _underscore = viewType == "partial" ? "_" : "", definitionInformation = {
        file: null,
        line: 0
    };
    if (isSameDirPartial) {
        let fileName = vscode.workspace.asRelativePath(document.fileName), dir = path.dirname(fileName);
        filePath = path.join(dir, `${_underscore}${_path}${fileType}.*`);
        definitionInformation.file = filePath;
    }
    else if (ext) {
        filePath = path.join(constants_1.REL_VIEWS, _path);
        definitionInformation.file = filePath;
    }
    else if (isViewsRelativePath) {
        filePath = path.join(constants_1.REL_VIEWS, path.dirname(_path), `${_underscore}${path.basename(_path)}${fileType}.*`);
        definitionInformation.file = filePath;
    }
    else {
        return Promise.resolve(null);
    }
    console.log(filePath, isViewsRelativePath, isSameDirPartial);
    let promise = new Promise(definitionResolver(document, definitionInformation));
    return promise;
}
exports.findViews = findViews;
var FileTypeHandlers = new Map([
    [constants_1.FileType.View, findViews]
    // [FileType.Model, modelDefinitionLocation],
    // [FileType.Unkown, findLocationByWord]
]);
function definitionResolver(document, definitionInformation, exclude = null, maxNum = null) {
    return (resolve, reject) => {
        vscode.workspace
            .findFiles(vscode.workspace.asRelativePath(definitionInformation.file))
            .then((uris) => {
            console.log(uris);
            if (!uris.length) {
                reject(missingFilelMsg + definitionInformation.file);
            }
            else if (uris.length == 1) {
                definitionInformation.file = uris[0].fsPath;
                resolve(definitionInformation);
            }
            else {
                // let relativeFileName = vscode.workspace.asRelativePath(
                //     document.fileName
                //   ),
                //   rh = new RailsHelper(relativeFileName, null);
                // rh.showQuickPick(
                //   uris.map(uri => vscode.workspace.asRelativePath(uri.path))
                // );
                resolve(null);
            }
        }, () => {
            reject(missingFilelMsg + definitionInformation.file);
        });
    };
}
exports.definitionResolver = definitionResolver;
function definitionLocation(document, position, goConfig, token) {
    let wordRange = document.getWordRangeAtPosition(position, /([A-Za-z\/0-9_-]+)(\.[A-Za-z0-9]+)*/);
    let lineText = document.lineAt(position.line).text.trim();
    let lineStartToWord = document
        .getText(new vscode.Range(new vscode.Position(position.line, 0), wordRange.end))
        .trim();
    let lineStartToWordStart = document
        .getText(new vscode.Range(new vscode.Position(position.line, 0), wordRange.start))
        .trim();
    let matched = lineStartToWordStart.match(constants_1.PATTERNS.RENDER_MATCH), preWord = matched && matched[matched.length - 1], viewType = preWord && !preWord.includes("render") ? preWord : "partial";
    console.log(`viewType:${viewType}`);
    let word = document.getText(wordRange);
    console.log(word);
    // if (lineText.startsWith("/") || word.match(/^\d+.?\d+$/)) {
    //   return Promise.resolve(null);
    // }
    if (!goConfig) {
        goConfig = vscode.workspace.getConfiguration("rails");
    }
    let symbol = new RegExp("(((::)?[A-Za-z]+)*(::)?" + word + ")").exec(lineStartToWord)[1];
    if (rails_1.RAILS.has(symbol)) {
        console.log("rails symbols");
        return Promise.resolve(null);
    }
    let renderMatched = lineText.match(constants_1.VIEWS_PATTERNS.RENDER_PATTERN);
    if (renderMatched) {
        console.log(renderMatched);
        return findViews(document, position, word, "", viewType);
    }
}
exports.definitionLocation = definitionLocation;
class ViewDefinitionProvider {
    constructor(goConfig) {
        this.goConfig = null;
        this.goConfig = goConfig;
    }
    provideDefinition(document, position, token) {
        return definitionLocation(document, position, this.goConfig, token).then(definitionInfo => {
            if (definitionInfo == null || definitionInfo.file == null)
                return null;
            let definitionResource = vscode.Uri.file(definitionInfo.file);
            let pos = new vscode.Position(definitionInfo.line, definitionInfo.column);
            return new vscode.Location(definitionResource, pos);
        }, err => {
            if (err) {
                // Prompt for missing tool is located here so that the
                // prompts dont show up on hover or signature help
                if (typeof err === "string" && err.startsWith(missingFilelMsg)) {
                    // promptForMissingTool(err.substr(missingToolMsg.length));
                }
                else {
                    return Promise.reject(err);
                }
            }
            return Promise.resolve(null);
        });
    }
}
exports.ViewDefinitionProvider = ViewDefinitionProvider;
//# sourceMappingURL=viewRef.js.map