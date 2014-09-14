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
    Knex.knex = Knex.initialize(options);
    return migrateLatest().then(function () {
        if(options.testdata.create) {
            return testdata.creating();
        }
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

function migrateLatest() {
    return Knex.knex.migrate.latest();
}

module.exports = _.merge(models, {
    connecting: connecting,
    disconnecting: disconnecting,
});