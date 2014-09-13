/* global -Promise */
var Promise = require('bluebird');
// ToDo: use requireAll
var user = require('./user');
var entry = require('./entry');

function creating() {
    // ToDo: use linear reduce() or even hierarchial fold()
    // based in auto generated(?) dependency graph from columnInfo()
    return user.creatingTestData().then(function () {
        return entry.creatingTestData();
    });
}

module.exports = {
    creating: creating
};