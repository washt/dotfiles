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
const extensionVariables_1 = require("../extensionVariables");
/**
 * Prompts for a port number
 * @throws `UserCancelledError` if the user cancels.
 */
function promptForPort(port) {
    return __awaiter(this, void 0, void 0, function* () {
        let opt = {
            placeHolder: `${port}`,
            prompt: 'What port does your app listen on?',
            value: `${port}`
        };
        return extensionVariables_1.ext.ui.showInputBox(opt);
    });
}
exports.promptForPort = promptForPort;
/**
 * Prompts for a platform
 * @throws `UserCancelledError` if the user cancels.
 */
function quickPickPlatform() {
    return __awaiter(this, void 0, void 0, function* () {
        let opt = {
            matchOnDescription: true,
            matchOnDetail: true,
            placeHolder: 'Select Application Platform'
        };
        const platforms = [
            'Go',
            'Java',
            '.NET Core Console',
            'ASP.NET Core',
            'Node.js',
            'Python',
            'Ruby',
            'Other'
        ];
        const items = platforms.map(p => ({ label: p, data: p }));
        let response = yield extensionVariables_1.ext.ui.showQuickPick(items, opt);
        return response.data;
    });
}
exports.quickPickPlatform = quickPickPlatform;
/**
 * Prompts for an OS
 * @throws `UserCancelledError` if the user cancels.
 */
function quickPickOS() {
    return __awaiter(this, void 0, void 0, function* () {
        let opt = {
            matchOnDescription: true,
            matchOnDetail: true,
            placeHolder: 'Select Operating System'
        };
        const OSes = ['Windows', 'Linux'];
        const items = OSes.map(p => ({ label: p, data: p }));
        let response = yield extensionVariables_1.ext.ui.showQuickPick(items, opt);
        return response.data;
    });
}
exports.quickPickOS = quickPickOS;
//# sourceMappingURL=config-utils.js.map