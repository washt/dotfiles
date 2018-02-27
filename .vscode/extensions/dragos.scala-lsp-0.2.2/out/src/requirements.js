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
const pathExists = require('path-exists');
const findJavaHome = require('find-java-home');
const expandHomeDir = require('expand-home-dir');
class Requirements {
    getJavaHome() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.checkJavaRuntime();
        });
    }
    checkJavaRuntime() {
        return new Promise((resolve, reject) => {
            let source;
            let javaHome = process.env['JDK_HOME'];
            if (javaHome) {
                source = 'The JDK_HOME environment variable';
            }
            else {
                javaHome = process.env['JAVA_HOME'];
                source = 'The JAVA_HOME environment variable';
            }
            if (javaHome) {
                javaHome = expandHomeDir(javaHome);
                if (!pathExists.sync(javaHome)) {
                    reject(source + ' points to a missing folder');
                }
                return resolve(javaHome);
            }
            // No settings, let's try to detect as last resort.
            findJavaHome(function (err, home) {
                if (err) {
                    reject('Java runtime could not be located');
                }
                else {
                    resolve(home);
                }
            });
        });
    }
}
exports.Requirements = Requirements;
;
//# sourceMappingURL=requirements.js.map