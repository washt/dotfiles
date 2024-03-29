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
const vscode_1 = require("vscode");
const ThemeCommands = require("./../commands");
const MESSAGES = {
    INFO: {
        message: 'Do you want to reload to apply Material Theme Icons to enjoy the full experience?',
        options: { ok: 'Yeah, releoad', cancel: 'No, thank you' }
    },
    CHANGELOG: {
        message: 'Material Theme was updated. Check the release notes for more details.',
        options: { ok: 'Show me', cancel: 'Maybe later' }
    }
};
exports.infoMessage = () => __awaiter(this, void 0, void 0, function* () {
    if ((yield vscode_1.window.showInformationMessage(MESSAGES.INFO.message, MESSAGES.INFO.options.ok, MESSAGES.INFO.options.cancel)) === MESSAGES.INFO.options.ok) {
        ThemeCommands.fixIcons();
    }
});
exports.changelogMessage = () => __awaiter(this, void 0, void 0, function* () { return (yield vscode_1.window.showInformationMessage(MESSAGES.CHANGELOG.message, MESSAGES.CHANGELOG.options.ok, MESSAGES.CHANGELOG.options.cancel)) === MESSAGES.CHANGELOG.options.ok; });
//# sourceMappingURL=messages.js.map