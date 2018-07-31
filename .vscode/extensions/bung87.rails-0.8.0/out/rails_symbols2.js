"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rp = require("request-promise-native");
let url = "http://api.rubyonrails.org/js/search_index.js";
rp(url)
    .then(function (js) {
    var theVar = eval(js);
    console.log(Object.keys(theVar));
})
    .catch(function (err) {
    // Crawling failed...
    console.log(err);
});
//# sourceMappingURL=rails_symbols2.js.map