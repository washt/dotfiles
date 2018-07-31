"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const rp = require("request-promise-native");
const rails_1 = require("./symbols/rails");
const ruby_1 = require("./symbols/ruby");
// Track currently webview panel
var currentPanel = undefined;
function injectBase(html, base) {
    let policy = `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src vscode-resource: http:; script-src vscode-resource: http: 'unsafe-inline' ; style-src vscode-resource: http: 'unsafe-inline';">`;
    let _base = path.dirname(base) + "/";
    // Remove any <base> elements inside <head>
    var _html = html.replace(/(<[^>/]*head[^>]*>)[\s\S]*?(<[^>/]*base[^>]*>)[\s\S]*?(<[^>]*head[^>]*>)/gim, "$1 $3");
    // // Add <base> just before </head>
    // html = html.replace(
    //   /(<[^>/]*head[^>]*>[\s\S]*?)(<[^>]*head[^>]*>)/gim,
    // );
    _html = _html.replace(/<head>/gim, `<head><base href="${_base}">\n${policy}\n<style> body{margin:20px;}</style>`);
    return _html;
}
function doRequest(url, symbol) {
    let context = this;
    let request = rp(url)
        .then(function (htmlString) {
        let html = injectBase(htmlString, url);
        const columnToShowIn = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (currentPanel) {
            // If we already have a panel, show it in the target column
            currentPanel.webview.html = html;
            currentPanel.title = `Document ${symbol}`;
            currentPanel.reveal(columnToShowIn);
        }
        else {
            currentPanel = vscode.window.createWebviewPanel("Document", `Document ${symbol}`, vscode.ViewColumn.Two, {
                // Enable scripts in the webview
                enableScripts: true,
                retainContextWhenHidden: true
            });
            currentPanel.webview.html = html;
            // Reset when the current panel is closed
            currentPanel.onDidDispose(() => {
                currentPanel = undefined;
                request.abort();
            }, null, context.subscriptions);
        }
    })
        .catch(function (err) {
        console.error(err);
        // Crawling failed...
        // context.logger.debug(err);
    });
}
function viewDoc() {
    let context = this;
    let document = vscode.window.activeTextEditor.document;
    let position = vscode.window.activeTextEditor.selection.active;
    let wordRange = document.getWordRangeAtPosition(position);
    let word = document.getText(wordRange);
    let lineStartToWord = document
        .getText(new vscode.Range(new vscode.Position(position.line, 0), wordRange.end))
        .trim();
    let symbol = new RegExp("(((::)?[A-Za-z]+)*(::)?" + word + ")").exec(lineStartToWord)[1];
    // context.logger.debug(`symbol:${symbol}`);
    var endpoint = null;
    var is_rails_symbol = rails_1.RAILS.has(symbol.toLowerCase());
    var is_ruby_symbol = ruby_1.RUBY.has(symbol.toLowerCase());
    if (symbol && (is_rails_symbol || is_ruby_symbol)) {
        endpoint = symbol.replace("::", "/");
    }
    console.log(`symbol:${symbol},endpoint:${endpoint}`);
    // context.logger.debug(`endpoint:${endpoint}`);
    if (endpoint == null) {
        return;
    }
    var url = '';
    if (is_rails_symbol) {
        url = `http://api.rubyonrails.org/classes/${endpoint}.html`;
    }
    else if (is_ruby_symbol) {
        url = `http://docs.rubydocs.org/ruby-${ruby_1.VERSION.replace(/\./g, "-")}/classes/${endpoint}.html`;
    }
    console.log(is_rails_symbol, is_ruby_symbol);
    // let info = vscode.window.showInformationMessage("Rails:Document-loading...")
    doRequest.call(context, url, symbol);
}
exports.viewDoc = viewDoc;
//# sourceMappingURL=view_doc.js.map