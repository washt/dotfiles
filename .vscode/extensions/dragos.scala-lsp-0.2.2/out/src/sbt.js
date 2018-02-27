"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class Sbt {
    constructor(context) {
        // sbt command support
        let terminal = null;
        const runCommandInIntegratedTerminal = (args, cwd) => {
            if (terminal === null) {
                terminal = vscode_1.window.createTerminal('sbt');
                // start sbt
                terminal.sendText('sbt', true);
            }
            terminal.show();
            terminal.sendText(args.join(' '));
        };
        const runSbtCommand = (args, cwd) => {
            vscode_1.workspace.saveAll().then(() => {
                if (!cwd) {
                    cwd = vscode_1.workspace.rootPath;
                }
                if (typeof vscode_1.window.createTerminal === 'function') {
                    runCommandInIntegratedTerminal(args, cwd);
                }
            });
        };
        const runSbtUpdate = () => {
            runSbtCommand(['update']);
        };
        const runSbtCompile = () => {
            runSbtCommand(['compile']);
        };
        const runSbtRun = () => {
            runSbtCommand(['run']);
        };
        const runSbtTest = () => {
            runSbtCommand(['test']);
        };
        const runSbtClean = () => {
            runSbtCommand(['clean']);
        };
        const runSbtReload = () => {
            runSbtCommand(['reload']);
        };
        const runSbtPackage = () => {
            runSbtCommand(['package']);
        };
        const runSbtEnsimeConfig = () => {
            runSbtCommand(['ensimeConfig']);
        };
        const runSbtscalariformFormat = () => {
            runSbtCommand(['scalariformFormat']);
        };
        const registerCommands = (ctx) => {
            ctx.subscriptions.push(vscode_1.commands.registerCommand('sbt.update', runSbtUpdate), vscode_1.commands.registerCommand('sbt.compile', runSbtCompile), vscode_1.commands.registerCommand('sbt.run', runSbtRun), vscode_1.commands.registerCommand('sbt.test', runSbtTest), vscode_1.commands.registerCommand('sbt.clean', runSbtClean), vscode_1.commands.registerCommand('sbt.reload', runSbtReload), vscode_1.commands.registerCommand('sbt.package', runSbtPackage), vscode_1.commands.registerCommand('sbt.ensimeConfig', runSbtEnsimeConfig), vscode_1.commands.registerCommand('sbt.scalariformFormat', runSbtscalariformFormat));
        };
        registerCommands(context);
    }
    dispose() {
        // NOP
    }
}
exports.Sbt = Sbt;
;
//# sourceMappingURL=sbt.js.map