"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path_1 = require("path");
function getConfig(uri) {
    return vscode_1.workspace.getConfiguration('prettier', uri);
}
exports.getConfig = getConfig;
function getParsersFromLanguageId(languageId, version, path) {
    const language = getSupportLanguages(version).find(lang => lang.vscodeLanguageIds.includes(languageId) &&
        (lang.extensions.length > 0 ||
            (path != null &&
                lang.filenames != null &&
                lang.filenames.includes(path_1.basename(path)))));
    if (!language) {
        return [];
    }
    return language.parsers;
}
exports.getParsersFromLanguageId = getParsersFromLanguageId;
function allEnabledLanguages() {
    return getSupportLanguages().reduce((ids, language) => [...ids, ...language.vscodeLanguageIds], []);
}
exports.allEnabledLanguages = allEnabledLanguages;
function allJSLanguages() {
    return getGroup('JavaScript')
        .filter(language => language.group === 'JavaScript')
        .reduce((ids, language) => [...ids, ...language.vscodeLanguageIds], []);
}
exports.allJSLanguages = allJSLanguages;
function getGroup(group) {
    return getSupportLanguages().filter(language => language.group === group);
}
exports.getGroup = getGroup;
function getSupportLanguages(version) {
    return require('prettier').getSupportInfo(version).languages;
}
//# sourceMappingURL=utils.js.map