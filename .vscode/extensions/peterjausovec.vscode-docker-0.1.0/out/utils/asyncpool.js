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
/*Custom asyncpool
 * Author: Esteban Rey L
 * To limit the number of asynchonous calls being done, this is helpful to limit
 * Connection requests and avoid throttling.
 */
class AsyncPool {
    constructor(asyncLimit) {
        this.asyncLimit = asyncLimit;
        this.runnableQueue = [];
        this.workers = [];
    }
    /*Runs all functions in runnableQueue by launching asyncLimit worker instances
      each of which calls an async task extracted from runnableQueue. This will
      wait for all scheduled tasks to be completed.*/
    runAll() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.asyncLimit; i++) {
                this.workers.push(this.worker());
            }
            try {
                yield Promise.all(this.workers);
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*Takes in an async Thunk to be executed by the asyncpool*/
    addTask(func) {
        this.runnableQueue.push(func);
    }
    /*Executes each passed in async function blocking while each function is run.
      Moves on to the next available thunk on completion of the previous thunk.*/
    worker() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.runnableQueue.length > 0) {
                let func = this.runnableQueue.pop();
                //Avoids possible race condition
                if (func) {
                    yield func();
                }
            }
        });
    }
}
exports.AsyncPool = AsyncPool;
//# sourceMappingURL=asyncpool.js.map