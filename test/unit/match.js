var sinon = require('sinon');

function json (expected) {
    return sinon.match(function (actual) {
        return sinon.match(expected).test(JSON.parse(actual));
    }, JSON.stringify(expected));
}

module.exports = {
    json: json
};