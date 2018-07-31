'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
/**
 * This class helps to open WebAssembly binary files.
 */
class WebAssemblyContentProvider {
    provideTextDocumentContent(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield utils_1.readWasm(uri);
            if (!buffer) {
                return;
            }
            return utils_1.wasm2wat(buffer);
        });
    }
}
exports.default = WebAssemblyContentProvider;
//# sourceMappingURL=webassembly-content-provider.js.map