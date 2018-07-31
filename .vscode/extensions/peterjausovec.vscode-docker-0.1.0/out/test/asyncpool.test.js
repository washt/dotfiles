"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'assert' provides assertion methods from node
const assert = require("assert");
const asyncpool_1 = require("../utils/asyncpool");
suite("AsyncPool Tests", () => {
    test("Counting, Low Worker Count", () => __awaiter(this, void 0, void 0, function* () {
        let pool = new asyncpool_1.AsyncPool(2);
        let counter = 0;
        for (let i = 0; i < 10000; i++) {
            pool.addTask(() => __awaiter(this, void 0, void 0, function* () {
                counter++;
            }));
        }
        yield pool.runAll();
        assert.equal(counter, 10000);
    }));
    test("Counting, High Worker Count", () => __awaiter(this, void 0, void 0, function* () {
        let pool = new asyncpool_1.AsyncPool(300);
        let counter = 0;
        for (let i = 0; i < 10000; i++) {
            pool.addTask(() => __awaiter(this, void 0, void 0, function* () {
                counter++;
            }));
        }
        yield pool.runAll();
        assert.equal(counter, 10000);
    }));
    test("Counting, Resonable Worker Count", () => __awaiter(this, void 0, void 0, function* () {
        let pool = new asyncpool_1.AsyncPool(10);
        let counter = 0;
        for (let i = 0; i < 10000; i++) {
            pool.addTask(() => __awaiter(this, void 0, void 0, function* () {
                counter++;
            }));
        }
        yield pool.runAll();
        assert.equal(counter, 10000);
    }));
    test("Timer, Random 1-6 ms tests", () => __awaiter(this, void 0, void 0, function* () {
        let pool = new asyncpool_1.AsyncPool(8);
        let counter = 0;
        for (let i = 0; i < 1000; i++) {
            pool.addTask(() => __awaiter(this, void 0, void 0, function* () {
                yield sleep(Math.random() * 6);
                counter++;
            }));
        }
        yield pool.runAll();
        assert.equal(counter, 1000);
    }));
    test("Timer, 5ms , High Worker Count", () => __awaiter(this, void 0, void 0, function* () {
        let pool = new asyncpool_1.AsyncPool(300);
        let counter = 0;
        for (let i = 0; i < 10000; i++) {
            pool.addTask(() => __awaiter(this, void 0, void 0, function* () {
                yield sleep(5);
                counter++;
            }));
        }
        yield pool.runAll();
        assert.equal(counter, 10000);
    }));
    test("Empty array", () => __awaiter(this, void 0, void 0, function* () {
        let pool = new asyncpool_1.AsyncPool(8);
        let arr = [];
        for (let i = 0; i < 30000; i++) {
            arr.push('testData' + i);
        }
        for (let i = 0; i < 30000; i++) {
            pool.addTask(() => __awaiter(this, void 0, void 0, function* () {
                arr.pop();
            }));
        }
        yield pool.runAll();
        assert.equal(0, arr.length);
    }));
    test("Fill array", () => __awaiter(this, void 0, void 0, function* () {
        let pool = new asyncpool_1.AsyncPool(8);
        let arr = [];
        let arr2 = [];
        for (let i = 0; i < 30000; i++) {
            arr.push(i);
        }
        for (let i = 0; i < 30000; i++) {
            pool.addTask(() => __awaiter(this, void 0, void 0, function* () {
                arr2.push(i);
            }));
        }
        yield pool.runAll();
        assert.equal(arr2.length, arr.length);
        arr2.sort((a, b) => {
            if (a > b) {
                return 1;
            }
            else if (a === b) {
                return 0;
            }
            else {
                return -1;
            }
        });
        assert.deepEqual(arr2, arr);
    }));
    test("Error thrown appropiately", () => __awaiter(this, void 0, void 0, function* () {
        let pool = new asyncpool_1.AsyncPool(8);
        for (let i = 0; i < 100; i++) {
            pool.addTask(() => __awaiter(this, void 0, void 0, function* () {
                //Empty decoy functions
            }));
        }
        pool.addTask(() => __awaiter(this, void 0, void 0, function* () {
            throw 'fake Error';
        }));
        let errorThrown = false;
        try {
            yield pool.runAll();
        }
        catch (error) {
            errorThrown = true;
        }
        assert.equal(true, errorThrown);
    }));
});
//Helpers
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=asyncpool.test.js.map