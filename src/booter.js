var repo = require('./repo');
var server = require('./server');
/* globals -Promise */
var Promise = require('bluebird');

function booting(options) {
    Promise.longStackTraces(); // ToDo: configure
    var app = {
        options: options
    };
    return repo.connecting(app.options.database).then(function (repo) {
        app.repo = repo;
        return server.starting(app);
    }).then(function (server) {
        app.server = server;
        return app;
    });
}

module.exports = {
    booting: booting
};