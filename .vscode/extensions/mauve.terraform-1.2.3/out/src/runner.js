"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const ansi_1 = require("./ansi");
const configuration_1 = require("./configuration");
const extension_1 = require("./extension");
const telemetry_1 = require("./telemetry");
function processOutput(output, options) {
    if (options.keepAnsi)
        return output;
    return ansi_1.stripAnsi(output);
}
function runTerraform(folder, args, options = {}) {
    let path = configuration_1.getConfiguration().path;
    let cwd;
    if (typeof folder === "string")
        cwd = folder;
    else
        cwd = folder.uri.fsPath;
    extension_1.outputChannel.appendLine(`Running terraform cwd='${cwd}' path='${path}' args=[${args.join(", ")}]`);
    return new Promise((resolve, reject) => {
        const child = child_process_1.execFile(path, args, {
            encoding: 'utf8',
            maxBuffer: 1024 * 1024,
            cwd: cwd
        }, (error, stdout, stderr) => {
            if (options.reportMetric === true) {
                telemetry_1.Reporter.trackEvent("terraform-invocation", {
                    command: args[0],
                    status: error ? error.name : "success"
                });
            }
            if (error) {
                const processedOutput = processOutput(stderr, options);
                extension_1.outputChannel.appendLine(`Running terraform failed: ${error}`);
                reject(processedOutput);
            }
            else {
                extension_1.outputChannel.appendLine(`Running terraform succeeded.`);
                resolve(processOutput(stdout, options));
            }
        });
        if (options.input) {
            child.stdin.write(options.input);
            child.stdin.end();
        }
    });
}
exports.runTerraform = runTerraform;

//# sourceMappingURL=runner.js.map
