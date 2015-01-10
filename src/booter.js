/* globals -Promise */
var Promise = require('bluebird');
var bunyan = require('bunyan');

var repo = require('./repo');
var server = require('./server');


function booting(options) {
    Promise.longStackTraces(); // ToDo: configure
    var app = {};
    app.options = options;
    var log = bunyan.createLogger(app.options.app.bunyan);
    app.log = log;
    app.options.database.silent = app.options.app.silent;
    if(options.app.args.flags.dbRecreate) {
        app.options.database.testdata.create = true;
    }
    return repo.connecting(app.options.database).then(function (repo) {
        app.repo = repo;
        app.repo.log = app.log;
        return server.starting(app);
    }).then(function (server) {
        app.server = server;
        return app;
    });
}

module.exports = {
    booting: booting
};