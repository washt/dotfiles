"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("./configuration");
const helpers_1 = require("./helpers");
let runner;
function liveIndexEnabledForDocument(cfg, doc) {
    if (!helpers_1.isTerraformDocument(doc)) {
        return false;
    }
    return cfg.enabled && cfg.liveIndexing;
}
function liveIndex(indexLocator, e) {
    const cfg = configuration_1.getConfiguration().indexing;
    if (!liveIndexEnabledForDocument(cfg, e.document)) {
        return;
    }
    if (runner != null) {
        clearTimeout(runner);
    }
    runner = setTimeout(function () {
        indexLocator.getIndexForDoc(e.document).indexDocument(e.document, { exclude: cfg.exclude });
    }, cfg.liveIndexingDelay);
}
exports.liveIndex = liveIndex;

//# sourceMappingURL=live.js.map
