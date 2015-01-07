var repo = require('./repo');
var server = require('./server');
/* globals -Promise */
var Promise = require('bluebird');

function booting(options) {
    Promise.longStackTraces(); // ToDo: configure
    return repo.connecting(options.database).then(function () {
        return server.starting(options.server);
    });
}

module.exports = {
    booting: booting
};