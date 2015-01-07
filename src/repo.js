var Knex = require('knex');
var fs = require('fs');
var assert = require('assert');
var _ = require('lodash');
var testdata = require('./testdata');
var path = require('path');
var models = require('require-all')(path.resolve(__dirname, 'model/'));

function connecting(options) {
    if(options.testdata.create) {
        recreate(options);
    }
    var knex = Knex.initialize(options);
    var repo = {
        knex: knex
    };
    Knex.knex = knex; // ToDo: eliminate singleton
    return migrateLatest(repo).then(function () {
        if(options.testdata.create) {
            return testdata.creating(repo);
        }
    }).then(function () {
        return repo;
    });
}

function disconnecting() {
    return Knex.knex.destroy();
}

function recreate(options) {
    assert.equal(options.client, 'sqlite3'); // ToDo: extend to other providers
    var dbfile = options.connection.filename;
    if(fs.existsSync(dbfile)) {
        fs.unlinkSync(dbfile);
    }
}

function migrateLatest(repo) {
    return repo.knex.migrate.latest();
}

module.exports = _.merge(models, {
    connecting: connecting,
    disconnecting: disconnecting
});