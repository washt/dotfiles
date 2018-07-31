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
const assert = require("assert");
const vscode_azureextensionui_1 = require("vscode-azureextensionui");
// Provides additional assertion-style functions for use in tests.
/**
 * Asserts that two arrays are equal (non-deep), even if in different orders
 */
function unorderedArraysEqual(actual, expected, message) {
    let result = areUnorderedArraysEqual(actual, expected);
    assert(result.areEqual, `${message || "Unordered arrays are not equal"}\n${result.message}`);
}
exports.unorderedArraysEqual = unorderedArraysEqual;
/**
 * Asserts that two arrays are not equal (non-deep), even if they were ordered the same way
 */
function notUnorderedArraysEqual(actual, expected, message) {
    let result = areUnorderedArraysEqual(actual, expected);
    assert(!result.areEqual, `${message || "Unordered arrays are equal but were expected not to be"}\n${result.message}`);
}
exports.notUnorderedArraysEqual = notUnorderedArraysEqual;
/**
 * Same as assert.throws except for async functions
 * @param block Block to test
 * @param expected Properties in this object will be tested to ensure they exist in the object that is thrown
 * @param message Optional failure message
 */
function throwsOrRejectsAsync(block, expected, message) {
    return __awaiter(this, void 0, void 0, function* () {
        let error;
        try {
            yield block();
        }
        catch (err) {
            error = err;
        }
        if (!error) {
            throw new Error(`Expected exception or rejection: ${vscode_azureextensionui_1.parseError(expected).message}`);
        }
        for (let prop of Object.getOwnPropertyNames(expected)) {
            assert.equal(error[prop], expected[prop], `Error did not have the expected value for property '${prop}'`);
        }
    });
}
exports.throwsOrRejectsAsync = throwsOrRejectsAsync;
function areUnorderedArraysEqual(actual, expected) {
    actual = actual.slice();
    expected = expected.slice();
    actual.sort();
    expected.sort();
    let message = `Actual:   ${JSON.stringify(actual)}\nExpected: ${JSON.stringify(expected)}`;
    if (!(actual.length === expected.length)) {
        return { areEqual: false, message };
    }
    for (let i = 0; i < actual.length; ++i) {
        if (actual[i] !== expected[i]) {
            return { areEqual: false, message };
        }
    }
    return { areEqual: true };
}
//# sourceMappingURL=assertEx.js.map