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
const assertEx_1 = require("./assertEx");
const assert = require("assert");
suite("assertEx", () => {
    test("areUnorderedArraysEqual", () => {
        assertEx_1.unorderedArraysEqual([], []);
        assertEx_1.notUnorderedArraysEqual([], [1]);
        assertEx_1.unorderedArraysEqual([1], [1]);
        assertEx_1.notUnorderedArraysEqual([1], [1, 2]);
        assertEx_1.unorderedArraysEqual([1, 2], [1, 2]);
        assertEx_1.unorderedArraysEqual([1, 2], [2, 1]);
        assertEx_1.notUnorderedArraysEqual([1, 2], [2, 1, 3]);
    });
    suite("throwsAsync", () => {
        test("throws", () => __awaiter(this, void 0, void 0, function* () {
            yield assertEx_1.throwsOrRejectsAsync(() => __awaiter(this, void 0, void 0, function* () {
                throw new Error("this is an error");
            }), {
                message: "this is an error"
            });
        }));
        test("rejects", () => __awaiter(this, void 0, void 0, function* () {
            yield assertEx_1.throwsOrRejectsAsync(() => {
                return Promise.reject(new Error("This is a rejection. Don't take it personally."));
            }, {
                message: "This is a rejection. Don't take it personally."
            });
        }));
        test("wrong message", () => __awaiter(this, void 0, void 0, function* () {
            let error;
            try {
                yield assertEx_1.throwsOrRejectsAsync(() => {
                    throw new Error("this is an error");
                }, {
                    message: "I'm expecting too much"
                });
            }
            catch (err) {
                error = err;
            }
            assert.equal(error && error.message, "Error did not have the expected value for property 'message'");
        }));
        test("fails", () => __awaiter(this, void 0, void 0, function* () {
            let error;
            try {
                yield assertEx_1.throwsOrRejectsAsync(() => {
                    return Promise.resolve();
                }, {
                    message: "This is a rejection. Don't take it personally."
                });
            }
            catch (err) {
                error = err;
            }
            assert.equal(error && error.message, "Expected exception or rejection: This is a rejection. Don't take it personally.");
        }));
    });
});
//# sourceMappingURL=assertEx.test.js.map