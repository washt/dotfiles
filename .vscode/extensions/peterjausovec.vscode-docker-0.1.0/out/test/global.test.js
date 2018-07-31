"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const fse = require("fs-extra");
var constants;
(function (constants) {
    constants.testOutputName = 'testOutput';
})(constants = exports.constants || (exports.constants = {}));
// The root workspace folder that vscode is opened against for tests
let testRootFolder;
function getTestRootFolder() {
    if (!testRootFolder) {
        // We're expecting to be opened against the test/test.code-workspace
        // workspace.
        let workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            console.error("No workspace is open.");
            process.exit(1);
        }
        if (workspaceFolders.length > 1) {
            console.error("There are unexpected multiple workspaces open");
            process.exit(1);
        }
        testRootFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
        console.log(`testRootFolder: ${testRootFolder}`);
        if (path.basename(testRootFolder) !== constants.testOutputName) {
            console.error("vscode is opened against the wrong folder for tests");
            process.exit(1);
        }
        fse.ensureDirSync(testRootFolder);
        fse.emptyDirSync(testRootFolder);
    }
    return testRootFolder;
}
exports.getTestRootFolder = getTestRootFolder;
// Runs before all tests
suiteSetup(function () {
});
// Runs after all tests
suiteTeardown(function () {
    if (testRootFolder && path.basename(testRootFolder) === constants.testOutputName) {
        fse.emptyDir(testRootFolder);
    }
});
//# sourceMappingURL=global.test.js.map