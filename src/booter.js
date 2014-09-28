/* globals -Promise */
var repo = require('./repo');
var server = require('./server');
var Promise = require('bluebird');

function boot(options) {
    Promise.longStackTraces(); // ToDo: configure
    repo.connecting(options.database).then(function () {
        server.start(options.server);
    });
}

module.exports = {
    boot: boot
};