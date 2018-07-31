"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Uri {
    constructor(uri) {
        this.uri = uri;
    }
    static parse(uri) {
        return new Uri(uri);
    }
    toString() {
        return this.uri;
    }
}
exports.Uri = Uri;

//# sourceMappingURL=uri.js.map
