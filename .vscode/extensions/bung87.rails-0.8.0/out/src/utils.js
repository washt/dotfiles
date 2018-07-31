"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
function dectFileType(filePath) {
    for (var [key, value] of constants_1.FileTypeRelPath) {
        if (filePath.indexOf(value) >= 0) {
            return key;
        }
    }
    return constants_1.FileType.Unkown;
}
exports.dectFileType = dectFileType;
function isPositionInString(document, position) {
    let lineText = document.lineAt(position.line).text;
    let lineTillCurrentPosition = lineText.substr(0, position.character);
    // Count the number of double quotes in the line till current position. Ignore escaped double quotes
    let doubleQuotesCnt = (lineTillCurrentPosition.match(/\"/g) || []).length;
    let escapedDoubleQuotesCnt = (lineTillCurrentPosition.match(/\\\"/g) || []).length;
    doubleQuotesCnt -= escapedDoubleQuotesCnt;
    return doubleQuotesCnt % 2 === 1;
}
exports.isPositionInString = isPositionInString;
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
exports.flatten = flatten;
//# sourceMappingURL=utils.js.map